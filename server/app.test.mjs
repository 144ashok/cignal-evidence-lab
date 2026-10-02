import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createApp } from './app.mjs';

let app;
let baseUrl;
before(async () => {
  const directory = await mkdtemp(join(tmpdir(), 'cignal-api-'));
  app = await createApp({ stateFile: join(directory, 'findings.json') });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${app.server.address().port}`;
});
after(async () => { await app?.close(); });

test('GET returns the fact option JSON fixture', async () => {
  const response = await fetch(`${baseUrl}/api/fact-options`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  const expected = JSON.parse(await readFile(new URL('./fixtures/fact-options.json', import.meta.url), 'utf8'));
  assert.deepEqual(await response.json(), expected);
});

test('unknown API endpoint returns JSON 404', async () => {
  const response = await fetch(`${baseUrl}/api/missing`);
  assert.equal(response.status, 404);
  assert.equal((await response.json()).error, 'API endpoint not found.');
});

test('write requests are rejected', async () => {
  const response = await fetch(`${baseUrl}/api/fact-options`, { method: 'POST' });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET, HEAD');
});

test('files outside the build directory are not served', async () => {
  const response = await fetch(`${baseUrl}/..%2fpackage.json`);
  assert.equal(response.status, 404);
});

test('HEAD requests return headers without a body', async () => {
  const response = await fetch(`${baseUrl}/api/fact-options`, { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '');
});

test('API evaluation, replay, history, resolution and reset use the same local finding', async () => {
  const scenariosResponse = await fetch(`${baseUrl}/api/scenarios`);
  assert.equal(scenariosResponse.status, 200);
  const scenarios = await scenariosResponse.json();
  const post = async (path, body) => {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    assert.equal(response.status, 200);
    return response.json();
  };
  const first = await post('/api/evaluate', scenarios[0].input);
  assert.equal(first.status, 'READY_FOR_REVIEW');
  const replay = await post('/api/evaluate', scenarios[0].input);
  assert.equal(replay.findingId, first.findingId);
  assert.equal(replay.emissionDisposition, 'NO_NEW_NOTIFICATION');
  const corrected = scenarios.find(scenario => scenario.id === 'replay-corrected');
  const resolution = await post('/api/evaluate', corrected.input);
  assert.equal(resolution.findingId, first.findingId);
  assert.equal(resolution.status, 'NO_CURRENT_FINDING');
  assert.equal(resolution.emissionDisposition, 'UPDATE');
  assert.equal((await (await fetch(`${baseUrl}/api/findings`)).json()).length, 1);
  await post('/api/reset', {});
  assert.deepEqual(await (await fetch(`${baseUrl}/api/findings`)).json(), []);
});

test('malformed request is rejected; unknown structured facts produce NEEDS_EVIDENCE', async () => {
  const bad = await fetch(`${baseUrl}/api/evaluate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(bad.status, 400);
  const unknown = await fetch(`${baseUrl}/api/evaluate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(unknown.status, 200);
  assert.equal((await unknown.json()).status, 'NEEDS_EVIDENCE');
});
