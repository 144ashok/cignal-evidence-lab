import type { EvaluationInput, Result, Scenario } from '../types/experiment';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options);
  if (!response.ok) throw new Error('The requested information could not be loaded. Please try again.');
  return response.json() as Promise<T>;
}
export const fetchScenarios = (signal: AbortSignal) => request<Scenario[]>('/api/scenarios', { signal });
const scenarioPath = (path: string, scenarioId: string) => `${path}?scenario=${encodeURIComponent(scenarioId)}`;
export const fetchFindings = (scenarioId: string, signal?: AbortSignal) => request<Result[]>(scenarioPath('/api/findings', scenarioId), { signal });
export const evaluateInput = (input: EvaluationInput, scenarioId: string) => request<Result>(scenarioPath('/api/evaluate', scenarioId), {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input),
});
export const resetFindings = (scenarioId: string) => request<{ reset: boolean }>(scenarioPath('/api/reset', scenarioId), {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
});
