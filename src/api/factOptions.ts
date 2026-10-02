import type { FactOptions } from '../types/factOptions';

export async function fetchFactOptions(signal: AbortSignal): Promise<FactOptions> {
  const response = await fetch('/api/fact-options', { signal });
  if (!response.ok) throw new Error('Unable to load fact options. Please try again.');
  const data = await response.json() as FactOptions;
  for (const key of ['completionStatusOptions', 'correctionTaskOptions', 'evidenceQualityOptions', 'serviceActivityOptions', 'workflowDependencyOptions', 'changedFieldOptions'] as const) {
    if (!Array.isArray(data?.[key]) || !data[key].length || data[key].some(option =>
      !option || typeof option.value !== 'string' || typeof option.label !== 'string',
    )) {
      throw new Error('The server returned invalid fact options.');
    }
  }
  return data;
}
