import { readFile, writeFile } from 'node:fs/promises';

// Fixture expectations are declared here, independently of the evaluator.
const baseline = {
  fixtureId: 'confirmed-mismatch', asOf: '2026-10-01T00:00:00Z', entityId: 'DEMO-E001',
  change: {
    eventId: 'DEMO-CHANGE-030', entityId: 'DEMO-E001', field: 'legal_name',
    oldValue: 'Demo Entity Alpha LLC', newValue: 'Demo Entity Beta LLC', completionStatus: 'completed',
    effectiveAt: '2026-09-22T00:00:00Z', completionEvidenceReference: 'fixture://change/DEMO-E001/030',
    completionEvidenceQuality: 'verified',
  },
  legalRecord: {
    entityId: 'DEMO-E001', field: 'legal_name', value: 'Demo Entity Beta LLC',
    evidenceReference: 'fixture://legal/DEMO-E001/v2', observedAt: '2026-09-25T00:00:00Z', version: 'v2', evidenceQuality: 'verified',
  },
  managedServices: {
    entityId: 'DEMO-E001', field: 'legal_name', value: 'Demo Entity Alpha LLC',
    evidenceReference: 'fixture://managed-services/DEMO-E001/v1', observedAt: '2026-09-25T00:00:00Z', version: 'v1', evidenceQuality: 'verified',
  },
  service: { entityId: 'DEMO-E001', active: true },
  workflow: { id: 'DEMO-WORKFLOW-030', entityId: 'DEMO-E001', consumesFields: ['legal_name'], preparationAt: '2026-10-08T00:00:00Z', evidenceReference: 'fixture://workflow/DEMO-E001/030' },
  updateTask: { id: null, status: 'none', owner: null, targetEntityId: null, targetChangeId: null, targetField: null, plannedCompletionAt: null },
  priorFindingId: null,
};
const scenarios = [];
function add(id, label, status, mutate = () => {}, series = id, disposition = status === 'NO_CURRENT_FINDING' ? 'NO_NEW_NOTIFICATION' : 'CREATE') {
  const input = structuredClone(baseline);
  input.fixtureId = id;
  mutate(input);
  scenarios.push({ id, label, description: label, series, expectedStatus: status, expectedDisposition: disposition, input });
}
const pending = input => {
  input.updateTask = { id: 'DEMO-TASK-030', status: 'pending', owner: 'Managed Services owner (illustrative)', targetEntityId: input.entityId, targetChangeId: input.change.eventId, targetField: input.change.field, plannedCompletionAt: '2026-10-03T00:00:00Z' };
};
const corrected = input => {
  input.asOf = '2026-10-06T00:00:00Z';
  Object.assign(input.managedServices, { value: input.change.newValue, observedAt: '2026-10-05T00:00:00Z', version: 'v2', evidenceReference: 'fixture://managed-services/DEMO-E001/v2' });
};
add('confirmed-mismatch', 'Confirmed name mismatch', 'READY_FOR_REVIEW');
add('already-current', 'Managed Services already current', 'NO_CURRENT_FINDING', input => { input.managedServices.value = input.change.newValue; });
add('field-not-consumed', 'Workflow does not consume field', 'NO_CURRENT_FINDING', input => { input.workflow.consumesFields = []; });
add('service-ended', 'Relevant service ended', 'NO_CURRENT_FINDING', input => { input.service.active = false; });
add('change-cancelled', 'Legal change cancelled', 'NO_CURRENT_FINDING', input => { input.change.completionStatus = 'cancelled'; });
add('never-effective', 'Change never effective', 'NO_CURRENT_FINDING', input => { input.change.completionStatus = 'never_effective'; input.change.effectiveAt = null; });
add('future-effective', 'Effective time is in the future', 'NO_CURRENT_FINDING', input => { input.change.effectiveAt = '2026-10-02T00:00:00Z'; });
add('missing-new-value', 'Required new value unknown', 'NEEDS_EVIDENCE', input => { input.change.newValue = null; });
add('missing-completion-evidence', 'Completion evidence missing', 'NEEDS_EVIDENCE', input => { input.change.completionEvidenceReference = null; });
add('identity-mismatch', 'Source entity identifiers disagree', 'NEEDS_EVIDENCE', input => { input.managedServices.entityId = 'DEMO-E999'; });
add('stale-evidence', 'Evidence explicitly stale', 'NEEDS_EVIDENCE', input => { input.legalRecord.evidenceQuality = 'stale'; });
add('conflicting-evidence', 'Evidence explicitly conflicting', 'NEEDS_EVIDENCE', input => { input.managedServices.evidenceQuality = 'conflicting'; });
add('unverified-evidence', 'Evidence not verified', 'NEEDS_EVIDENCE', input => { input.change.completionEvidenceQuality = 'unverified'; });
add('unknown-service', 'Unknown is not inactive', 'NEEDS_EVIDENCE', input => { input.service.active = null; });
add('pending-owned-task', 'Matching owned task on track', 'MONITOR_EXISTING_WORK', pending, 'task-lifecycle');
add('overdue-task', 'Task overdue and mismatch remains', 'READY_FOR_REVIEW', input => { pending(input); input.asOf = '2026-10-04T00:00:00Z'; }, 'task-lifecycle', 'UPDATE');
add('task-correction-verified', 'Task followed by verified correction', 'NO_CURRENT_FINDING', input => { pending(input); input.updateTask.status = 'completed'; corrected(input); }, 'task-lifecycle', 'UPDATE');
add('replay-original', 'Original logical finding', 'READY_FOR_REVIEW', () => {}, 'replay');
add('replay-identical', 'Identical facts replayed', 'READY_FOR_REVIEW', () => {}, 'replay', 'NO_NEW_NOTIFICATION');
add('replay-corrected', 'New snapshot resolves earlier finding', 'NO_CURRENT_FINDING', corrected, 'replay', 'UPDATE');
add('replay-resolved-again', 'Verified correction replayed', 'NO_CURRENT_FINDING', corrected, 'replay', 'NO_NEW_NOTIFICATION');
add('similar-name-other-entity', 'Similarly named different entity is current', 'NO_CURRENT_FINDING', input => {
  input.entityId = 'DEMO-E002';
  for (const part of ['change', 'legalRecord', 'managedServices', 'service', 'workflow']) input[part].entityId = input.entityId;
  input.change.eventId = 'DEMO-CHANGE-031'; input.workflow.id = 'DEMO-WORKFLOW-031';
  input.managedServices.value = input.change.newValue;
  input.change.completionEvidenceReference = 'fixture://change/DEMO-E002/031';
  input.legalRecord.evidenceReference = 'fixture://legal/DEMO-E002/v2';
  input.managedServices.evidenceReference = 'fixture://managed-services/DEMO-E002/v1';
  input.workflow.evidenceReference = 'fixture://workflow/DEMO-E002/031';
}, 'replay');
add('task-unrelated', 'Unrelated task cannot suppress finding', 'READY_FOR_REVIEW', input => { pending(input); input.updateTask.targetChangeId = 'DEMO-OTHER-CHANGE'; });
add('task-unowned', 'Matching task has no known owner', 'NEEDS_EVIDENCE', input => { pending(input); input.updateTask.owner = null; });
add('task-completed-still-stale', 'Task completed but record still stale', 'READY_FOR_REVIEW', input => { pending(input); input.updateTask.status = 'completed'; });
add('task-after-preparation', 'Task planned after workflow preparation', 'READY_FOR_REVIEW', input => { pending(input); input.updateTask.plannedCompletionAt = '2026-10-09T00:00:00Z'; });
add('future-observation', 'Snapshot observed after evaluation', 'NEEDS_EVIDENCE', input => { input.managedServices.observedAt = '2026-10-02T00:00:00Z'; });
add('batch-second-entity', 'Second entity has its own supported mismatch', 'READY_FOR_REVIEW', input => {
  input.entityId = 'DEMO-E003';
  for (const part of ['change', 'legalRecord', 'managedServices', 'service', 'workflow']) input[part].entityId = input.entityId;
  input.change.eventId = 'DEMO-CHANGE-032'; input.workflow.id = 'DEMO-WORKFLOW-032';
  input.change.completionEvidenceReference = 'fixture://change/DEMO-E003/032';
  input.legalRecord.evidenceReference = 'fixture://legal/DEMO-E003/v2';
  input.managedServices.evidenceReference = 'fixture://managed-services/DEMO-E003/v1';
  input.workflow.evidenceReference = 'fixture://workflow/DEMO-E003/032';
}, 'replay');
const briefScenarios = JSON.parse(await readFile(new URL('../server/fixtures/brief-scenarios.json', import.meta.url), 'utf8'));
for (const scenario of scenarios) {
  const brief = briefScenarios[scenario.id];
  Object.assign(scenario, { briefCase: null, showInSelector: Boolean(brief), setupFixtureIds: [], setupNote: '' }, brief);
}
await writeFile(new URL('../server/fixtures/scenarios.json', import.meta.url), JSON.stringify(scenarios, null, 2) + '\n');
console.log(`Wrote ${scenarios.length} synthetic fixtures.`);
