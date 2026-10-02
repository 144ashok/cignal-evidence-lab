import { createHash } from 'node:crypto';
import { normalizeInput } from './domain/normalizeInput';
import type { Check, EvaluationInput, Evidence, Result, Status } from './types/experiment';
export type { Result, Status } from './types/experiment';

const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function validTime(value: string | null): boolean {
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) return false;
  const millis = Date.parse(value);
  return Number.isFinite(millis) && new Date(millis).toISOString().replace('.000Z', 'Z') === value;
}
export function logicalKeyFor(raw: unknown): string | null {
  const input = normalizeInput(raw);
  const parts = [input.entityId, input.change.eventId, input.change.field, input.workflow.id];
  return parts.every(Boolean) ? JSON.stringify(parts) : null;
}

function collectEvidence(input: EvaluationInput): Evidence[] {
  const sources: Evidence[] = [];
  const { change, workflow } = input;
  if (change.completionEvidenceReference) sources.push({
    source: 'Legal completion', reference: change.completionEvidenceReference, entityId: change.entityId,
    version: change.eventId, observedAt: change.effectiveAt, value: change.newValue, quality: change.completionEvidenceQuality,
  });
  for (const [source, snapshot] of [['Legal record', input.legalRecord], ['Managed Services', input.managedServices]] as const) {
    if (snapshot.evidenceReference) sources.push({
      source, reference: snapshot.evidenceReference, entityId: snapshot.entityId,
      version: snapshot.version, observedAt: snapshot.observedAt, value: snapshot.value, quality: snapshot.evidenceQuality,
    });
  }
  if (workflow.evidenceReference) sources.push({
    source: 'Workflow dependency', reference: workflow.evidenceReference, entityId: workflow.entityId,
    version: workflow.id, observedAt: null, value: workflow.consumesFields?.join(', ') ?? null, quality: null,
  });
  return sources;
}

export function evaluate(raw: unknown, previous?: Result): Result {
  const input = normalizeInput(raw);
  const { change, legalRecord, managedServices, service, workflow, updateTask: task } = input;
  const logicalKey = logicalKeyFor(input);
  // Prior findings can only be joined by their full logical key, never a name.
  const prior = previous?.logicalKey === logicalKey && logicalKey ? previous : undefined;
  const unresolved: string[] = [];
  const require = (condition: boolean, message: string) => { if (!condition) unresolved.push(message); };
  const requireTime = (value: string | null, label: string) => require(validTime(value), `${label} must be a known UTC time (YYYY-MM-DDTHH:mm:ssZ).`);
  require(Boolean(input.fixtureId), 'Fixture/test identifier is missing.');
  require(Boolean(logicalKey), 'Entity, change-event, changed-field and workflow identifiers are required.');
  requireTime(input.asOf, 'Evaluation as-of');
  require(change.completionStatus !== null, 'Legal completion status is unknown.');
  require(Boolean(change.oldValue && change.newValue), 'Old and new legal values are required.');
  require(service.active !== null, 'Relevant service activity is unknown.');
  require(workflow.consumesFields !== null, 'Workflow consumed fields are unknown.');
  requireTime(workflow.preparationAt, 'Workflow preparation');
  require(Boolean(workflow.evidenceReference?.startsWith('fixture://')), 'A fictional workflow evidence reference is required.');
  require(task.status !== null, 'Correction-task status is unknown; use status none for confirmed absence.');

  const identityKnown = [change.entityId, legalRecord.entityId, managedServices.entityId, service.entityId, workflow.entityId].every(Boolean);
  const identitiesMatch = identityKnown && [change.entityId, legalRecord.entityId, managedServices.entityId, service.entityId, workflow.entityId].every(id => id === input.entityId);
  require(identitiesMatch, 'Entity identifiers must be known and match across the event, both snapshots, service and workflow.');
  require(Boolean(change.field) && legalRecord.field === change.field && managedServices.field === change.field, 'Both snapshots must identify the changed field.');

  if (change.completionStatus === 'completed') {
    requireTime(change.effectiveAt, 'Legal change effective time');
    require(Boolean(change.completionEvidenceReference?.startsWith('fixture://')), 'Legal completion evidence is missing.');
    require(change.completionEvidenceQuality === 'verified', 'Legal completion evidence is not verified.');
  }
  for (const [name, snapshot] of [['Legal record', legalRecord], ['Managed Services', managedServices]] as const) {
    require(Boolean(snapshot.value), `${name} value is missing.`);
    require(Boolean(snapshot.version), `${name} evidence version is missing.`);
    require(Boolean(snapshot.evidenceReference?.startsWith('fixture://')), `${name} requires a fictional evidence reference.`);
    require(snapshot.evidenceQuality === 'verified', `${name} evidence is missing, stale, conflicting or unverified.`);
    requireTime(snapshot.observedAt, `${name} observation`);
    if (validTime(snapshot.observedAt) && validTime(input.asOf)) {
      require(snapshot.observedAt! <= input.asOf!, `${name} observation is later than the evaluation time.`);
    }
    if (prior) {
      const history = prior.evidenceHistory.filter(item => item.source === name && item.entityId === snapshot.entityId);
      require(!history.some(item => snapshot.version === item.version && snapshot.value !== item.value), `${name} changed value without a new evidence version.`);
      if (validTime(snapshot.observedAt)) {
        const timedHistory = history.filter(item => validTime(item.observedAt));
        require(timedHistory.every(item => snapshot.observedAt! >= item.observedAt!), `${name} snapshot is older than the previously evaluated evidence.`);
        require(timedHistory.every(item => snapshot.value === item.value || snapshot.observedAt! > item.observedAt!), `${name} changed value requires a newer observation.`);
      }
    }
  }
  if (input.priorFindingId) require(prior?.findingId === input.priorFindingId, 'The supplied prior finding does not match the local logical finding.');

  const completed = change.completionStatus === 'completed';
  const effective = completed && validTime(change.effectiveAt) && validTime(input.asOf) && change.effectiveAt! <= input.asOf!;
  const legalCurrent = Boolean(change.newValue && legalRecord.value === change.newValue);
  const serviceCurrent = Boolean(change.newValue && managedServices.value === change.newValue);
  const stale = Boolean(change.oldValue && managedServices.value === change.oldValue && change.oldValue !== change.newValue);
  const consumes = change.field !== null && workflow.consumesFields?.includes(change.field) === true;
  const upcoming = validTime(workflow.preparationAt) && validTime(input.asOf) && workflow.preparationAt! >= input.asOf!;
  const activeTask = task.status === 'pending' || task.status === 'in_progress';
  const taskTargetKnown = Boolean(task.targetEntityId && task.targetChangeId && task.targetField);
  const matchingTask = taskTargetKnown && task.targetEntityId === input.entityId && task.targetChangeId === change.eventId && task.targetField === change.field;
  if (activeTask) {
    require(taskTargetKnown, 'Active task target is uncertain.');
    if (matchingTask) {
      require(Boolean(task.id && task.owner), 'A matching active task must have an identifier and owner.');
      requireTime(task.plannedCompletionAt, 'Task planned completion');
    }
  }
  const onTrack = activeTask && matchingTask && Boolean(task.id && task.owner)
    && validTime(task.plannedCompletionAt) && validTime(input.asOf) && validTime(workflow.preparationAt)
    && task.plannedCompletionAt! >= input.asOf! && task.plannedCompletionAt! <= workflow.preparationAt!;

  const inScope = completed && effective && service.active === true && consumes && upcoming && change.oldValue !== change.newValue;
  if (inScope && !legalCurrent) require(false, 'The legal snapshot contradicts the completed new value.');
  if (inScope && !serviceCurrent && !stale) require(false, 'The service value matches neither the old nor new value; verify the mismatch.');
  if (inScope && validTime(change.effectiveAt)) {
    require(!validTime(legalRecord.observedAt) || legalRecord.observedAt! >= change.effectiveAt!, 'The legal snapshot predates the effective change.');
    require(!validTime(managedServices.observedAt) || managedServices.observedAt! >= change.effectiveAt!, 'The service snapshot predates the effective change.');
  }

  let status: Status;
  let reason: string;
  let explanation: string;
  let action: string;
  if (unresolved.length) {
    status = 'NEEDS_EVIDENCE'; reason = !identitiesMatch ? 'IDENTITY_UNCERTAIN' : 'REQUIRED_EVIDENCE_UNCERTAIN';
    explanation = 'The supplied facts do not reliably establish this operational issue. The unresolved information lists the checks that need attention.';
    action = 'Verify the listed facts and fictional source snapshots, then evaluate again. Do not infer identity from a similar name.';
  } else if (!inScope || serviceCurrent) {
    status = 'NO_CURRENT_FINDING';
    reason = serviceCurrent ? prior?.isCurrent ? 'CORRECTION_VERIFIED' : 'RECORDS_ALIGNED'
      : change.completionStatus === 'cancelled' ? 'CHANGE_CANCELLED'
      : !effective ? 'CHANGE_NOT_EFFECTIVE' : !service.active ? 'SERVICE_INACTIVE'
      : !consumes ? 'FIELD_NOT_CONSUMED' : !upcoming ? 'NO_UPCOMING_WORKFLOW' : 'NO_SUPPORTED_MISMATCH';
    explanation = serviceCurrent
      ? 'The verified Managed Services snapshot holds the current legal value. Any earlier finding for this logical key is no longer current.'
      : 'A known prerequisite is not met at the supplied evaluation time. No unresolved issue is established for this operational scenario; no conclusion is made about other legal obligations.';
    action = 'No correction is recommended by this experiment. Retain the evidence and re-evaluate if the facts change.';
  } else if (onTrack) {
    status = 'MONITOR_EXISTING_WORK'; reason = 'MATCHING_OWNED_TASK_ON_TRACK';
    explanation = 'A supported mismatch remains, but a matching, owned correction task is pending within its target and before workflow preparation. The task is not evidence of completed correction.';
    action = 'Monitor the linked task and verify a new service snapshot after completion. Do not create duplicate outreach.';
  } else {
    status = 'READY_FOR_REVIEW';
    reason = activeTask && matchingTask ? task.plannedCompletionAt! < input.asOf! ? 'CORRECTION_TASK_OVERDUE' : 'TASK_TARGET_AFTER_WORKFLOW'
      : task.status === 'completed' && matchingTask ? 'COMPLETED_TASK_STILL_STALE' : 'STALE_MANAGED_SERVICES_VALUE';
    explanation = reason === 'CORRECTION_TASK_OVERDUE'
      ? 'The matching task has passed its illustrative completion target and the verified mismatch remains. Human follow-up is required; no legal urgency is inferred.'
      : reason === 'TASK_TARGET_AFTER_WORKFLOW'
        ? 'The matching task is planned after workflow preparation while the service value remains stale. A human should review the schedule.'
        : 'A completed, effective legal change is verified, the related service retains the old value, and an upcoming workflow consumes the field. No matching task is verified as on track.';
    action = 'Ask the illustrative Managed Services owner to review the evidence and arrange or follow up the correction before workflow preparation. Verify the resulting snapshot.';
  }

  const checks: Check[] = [
    { name: 'Evidence sufficient', passed: unresolved.length === 0, detail: unresolved.length ? unresolved.join(' ') : 'Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.' },
    { name: 'Entity identities match', passed: identityKnown ? identitiesMatch : null, detail: 'Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.' },
    { name: 'Legal change completed', passed: change.completionStatus === null ? null : completed, detail: `Supplied completion status: ${change.completionStatus ?? 'unknown'}.` },
    { name: 'Legal Change Effective', passed: change.completionStatus === null || (completed && !validTime(change.effectiveAt)) || !validTime(input.asOf) ? null : effective, detail: `Effective: ${change.effectiveAt ?? 'unknown'}; evaluation: ${input.asOf ?? 'unknown'}.` },
    { name: 'Legal Record Current', passed: legalRecord.value && change.newValue ? legalCurrent : null, detail: 'Compare the legal snapshot value with the new legal value.' },
    { name: 'Service Active', passed: service.active, detail: `Relevant service active: ${service.active ?? 'unknown'}.` },
    { name: 'Workflow Uses Field', passed: workflow.consumesFields && change.field ? consumes : null, detail: `Consumed fields: ${workflow.consumesFields?.join(', ') || (workflow.consumesFields ? '(none)' : 'unknown')}.` },
    { name: 'Workflow preparation upcoming', passed: validTime(workflow.preparationAt) && validTime(input.asOf) ? upcoming : null, detail: `Preparation: ${workflow.preparationAt ?? 'unknown'}; this is not a statutory deadline.` },
    { name: 'Managed Services Value Current', passed: managedServices.value && change.newValue ? serviceCurrent : null, detail: serviceCurrent ? 'Service snapshot matches the new legal value.' : stale ? 'Service snapshot still holds the old value.' : 'A current or supported old value has not been established.' },
    { name: 'Matching owned task on track', passed: task.status === null ? null : onTrack, detail: onTrack ? `Task ${task.id}, owned by ${task.owner}, is due ${task.plannedCompletionAt}. Correction is not yet verified.` : 'No matching owned task is verified as on track before preparation.' },
  ];

  const { fixtureId: _fixtureId, priorFindingId: _priorFindingId, ...materialInput } = input;
  const fingerprint = hash(materialInput);
  const unchanged = prior?.fingerprint === fingerprint && prior.status === status
    && JSON.stringify(prior.unresolvedInformation) === JSON.stringify(unresolved);
  // A replay changes emission disposition, not the explanation of the same facts.
  if (unchanged) {
    status = prior.status;
    reason = prior.reason;
    explanation = prior.explanation;
    action = prior.action;
  }
  const findingId = prior?.findingId ?? (logicalKey && status !== 'NO_CURRENT_FINDING' ? `F-030-${hash(logicalKey).slice(0, 20)}` : null);
  const evidence = collectEvidence(input);
  const evidenceHistory = [...new Map([...(prior?.evidenceHistory ?? []), ...evidence].map(item => [JSON.stringify(item), item])).values()];
  return {
    fixtureId: input.fixtureId, findingId, logicalKey, entityId: input.entityId, changedField: change.field,
    status, reason, explanation, input, checks, evidence, evidenceHistory, unresolvedInformation: unresolved,
    workflow: structuredClone(workflow), owner: 'Managed Services owner (illustrative)', action,
    links: { taskId: matchingTask ? task.id : null, priorFindingId: prior?.findingId ?? null },
    emissionDisposition: unchanged || !findingId ? 'NO_NEW_NOTIFICATION' : prior ? 'UPDATE' : 'CREATE',
    isCurrent: status !== 'NO_CURRENT_FINDING', revision: findingId ? (prior?.revision ?? 0) + (unchanged ? 0 : 1) : 0,
    fingerprint, customer_communication_authorized: false, source_record_write_authorized: false,
  };
}
