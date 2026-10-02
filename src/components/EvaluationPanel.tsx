import type { Result } from '../engine';
import { statusPresentation } from '../config/statusPresentation';

interface EvaluationPanelProps {
  result: Result;
  evaluationCount: number;
  hasPendingChanges: boolean;
}

export default function EvaluationPanel({
  result, evaluationCount, hasPendingChanges,
}: EvaluationPanelProps) {
  const presentation = statusPresentation[result.status];

  return (
    <section className="panel evaluation-panel">
      <div className="panel-heading">
        <span className="step">02</span>
        <h2>CIGNAL evaluation</h2>
        <span className="panel-caption">RULE TRACE</span>
      </div>
      <div className="panel-body">
        <div className="trace-intro">
          <p className="panel-description">Checks performed · each rule explained.</p>
          <span>{result.checks.length} checks</span>
        </div>
        <div className="checks">
          {result.checks.map((check, index) => (
            <div className={`check ${check.passed === null ? 'unknown' : check.passed ? 'pass' : 'fail'}`} key={check.name}>
              <span className="check-icon" aria-label={check.passed === null ? 'Unknown' : check.passed ? 'Passed' : 'Failed'}>{check.passed === null ? '?' : check.passed ? '✓' : '×'}</span>
              <div>
                <strong>{check.name}</strong>
                <p>{check.detail}</p>
              </div>
              <span className="check-number">{String(index + 1).padStart(2, '0')}</span>
            </div>
          ))}
        </div>
        <div className={`result-box ${result.status.toLowerCase()}`} aria-live="polite">
          <div className="section-label">EVALUATION RESULT</div>
          <strong><span className="status-dot" />{presentation.label}</strong>
          <code>{result.status}</code>
          <p>{presentation.summary}</p>
        </div>
        <div className={`snapshot-note ${hasPendingChanges ? 'dirty' : ''}`} role="status">
          {hasPendingChanges
            ? '● Facts changed. Run evaluation to refresh this result.'
            : `✓ Evaluation ${String(evaluationCount).padStart(2, '0')} complete · based on the facts shown`}
        </div>
        <details className="assumptions">
          <summary>Rules & prototype assumptions</summary>
          <p>
            Required evidence and entity IDs are checked first. The change must be completed and
            effective by the supplied as-of time. A matching owned task is monitored only when its
            completion target is on track and no later than workflow preparation. A completed task
            alone never verifies correction.
          </p>
          <p>
            Values are case-sensitive with surrounding whitespace ignored. Unknown is distinct from
            false. Evidence quality is fixture-declared; no age threshold or legal urgency is inferred.
            Replays use the same logical finding. A newer verified corrected snapshot updates its
            status while retaining earlier evidence. No notification is actually sent.
          </p>
        </details>
      </div>
    </section>
  );
}
