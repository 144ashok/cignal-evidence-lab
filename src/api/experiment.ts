import type { EvaluationInput, Result, Scenario } from '../types/experiment';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options);
  if (!response.ok) throw new Error(`Local server request failed (${response.status}).`);
  return response.json() as Promise<T>;
}
export const fetchScenarios = (signal: AbortSignal) => request<Scenario[]>('/api/scenarios', { signal });
export const fetchFindings = () => request<Result[]>('/api/findings');
export const evaluateInput = (input: EvaluationInput) => request<Result>('/api/evaluate', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input),
});
export const resetFindings = () => request<{ reset: boolean }>('/api/reset', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
});
