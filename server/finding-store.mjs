import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { dirname } from 'node:path';
import { evaluate, logicalKeyFor } from '../src/engine.ts';

export function createFindingStore(file) {
  // Serialize in-process evaluations so simultaneous replays cannot both CREATE.
  let queue = Promise.resolve();
  function serial(action) {
    const pending = queue.then(action);
    queue = pending.catch(() => {});
    return pending;
  }
  async function read() {
    try {
      const data = JSON.parse(await readFile(file, 'utf8'));
      if (data.schemaVersion !== 1 || !Array.isArray(data.findings)) throw new Error('Invalid experiment state. Use the reset command to start clean.');
      return data;
    } catch (error) {
      if (error.code === 'ENOENT') return { schemaVersion: 1, findings: [] };
      throw error;
    }
  }
  async function save(data) {
    await mkdir(dirname(file), { recursive: true });
    const temporary = `${file}.tmp`;
    await writeFile(temporary, JSON.stringify(data, null, 2) + '\n');
    await rename(temporary, file);
  }
  return {
    list: () => serial(async () => (await read()).findings),
    reset: () => serial(() => save({ schemaVersion: 1, findings: [] })),
    evaluate: (raw, setupInputs = []) => serial(async () => {
      const state = await read();
      // Add required earlier findings only when absent; replay never rewinds history.
      for (const setupInput of setupInputs) {
        const setupKey = logicalKeyFor(setupInput);
        if (setupKey && !state.findings.some(item => item.logicalKey === setupKey)) {
          const setupResult = evaluate(setupInput);
          if (setupResult.findingId) state.findings.push(setupResult);
        }
      }
      const key = logicalKeyFor(raw);
      const index = key ? state.findings.findIndex(item => item.logicalKey === key) : -1;
      const result = evaluate(raw, index < 0 ? undefined : state.findings[index]);
      if (result.findingId) {
        if (index < 0) state.findings.push(result);
        else state.findings[index] = result;
      }
      if (result.findingId || setupInputs.length) await save(state);
      return result;
    }),
  };
}
