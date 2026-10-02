// Readable aliases only. The evaluator continues to use the original references.
const entityLabels: Record<string, string> = {
  'DEMO-E001': 'Primary legal entity',
  'DEMO-E002': 'Similarly named legal entity',
  'DEMO-E003': 'Additional legal entity',
  'DEMO-E999': 'Different legal entity',
};

const workflowLabels: Record<string, string> = {
  'DEMO-WORKFLOW-030': 'Upcoming workflow preparation',
  'DEMO-WORKFLOW-031': 'Workflow for the similarly named entity',
  'DEMO-WORKFLOW-032': 'Workflow for the additional entity',
};

export const displayEntity = (reference: string | null) => reference ? entityLabels[reference] ?? reference : 'Legal entity not available';
export const displayWorkflow = (reference: string | null) => reference ? workflowLabels[reference] ?? reference : 'Workflow not available';
export const displayInformation = (value: string | null) => value === null ? 'Not available'
  : value.split(', ').map(item => item === 'legal_name' ? 'Legal entity name' : item).join(', ') || 'None';

export function displayEvidenceSource(source: string): string {
  return ({ 'Legal completion': 'Legal change confirmation', 'Workflow dependency': 'Workflow preparation', 'Managed Services': 'Managed Services record' } as Record<string, string>)[source] ?? source;
}

export function displayEvidenceQuality(quality: string): string {
  return ({ verified: 'Verified', unverified: 'Not yet verified', conflicting: 'Conflicting information', stale: 'Outdated', uncertain: 'Uncertain' } as Record<string, string>)[quality] ?? quality;
}

export function displayDisposition(disposition: string): string {
  return ({ CREATE: 'New finding', UPDATE: 'Existing finding updated', NO_NEW_NOTIFICATION: 'No new notification' } as Record<string, string>)[disposition] ?? disposition;
}
