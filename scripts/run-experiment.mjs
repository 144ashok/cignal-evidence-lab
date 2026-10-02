import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createFindingStore } from '../server/finding-store.mjs';

const fixtures = JSON.parse(await readFile(new URL('../server/fixtures/scenarios.json', import.meta.url), 'utf8'));
const output = new URL('../reports/', import.meta.url);
await mkdir(output, { recursive: true });
const stores = new Map();
const results = [];
for (const fixture of fixtures) {
  if (!stores.has(fixture.series)) {
    const store = createFindingStore(fileURLToPath(new URL(`../state/experiment/${fixture.series}.json`, import.meta.url)));
    await store.reset();
    stores.set(fixture.series, store);
  }
  const result = await stores.get(fixture.series).evaluate(fixture.input);
  const passed = result.status === fixture.expectedStatus && result.emissionDisposition === fixture.expectedDisposition;
  results.push({ fixtureId: fixture.id, series: fixture.series, expectedStatus: fixture.expectedStatus, expectedDisposition: fixture.expectedDisposition, passed, result });
}
// Replay the complete batch through the same stores to exercise multiple keys.
// The primary report above uses named lifecycle series to avoid fixture cross-talk.
const batchStore = createFindingStore(fileURLToPath(new URL('../state/experiment/batch.json', import.meta.url)));
await batchStore.reset();
const batch = fixtures.filter(f => ['confirmed-mismatch', 'batch-second-entity', 'similar-name-other-entity'].includes(f.id));
const first = await Promise.all(batch.map(f => batchStore.evaluate(f.input)));
const replay = await Promise.all(batch.map(f => batchStore.evaluate(f.input)));
const batchPassed = replay.every((result, index) => result.findingId === first[index].findingId && result.emissionDisposition === 'NO_NEW_NOTIFICATION');
await writeFile(new URL('results.json', output), JSON.stringify(results, null, 2) + '\n');
await writeFile(new URL('batch-replay.json', output), JSON.stringify({ passed: batchPassed, first, replay }, null, 2) + '\n');
const failures = results.filter(row => !row.passed).length + (batchPassed ? 0 : 1);
const lines = [
  '# KO #30 synthetic experiment results', '',
  `${results.length - results.filter(row => !row.passed).length}/${results.length} fixture expectations passed. Batch replay: ${batchPassed ? 'PASS' : 'FAIL'}.`, '',
  'Reproduce with `npm run experiment`. Dates come only from fixture inputs. Each series starts with empty local state; replay and correction cases share their series state.', '',
  '| Fixture | Expected status | Actual status | Expected emission | Actual emission | Result |',
  '| --- | --- | --- | --- | --- | --- |',
  ...results.map(row => `| ${row.fixtureId} | ${row.expectedStatus} | ${row.result.status} | ${row.expectedDisposition} | ${row.result.emissionDisposition} | ${row.passed ? 'PASS' : 'FAIL'} |`), '',
  'Full compared facts, checks, unresolved information, workflow, evidence versions, linkage, permissions and recommended human actions are retained in [results.json](results.json). The mixed-entity replay is in [batch-replay.json](batch-replay.json).', '',
  '## Observable results', '',
  ...results.flatMap(({ fixtureId, result }) => [
    `### ${fixtureId}`, '',
    `**${result.status} / ${result.emissionDisposition}** — ${result.reason}`, '',
    result.explanation, '',
    `Entity: ${result.entityId ?? 'unknown'}; field: ${result.changedField ?? 'unknown'}; finding: ${result.findingId ?? 'none'}; revision: ${result.revision}.`, '',
    `Compared: legal value “${result.input.legalRecord.value ?? 'unknown'}”; service value “${result.input.managedServices.value ?? 'unknown'}”; expected value “${result.input.change.newValue ?? 'unknown'}”.`, '',
    `Workflow: ${result.workflow.id ?? 'unknown'}; preparation: ${result.workflow.preparationAt ?? 'unknown'}; as-of: ${result.input.asOf ?? 'unknown'}.`, '',
    `Human next step (${result.owner}): ${result.action}`, '',
    `Linked task: ${result.links.taskId ?? 'none'}; prior finding: ${result.links.priorFindingId ?? 'none'}; evidence versions retained: ${result.evidenceHistory.length}.`, '',
    `Unresolved: ${result.unresolvedInformation.join(' ') || 'none'}`, '',
    ...result.checks.map(check => `- ${check.passed === null ? 'UNKNOWN' : check.passed ? 'PASS' : 'FAIL'}: ${check.name} — ${check.detail}`), '',
    ...result.evidence.map(item => `- Evidence: ${item.reference}; version ${item.version ?? 'not supplied'}; observed ${item.observedAt ?? 'not applicable'}.`), '',
    '`customer_communication_authorized=false`; `source_record_write_authorized=false`.', '',
  ]),
  'Passing synthetic tests establishes only agreement with these fixtures. It does not demonstrate production accuracy, legal correctness, CT integration, time savings or commercial value.', '',
];
await writeFile(new URL('test-report.md', output), lines.join('\n'));
console.log(`${results.length} fixture results written to reports/results.json and reports/test-report.md. Batch replay ${batchPassed ? 'passed' : 'failed'}. Failures: ${failures}.`);
if (failures) process.exitCode = 1;
