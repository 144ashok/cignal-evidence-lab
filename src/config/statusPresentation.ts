import type { Status } from '../engine';

export const statusPresentation: Record<Status, { label: string; summary: string }> = {
  READY_FOR_REVIEW: {
    label: 'Ready for review',
    summary: 'A downstream mismatch needs a human decision.',
  },
  NEEDS_EVIDENCE: {
    label: 'Needs evidence',
    summary: 'Verify the evidence before drawing a conclusion.',
  },
  MONITOR_EXISTING_WORK: {
    label: 'Monitor existing work',
    summary: 'Follow the correction already in progress.',
  },
  NO_CURRENT_FINDING: {
    label: 'No current finding',
    summary: 'No actionable mismatch under this ruleset.',
  },
};
