import type { EvaluationInput, Snapshot } from '../types/experiment';

type ObjectValue = Record<string, unknown>;
const object = (value: unknown): ObjectValue => value && typeof value === 'object' && !Array.isArray(value) ? value as ObjectValue : {};
const text = (value: unknown): string | null => typeof value === 'string' && value.trim() ? value.trim() : null;
function choice<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return allowed.includes(value as T) ? value as T : null;
}
const quality = (value: unknown) => choice(value, ['verified', 'stale', 'conflicting', 'unverified', 'uncertain'] as const);

function snapshot(value: unknown): Snapshot {
  const source = object(value);
  return {
    entityId: text(source.entityId), field: text(source.field), value: text(source.value),
    evidenceReference: text(source.evidenceReference), observedAt: text(source.observedAt),
    version: text(source.version), evidenceQuality: quality(source.evidenceQuality),
  };
}

// Omitted, malformed and explicit null facts remain unknown, never false.
export function normalizeInput(raw: unknown): EvaluationInput {
  const input = object(raw);
  const change = object(input.change);
  const service = object(input.service);
  const workflow = object(input.workflow);
  const task = object(input.updateTask);
  return {
    fixtureId: text(input.fixtureId), asOf: text(input.asOf), entityId: text(input.entityId),
    change: {
      eventId: text(change.eventId), entityId: text(change.entityId), field: text(change.field),
      oldValue: text(change.oldValue), newValue: text(change.newValue),
      completionStatus: choice(change.completionStatus, ['completed', 'cancelled', 'pending', 'never_effective'] as const),
      effectiveAt: text(change.effectiveAt), completionEvidenceReference: text(change.completionEvidenceReference),
      completionEvidenceQuality: quality(change.completionEvidenceQuality),
    },
    legalRecord: snapshot(input.legalRecord), managedServices: snapshot(input.managedServices),
    service: { entityId: text(service.entityId), active: typeof service.active === 'boolean' ? service.active : null },
    workflow: {
      id: text(workflow.id), entityId: text(workflow.entityId),
      consumesFields: Array.isArray(workflow.consumesFields) && workflow.consumesFields.every(field => text(field) !== null)
        ? [...new Set(workflow.consumesFields.map(field => String(field).trim()))].sort() : null,
      preparationAt: text(workflow.preparationAt), evidenceReference: text(workflow.evidenceReference),
    },
    updateTask: {
      id: text(task.id), status: choice(task.status, ['none', 'pending', 'in_progress', 'completed', 'cancelled'] as const),
      owner: text(task.owner), targetEntityId: text(task.targetEntityId), targetChangeId: text(task.targetChangeId),
      targetField: text(task.targetField), plannedCompletionAt: text(task.plannedCompletionAt),
    },
    priorFindingId: text(input.priorFindingId),
  };
}
