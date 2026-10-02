import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createFindingStore } from './finding-store.mjs';

const fixtures = JSON.parse(await readFile(new URL('./fixtures/scenarios.json', import.meta.url), 'utf8'));
test('persistent store serializes concurrent duplicate inputs and survives reopening', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'cignal-store-'));
  const file = join(folder, 'findings.json');
  const store = createFindingStore(file);
  const input = fixtures[0].input;
  const results = await Promise.all([store.evaluate(input), store.evaluate(input), store.evaluate(input)]);
  assert.deepEqual(results.map(result => result.emissionDisposition), ['CREATE', 'NO_NEW_NOTIFICATION', 'NO_NEW_NOTIFICATION']);
  const reopened = createFindingStore(file);
  assert.equal((await reopened.list()).length, 1);
  assert.equal((await reopened.evaluate(input)).emissionDisposition, 'NO_NEW_NOTIFICATION');
  const corrected = fixtures.find(fixture => fixture.id === 'replay-corrected');
  const resolution = await reopened.evaluate(corrected.input);
  assert.equal(resolution.findingId, results[0].findingId);
  assert.equal(resolution.isCurrent, false);
  assert.equal((await reopened.list()).length, 1);
  await reopened.reset();
  assert.deepEqual(await reopened.list(), []);
});
test('corrupt local state is reported, never silently discarded', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'cignal-corrupt-'));
  const file = join(folder, 'findings.json');
  await writeFile(file, '{broken');
  await assert.rejects(createFindingStore(file).evaluate(fixtures[0].input));
});
