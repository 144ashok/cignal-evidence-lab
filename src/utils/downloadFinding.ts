import type { Result } from '../engine';

export function downloadFinding(result: Result): void {
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${result.findingId ?? result.fixtureId ?? 'evaluation'}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
