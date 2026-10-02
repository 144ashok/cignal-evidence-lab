import { writeFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createFindingStore } from '../server/finding-store.mjs';

const stateRoot = new URL('../state/', import.meta.url);
await createFindingStore(fileURLToPath(new URL('findings.json', stateRoot))).reset();
for (const directory of ['experiment', 'scenarios']) {
  await mkdir(new URL(`${directory}/`, stateRoot), { recursive: true });
  for (const file of await readdir(new URL(`${directory}/`, stateRoot))) {
    if (file.endsWith('.json')) await writeFile(new URL(`${directory}/${file}`, stateRoot), JSON.stringify({ schemaVersion: 1, findings: [] }, null, 2) + '\n');
  }
}
console.log('Local UI and experiment finding state reset. Fixture inputs and reports retained.');
