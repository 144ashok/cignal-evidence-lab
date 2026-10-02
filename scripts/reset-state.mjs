import { writeFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createFindingStore } from '../server/finding-store.mjs';

const stateRoot = new URL('../state/', import.meta.url);
await mkdir(new URL('experiment/', stateRoot), { recursive: true });
await createFindingStore(fileURLToPath(new URL('findings.json', stateRoot))).reset();
for (const file of await readdir(new URL('experiment/', stateRoot))) {
  if (file.endsWith('.json')) await writeFile(new URL(`experiment/${file}`, stateRoot), JSON.stringify({ schemaVersion: 1, findings: [] }, null, 2) + '\n');
}
console.log('Local UI and experiment finding state reset. Fixture inputs and reports retained.');
