import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { evaluate } from '../engine';
import type { EvaluationInput, Result } from '../types/experiment';
import fixtures from '../../server/fixtures/scenarios.json';
import { presentFinding } from './findingPresentation';
import FindingPanel from '../components/FindingPanel';
import EvaluationPanel from '../components/EvaluationPanel';

const base = fixtures[0].input as EvaluationInput;
const inputFor = (id: string) => structuredClone(fixtures.find(fixture => fixture.id === id)!.input) as EvaluationInput;

test('matching current values with unverified Managed Services evidence do not imply a remaining mismatch', () => {
  const input = inputFor('already-current');
  input.managedServices.evidenceQuality = 'unverified';
  const result = evaluate(input);
  const view = presentFinding(result);
  assert.equal(result.status, 'NEEDS_EVIDENCE');
  assert.equal(view.comparison.label, 'Current values match');
  assert.match(view.explanation, /mismatch as resolved/);
  assert.match(view.explanation, /reconciliation cannot be considered complete/);
  assert.match(view.comparison.detail, /not yet verified/);
  assert(view.evidence.find(item => item.source === 'Managed Services')?.needsReview);
});
test('same-version corrected values expose the version failure in the outcome path', () => {
  const first = evaluate(base);
  const input = structuredClone(base);
  input.managedServices.value = input.change.newValue;
  const result = evaluate(input, first);
  const view = presentFinding(result);
  assert.equal(result.status, 'NEEDS_EVIDENCE');
  assert.equal(view.outcomePath.find(check => check.name === 'Managed Services Matches Legal Record')?.passed, true);
  assert.equal(view.outcomePath.find(check => check.name === 'Supporting Evidence Confirmed')?.passed, false);
  assert.match(view.nextStep, /newer, verified record with its update reference/);
});
test('matching names never claim resolution when entity IDs disagree', () => {
  const input = inputFor('already-current');
  input.managedServices.entityId = 'OTHER';
  const view = presentFinding(evaluate(input));
  assert.match(view.comparison.label, /identity unconfirmed/);
  assert.doesNotMatch(view.explanation, /mismatch as resolved/);
  assert.match(view.explanation, /legal entity references must be confirmed/);
});
test('missing values are incomplete, not marked as a mismatch', () => {
  const input = structuredClone(base);
  input.managedServices.value = null;
  const view = presentFinding(evaluate(input));
  assert.equal(view.comparison.label, 'Comparison incomplete');
});
test('overdue and completed task explanations do not claim no correction exists', () => {
  const overdue = presentFinding(evaluate(inputFor('overdue-task')));
  assert.match(overdue.explanation, /passed its planned completion time/);
  assert.doesNotMatch(overdue.explanation, /No active correction exists/);
  const completed = presentFinding(evaluate(inputFor('task-completed-still-stale')));
  assert.match(completed.explanation, /task is marked complete/);
});
test('monitoring explains ongoing mismatch, ownership and duplicate follow-up', () => {
  const view = presentFinding(evaluate(inputFor('pending-owned-task')));
  assert.match(view.explanation, /records still differ/);
  assert.match(view.explanation, /avoid duplicate follow-up/);
  assert.match(view.nextStep, /not proof of resolution/);
});
test('no-finding explanations name the actual prerequisite and retain absence of evidence gaps', () => {
  for (const [id, detail] of [['already-current', 'current legal value'], ['service-ended', 'service is inactive'], ['field-not-consumed', 'does not use'], ['change-cancelled', 'cancelled']]) {
    const view = presentFinding(evaluate(inputFor(id)));
    assert(view.explanation.includes(detail));
    assert.equal(view.gaps.length, 0);
  }
});
test('all fixture presentations preserve engine outputs and check values', () => {
  const histories = new Map<string, Result>();
  for (const fixture of fixtures) {
    const result = evaluate(fixture.input, histories.get(fixture.series));
    if (result.findingId) histories.set(fixture.series, result);
    const before = structuredClone(result);
    const view = presentFinding(result);
    assert.deepEqual(result, before);
    assert.equal(result.status, fixture.expectedStatus);
    assert.equal(view.outcomePath.length, result.checks.length + 1);
    assert.deepEqual(view.outcomePath.filter(check => check.name !== 'Supporting Evidence Confirmed').map(check => check.passed).sort(), result.checks.map(check => check.passed).sort());
    assert.doesNotMatch(view.explanation, /supplied facts do not reliably establish|snapshot/i);
  }
});
test('rendered panels retain outcome checks and human actions without the repeated workflow', () => {
  const result = evaluate(base);
  const finding = renderToStaticMarkup(createElement(FindingPanel, { result, onDownload: () => {} }));
  for (const title of ['Why This Finding Exists', 'What Was Compared', 'What Evidence Supports It', 'What Evidence Is Missing', 'Human Action Required', 'Expected Next Step', 'Confirmed']) assert(finding.includes(title));
  assert(finding.includes('outcome-status--ready_for_review'));
  assert(finding.includes('READY_FOR_REVIEW'));
  assert(finding.includes('customer_communication_authorized = false'));
  const evaluation = renderToStaticMarkup(createElement(EvaluationPanel, { result, hasPendingChanges: false }));
  for (const title of ['Review Summary', 'Outcome Path', 'Records Refer To The Same Entity', 'Legal Change Completed', 'Upcoming Workflow Uses This Information', 'Managed Services Matches Legal Record', 'Supporting Evidence Confirmed', 'Required Information Available', 'Upcoming Work Identified']) assert(evaluation.includes(title));
  assert(!evaluation.includes('How KO #30 reaches an outcome'));
  assert(!evaluation.includes('reasoning-flow'));
});
