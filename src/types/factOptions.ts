import type { CompletionStatus, TaskStatus, EvidenceQuality } from './experiment';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export interface FactOptions {
  completionStatusOptions: SelectOption<CompletionStatus | ''>[];
  correctionTaskOptions: SelectOption<TaskStatus | ''>[];
  evidenceQualityOptions: SelectOption<EvidenceQuality | ''>[];
  serviceActivityOptions: SelectOption<'true' | 'false' | 'unknown'>[];
  workflowDependencyOptions: SelectOption<'true' | 'false' | 'unknown'>[];
  changedFieldOptions: SelectOption<'legal_name' | ''>[];
}
