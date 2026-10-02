import type { Check, Evidence, Result } from '../types/experiment';
import { displayInformation } from './displayLabels';

const businessMessages: Record<string, string> = {
  'Fixture/test identifier is missing.': 'The scenario reference is missing.',
  'Entity, change-event, changed-field and workflow identifiers are required.': 'Confirm the legal entity, legal change, information being changed and upcoming workflow.',
  'Entity identifiers must be known and match across the event, both snapshots, service and workflow.': 'Confirm that the legal change, both records, service and upcoming workflow concern the same legal entity.',
  'Both snapshots must identify the changed field.': 'Both records must identify the information being changed.',
  'Workflow consumed fields are unknown.': 'The information used by the upcoming workflow has not been confirmed.',
  'A fictional workflow evidence reference is required.': 'Supporting evidence for the upcoming workflow is required.',
  'Active task target is uncertain.': 'Confirm which legal entity, change and information the existing correction covers.',
  'A matching active task must have an identifier and owner.': 'The existing correction needs a reference and an assigned owner.',
  'Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.': 'Required information is available and the supporting evidence is marked as verified.',
  'Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.': 'Check that the legal change, both records, service and upcoming workflow concern the same legal entity. Similar names alone do not confirm a match.',
  'Compare the legal snapshot value with the new legal value.': 'Check that the legal record reflects the completed legal change.',
  'The legal snapshot contradicts the completed new value.': 'The legal record does not reflect the completed legal change.',
  'The service value matches neither the old nor new value; verify the mismatch.': 'The Managed Services record contains neither the previous nor the current information. Confirm which information is correct.',
};

export function businessText(text: string): string {
  return (businessMessages[text] ?? text)
    .replace(/snapshots/gi, 'records')
    .replace(/snapshot/gi, 'record')
    .replace(/fixture-declared/gi, 'available')
    .replace(/fictional evidence reference/gi, 'supporting evidence reference')
    .replace(/changed value without a new evidence version/gi, 'information changed without updated supporting evidence')
    .replace(/evidence version/gi, 'evidence update reference')
    .replace(/entity IDs/gi, 'legal entity references')
    .replace(/identifiers/gi, 'references')
    .replace(/identifier/gi, 'reference')
    .replace(/Old and new legal values/gi, 'Previous and current legal information')
    .replace(/changed field/gi, 'information being changed')
    .replace(/Evaluation as-of/gi, 'Review date')
    .replace(/observation is later than the evaluation time/gi, 'was recorded after the review date')
    .replace(/observations/gi, 'recorded times')
    .replace(/observation/gi, 'recorded time')
    .replace(/local logical finding/gi, 'saved finding for this change')
    .replace(/logical finding/gi, 'finding for this change')
    .replace(/\bsupplied\b/gi, 'available')
    .replace(/\bevaluation\b/gi, 'review')
    .replace(/\bevaluated\b/gi, 'reviewed')
    .replace(/\s*\(illustrative\)/gi, '')
    .replace(/use status none for confirmed absence/gi, 'confirm whether a task exists');
}

export function displayTime(value: string | null): string {
  if (!value) return 'Not available';
  const time = new Date(value);
  if (!Number.isFinite(time.getTime())) return value;
  return `${new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  }).format(time)} UTC`;
}

export interface OutcomeCheck extends Check {
  decisionPoint: boolean;
}

const pathChecks = [
  ['Entity identities match', 'Records Refer To The Same Entity'],
  ['Legal change completed', 'Legal Change Completed'],
  ['Legal Change Effective', 'Legal Change Effective'],
  ['Legal Record Current', 'Legal Record Current'],
  ['Service Active', 'Service Active'],
  ['Workflow Uses Field', 'Upcoming Workflow Uses This Information'],
  ['Workflow preparation upcoming', 'Upcoming Work Identified'],
  ['Managed Services Value Current', 'Managed Services Matches Legal Record'],
  ['Evidence sufficient', 'Required Information Available'],
  ['Matching owned task on track', 'Matching Correction On Track'],
] as const;

const versionIssue = (message: string) => /evidence version|newer observation|older than the previously evaluated evidence/.test(message);
const checkValue = (result: Result, name: string) => result.checks.find(check => check.name === name)?.passed ?? null;

/** Formats supplied facts and returned checks without changing their outcomes. */
function presentCheckDetail(check: Check, result: Result): string {
  const { change, workflow, updateTask } = result.input;
  switch (check.name) {
    case 'Legal change completed': {
      const status = ({ completed: 'Completed', cancelled: 'Cancelled', never_effective: 'Never took effect' } as Record<string, string>)[change.completionStatus ?? ''] ?? 'Not confirmed';
      return `Change status: ${status}.`;
    }
    case 'Legal Change Effective':
      return `Change effective date: ${displayTime(change.effectiveAt)}. Review date: ${displayTime(result.input.asOf)}.`;
    case 'Service Active':
      return `Managed Service: ${check.passed === null ? 'Not confirmed' : check.passed ? 'Active' : 'Inactive'}.`;
    case 'Workflow Uses Field':
      return `Information used by the upcoming workflow: ${workflow.consumesFields === null ? 'Not confirmed' : displayInformation(workflow.consumesFields.join(', '))}.`;
    case 'Workflow preparation upcoming':
      return `Planned workflow preparation: ${displayTime(workflow.preparationAt)}. This is not a statutory deadline.`;
    case 'Matching owned task on track':
      return check.passed === true
        ? `The existing correction is assigned to ${businessText(updateTask.owner ?? 'the responsible owner')} and planned for ${displayTime(updateTask.plannedCompletionAt)}. Correction is not yet verified.`
        : businessText(check.detail);
    default:
      return businessText(check.detail);
  }
}

function decisionPoint(result: Result, name: string, passed: boolean | null): boolean {
  if (result.status === 'NEEDS_EVIDENCE') {
    return name === 'Evidence sufficient' || (name === 'Entity identities match' && passed !== true);
  }
  if (result.status === 'MONITOR_EXISTING_WORK') return name === 'Matching owned task on track';
  if (result.status === 'READY_FOR_REVIEW') {
    return name === 'Managed Services Value Current' || name === 'Matching owned task on track';
  }
  return name === 'Managed Services Value Current' ? passed === true
    : ['Legal change completed', 'Legal Change Effective', 'Service Active', 'Workflow Uses Field', 'Workflow preparation upcoming'].includes(name) && passed === false;
}

/** Explains returned results. It does not evaluate facts or select an outcome. */
export function presentFinding(result: Result) {
  const gaps = result.unresolvedInformation.map(businessText);
  const msGaps = result.unresolvedInformation.filter(message => message.startsWith('Managed Services'));
  const versionGaps = result.unresolvedInformation.filter(versionIssue);
  const identitiesMatch = checkValue(result, 'Entity identities match') === true;
  const serviceCurrent = checkValue(result, 'Managed Services Value Current') === true;
  const legalCurrent = checkValue(result, 'Legal Record Current') === true;
  const { legalRecord, managedServices, updateTask: task } = result.input;
  const valuesKnown = Boolean(legalRecord.value && managedServices.value);
  const valuesMatch = valuesKnown && legalRecord.value === managedServices.value;
  const currentValuesMatch = valuesMatch && serviceCurrent && legalCurrent;

  let explanation: string;
  let action: string;
  let nextStep: string;
  let decisiveReason: string;

  if (result.status === 'NEEDS_EVIDENCE') {
    if (!identitiesMatch) {
      explanation = `${valuesMatch ? 'The names match, but' : 'Before comparing the records,'} the legal entity references must be confirmed. The records cannot be treated as belonging to the same entity. Human review is required.`;
    } else if (currentValuesMatch && msGaps.length) {
      explanation = 'Managed Services currently matches the legal record, but the supporting evidence is insufficient. The records show the mismatch as resolved; reconciliation cannot be considered complete until a human verifies the evidence.';
    } else if (currentValuesMatch) {
      explanation = `Both records contain the current legal value. ${gaps[0] ?? 'Required information is unresolved.'} A person must verify the evidence before this review can be completed; no remaining mismatch is shown.`;
    } else if (valuesMatch) {
      explanation = `The records show the same information, but that does not establish the completed legal change. ${gaps[0] ?? 'Required evidence is unresolved.'} Verify the evidence before deciding whether a correction is needed.`;
    } else {
      explanation = `${valuesKnown ? 'The legal and Managed Services records differ.' : 'Information needed to compare the records is missing.'} ${gaps[0] ?? 'Required evidence is unresolved.'} Human review is needed before this can be treated as a supported operational mismatch.`;
    }
    decisiveReason = gaps.length ? `${gaps.length} missing or disputed ${gaps.length === 1 ? 'item prevents' : 'items prevent'} a supported conclusion. ${gaps[0]}` : 'Required evidence has not been confirmed.';
    action = !identitiesMatch ? 'Confirm that the legal change, records, service and upcoming workflow concern the same legal entity. Do not match entities by name alone.'
      : msGaps.length ? 'Ask the Managed Services owner to verify the current record and the evidence supporting its value.'
        : 'Ask the responsible owner to obtain or verify the information listed below.';
    nextStep = versionGaps.length
      ? 'Add the missing evidence update reference or obtain a newer, verified record with its update reference and recorded date, then review the information again.'
      : 'Resolve each missing or disputed item, then review the information again. Matching information alone does not verify reconciliation.';
  } else if (result.status === 'READY_FOR_REVIEW') {
    const workReason = result.reason === 'CORRECTION_TASK_OVERDUE'
      ? 'The existing correction has passed its planned completion time and the mismatch remains.'
      : result.reason === 'TASK_TARGET_AFTER_WORKFLOW'
        ? 'The existing correction is planned after workflow preparation.'
        : result.reason === 'COMPLETED_TASK_STILL_STALE'
          ? 'The task is marked complete, but the Managed Services record still holds the former value.'
          : task.status === 'none' ? 'No active correction exists for this change.' : 'No matching correction is verified as on track.';
    explanation = `The legal record and Managed Services record differ. This information is used by an upcoming workflow. ${workReason} Human review is required.`;
    decisiveReason = `A supported mismatch affects workflow preparation. ${workReason}`;
    action = result.links.taskId ? 'Ask the Managed Services owner to follow up the linked correction and review its completion plan.'
      : 'Ask the Managed Services owner to review the mismatch and arrange the appropriate correction.';
    nextStep = 'After the work is completed, obtain a newer verified Managed Services record and review the information again. Completing a task alone does not close the finding.';
  } else if (result.status === 'MONITOR_EXISTING_WORK') {
    explanation = 'A matching correction task already exists, has an owner and is on track. The records still differ. Monitor that work and avoid duplicate follow-up until it completes or its target date passes.';
    decisiveReason = `The existing correction is assigned to ${businessText(task.owner ?? 'the responsible owner')} and planned for ${displayTime(task.plannedCompletionAt)}.`;
    action = 'Monitor the existing task with its owner. Avoid creating duplicate correction work or outreach.';
    nextStep = 'Review the information again when a verified corrected record is available, or after the task target passes. The current task is not proof of resolution.';
  } else {
    const reason = {
      CORRECTION_VERIFIED: 'A newer verified Managed Services record contains the current legal value. The earlier finding is no longer current.',
      RECORDS_ALIGNED: 'The verified Managed Services record already contains the current legal value.',
      CHANGE_CANCELLED: 'The legal change was cancelled.',
      CHANGE_NOT_EFFECTIVE: 'The legal change is not completed and effective as of the review date.',
      SERVICE_INACTIVE: 'The relevant service is inactive.',
      FIELD_NOT_CONSUMED: 'The upcoming workflow does not use this information.',
      NO_UPCOMING_WORKFLOW: 'No upcoming work is established as of the review date.',
      NO_SUPPORTED_MISMATCH: 'The current records do not establish an unresolved value change for this scenario.',
    }[result.reason] ?? businessText(result.explanation);
    explanation = `No unresolved operational issue is supported by current evidence. ${reason}`;
    decisiveReason = reason;
    action = 'No correction is required by this review. Retain the supporting evidence.';
    nextStep = 'Review the information again if the legal record, service, workflow or evidence changes. This result makes no conclusion about obligations outside this scenario.';
  }

  const outcomePath: OutcomeCheck[] = pathChecks.map(([key, label]) => {
    const check = result.checks.find(item => item.name === key);
    return {
      name: label, passed: check?.passed ?? null,
      detail: key === 'Evidence sufficient' && gaps.length
        ? `${gaps.length} missing or disputed ${gaps.length === 1 ? 'item requires' : 'items require'} review. See “What Evidence Is Missing” in the finding.`
        : check ? presentCheckDetail(check, result) : 'This check is not available in the review.',
      decisionPoint: decisionPoint(result, key, check?.passed ?? null),
    };
  });
  // This row exposes existing version-related evidence failures; it adds no rule.
  outcomePath.splice(8, 0, {
    name: 'Supporting Evidence Confirmed', passed: versionGaps.length ? false : checkValue(result, 'Evidence sufficient') === true ? true : null,
    detail: versionGaps.length ? versionGaps.map(businessText).join(' ')
      : checkValue(result, 'Evidence sufficient') === true ? 'Supporting evidence is available, with no conflicting updates or dates reported.'
        : 'Supporting evidence remains incomplete or disputed and cannot yet be confirmed.',
    decisionPoint: result.status === 'NEEDS_EVIDENCE' && versionGaps.length > 0,
  });

  const comparison = !valuesKnown ? { label: 'Comparison incomplete', tone: 'unknown', detail: 'Required information is missing; a mismatch cannot be confirmed.' }
    : !identitiesMatch ? { label: valuesMatch ? 'Values match · identity unconfirmed' : 'Different values · identity unconfirmed', tone: 'unknown', detail: 'Confirm entity identity before treating these as records for the same entity.' }
      : currentValuesMatch ? { label: 'Current values match', tone: 'aligned', detail: result.status === 'NEEDS_EVIDENCE'
          ? 'The records show the mismatch as resolved, but reconciliation is not yet verified. Review the missing or disputed information below.'
          : 'Both records contain the current legal value.' }
        : valuesMatch ? { label: 'Values match · legal change unconfirmed', tone: 'unknown', detail: 'Matching values alone do not confirm the new legal value.' }
          : { label: 'Values differ', tone: 'different', detail: result.status === 'NEEDS_EVIDENCE'
              ? 'The records differ; evidence is still required to establish an operational issue.'
              : 'The legal and Managed Services records contain different information.' };

  function evidenceNeedsReview(item: Evidence): boolean {
    if (!identitiesMatch) return true;
    const sourcePattern = item.source === 'Legal completion' ? /legal completion/i
      : item.source === 'Workflow dependency' ? /workflow/i
        : item.source === 'Legal record' ? /legal (record|snapshot)|both snapshots/i : /managed services|service snapshot|both snapshots/i;
    return result.unresolvedInformation.some(message => sourcePattern.test(message)) || (item.quality !== null && item.quality !== 'verified');
  }

  return { explanation, action, nextStep, decisiveReason, gaps, outcomePath, comparison,
    evidence: result.evidence.map(item => ({ ...item, needsReview: evidenceNeedsReview(item) })) };
}
