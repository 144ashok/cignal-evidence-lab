import test from 'node:test';
import assert from 'node:assert/strict';
import fixtures from '../server/fixtures/scenarios.json';
import { evaluate } from './engine';
import type { Result, EvaluationInput } from './types/experiment';

const baseline = fixtures[0].input as EvaluationInput;
const series = new Map<string, Result>();
for (const fixture of fixtures) {
  test(`fixture: ${fixture.id}`, () => {
    const previous = series.get(fixture.series);
    const result = evaluate(fixture.input, previous);
    assert.equal(result.status, fixture.expectedStatus);
    assert.equal(result.emissionDisposition, fixture.expectedDisposition);
    assert.equal(result.customer_communication_authorized, false);
    assert.equal(result.source_record_write_authorized, false);
    if (result.findingId) series.set(fixture.series, result);
  });
}

test('unknown, omitted and malformed values never become negative facts', () => {
  for (const value of [null, {}, { ...baseline, service: {} }, { ...baseline, service: { active: 'false' } }]) {
    const result = evaluate(value);
    assert.equal(result.status, 'NEEDS_EVIDENCE');
    assert.equal(result.input.service.active, null);
    assert(result.unresolvedInformation.length > 0);
  }
});
test('invalid calendar times and unknown consumed fields require evidence', () => {
  assert.equal(evaluate({ ...baseline, asOf: '2026-02-30T00:00:00Z' }).status, 'NEEDS_EVIDENCE');
  assert.equal(evaluate({ ...baseline, workflow: { ...baseline.workflow, consumesFields: null } }).status, 'NEEDS_EVIDENCE');
});
test('same logical finding survives replay and verified correction with evidence retained', () => {
  const first = evaluate(baseline);
  const replay = evaluate(baseline, first);
  const corrected = fixtures.find(fixture => fixture.id === 'replay-corrected')!;
  const resolved = evaluate(corrected.input, replay);
  assert.equal(replay.findingId, first.findingId);
  assert.equal(replay.revision, 1);
  assert.equal(replay.emissionDisposition, 'NO_NEW_NOTIFICATION');
  assert.equal(resolved.findingId, first.findingId);
  assert.equal(resolved.logicalKey, first.logicalKey);
  assert.equal(resolved.emissionDisposition, 'UPDATE');
  assert.equal(resolved.isCurrent, false);
  assert.equal(resolved.revision, 2);
  assert.equal(resolved.reason, 'CORRECTION_VERIFIED');
  assert(resolved.evidenceHistory.some(item => item.source === 'Managed Services' && item.version === 'v1'));
  assert(resolved.evidenceHistory.some(item => item.source === 'Managed Services' && item.version === 'v2'));
  const resolutionReplay = evaluate(corrected.input, resolved);
  assert.equal(resolutionReplay.reason, resolved.reason);
  assert.equal(resolutionReplay.emissionDisposition, 'NO_NEW_NOTIFICATION');
});
test('same-version edits cannot claim verified correction', () => {
  const first = evaluate(baseline);
  const edited = structuredClone(baseline);
  edited.managedServices.value = edited.change.newValue;
  assert.equal(evaluate(edited, first).status, 'NEEDS_EVIDENCE');
  const disputed = evaluate(edited, first);
  assert.equal(evaluate(edited, disputed).status, 'NEEDS_EVIDENCE');
});
test('a wrong prior-finding hint is not hidden by an unchanged fingerprint', () => {
  const first = evaluate(baseline);
  const result = evaluate({ ...baseline, priorFindingId: 'F-OTHER' }, first);
  assert.equal(result.status, 'NEEDS_EVIDENCE');
  assert(result.unresolvedInformation.some(message => message.includes('prior finding')));
});
test('older or equally observed correction cannot resolve a finding', () => {
  const first = evaluate(baseline);
  const edited = structuredClone(baseline);
  edited.managedServices.value = edited.change.newValue;
  edited.managedServices.version = 'v2';
  assert.equal(evaluate(edited, first).status, 'NEEDS_EVIDENCE');
  edited.managedServices.observedAt = '2026-09-24T00:00:00Z';
  assert.equal(evaluate(edited, first).status, 'NEEDS_EVIDENCE');
});
test('similarly named different entity never inherits a prior finding', () => {
  const first = evaluate(baseline);
  const other = fixtures.find(fixture => fixture.id === 'similar-name-other-entity')!;
  const result = evaluate(other.input, first);
  assert.equal(result.findingId, null);
  assert.equal(result.links.priorFindingId, null);
  assert.equal(result.status, 'NO_CURRENT_FINDING');
});
test('same entity different event or workflow has a different logical key', () => {
  const first = evaluate(baseline);
  const different = structuredClone(baseline);
  different.workflow.id = 'DEMO-OTHER-WORKFLOW';
  assert.notEqual(evaluate(different, first).findingId, first.findingId);
  different.workflow.id = baseline.workflow.id;
  different.change.eventId = 'DEMO-OTHER-CHANGE';
  assert.notEqual(evaluate(different, first).findingId, first.findingId);
});
test('normalization and supplied clock make results deterministic and isolated', () => {
  const input = structuredClone(baseline);
  const first = evaluate(input);
  assert.deepEqual(first, evaluate(structuredClone(input)));
  input.managedServices.value = 'Mutated';
  assert.equal(first.input.managedServices.value, baseline.managedServices.value);
});
test('verified new regression reopens the same logical finding', () => {
  const initial = evaluate(baseline);
  const corrected = fixtures.find(fixture => fixture.id === 'replay-corrected')!;
  const resolved = evaluate(corrected.input, initial);
  const reopened = structuredClone(baseline);
  reopened.asOf = '2026-10-07T00:00:00Z';
  Object.assign(reopened.managedServices, { version: 'v3', observedAt: '2026-10-07T00:00:00Z', evidenceReference: 'fixture://managed-services/DEMO-E001/v3' });
  const result = evaluate(reopened, resolved);
  assert.equal(result.findingId, initial.findingId);
  assert.equal(result.status, 'READY_FOR_REVIEW');
  assert.equal(result.emissionDisposition, 'UPDATE');
});
