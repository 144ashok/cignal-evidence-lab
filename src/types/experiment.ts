export type Status = 'READY_FOR_REVIEW' | 'NEEDS_EVIDENCE' | 'MONITOR_EXISTING_WORK' | 'NO_CURRENT_FINDING';
export type EvidenceQuality = 'verified' | 'stale' | 'conflicting' | 'unverified' | 'uncertain';
export type CompletionStatus = 'completed' | 'cancelled' | 'pending' | 'never_effective';
export type TaskStatus = 'none' | 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Snapshot {
  entityId: string | null;
  field: string | null;
  value: string | null;
  evidenceReference: string | null;
  observedAt: string | null;
  version: string | null;
  evidenceQuality: EvidenceQuality | null;
}

export interface ChangeEvent {
  eventId: string | null;
  entityId: string | null;
  field: string | null;
  oldValue: string | null;
  newValue: string | null;
  completionStatus: CompletionStatus | null;
  effectiveAt: string | null;
  completionEvidenceReference: string | null;
  completionEvidenceQuality: EvidenceQuality | null;
}

export interface Workflow {
  id: string | null;
  entityId: string | null;
  consumesFields: string[] | null;
  preparationAt: string | null;
  evidenceReference: string | null;
}

export interface UpdateTask {
  id: string | null;
  status: TaskStatus | null;
  owner: string | null;
  targetEntityId: string | null;
  targetChangeId: string | null;
  targetField: string | null;
  plannedCompletionAt: string | null;
}

export interface EvaluationInput {
  fixtureId: string | null;
  asOf: string | null;
  entityId: string | null;
  change: ChangeEvent;
  legalRecord: Snapshot;
  managedServices: Snapshot;
  service: { entityId: string | null; active: boolean | null };
  workflow: Workflow;
  updateTask: UpdateTask;
  priorFindingId: string | null;
}

export interface Check {
  name: string;
  passed: boolean | null;
  detail: string;
}

export interface Evidence {
  source: string;
  reference: string;
  entityId: string | null;
  version: string | null;
  observedAt: string | null;
  value: string | null;
  quality: EvidenceQuality | null;
}

export interface Result {
  fixtureId: string | null;
  findingId: string | null;
  logicalKey: string | null;
  entityId: string | null;
  changedField: string | null;
  status: Status;
  reason: string;
  explanation: string;
  input: EvaluationInput;
  checks: Check[];
  evidence: Evidence[];
  evidenceHistory: Evidence[];
  unresolvedInformation: string[];
  workflow: Workflow;
  owner: string;
  action: string;
  links: { taskId: string | null; priorFindingId: string | null };
  emissionDisposition: 'CREATE' | 'UPDATE' | 'NO_NEW_NOTIFICATION';
  isCurrent: boolean;
  revision: number;
  fingerprint: string;
  customer_communication_authorized: false;
  source_record_write_authorized: false;
}

export interface Scenario {
  id: string;
  label: string;
  description: string;
  series: string;
  expectedStatus: Status;
  expectedDisposition: Result['emissionDisposition'];
  input: EvaluationInput;
  briefCase: string | null;
  showInSelector: boolean;
  setupFixtureIds: string[];
  setupNote: string;
}
