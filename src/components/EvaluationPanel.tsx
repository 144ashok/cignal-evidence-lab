import type { Result } from '../types/experiment';
import OutcomePath from './OutcomePath';

interface EvaluationPanelProps {
  result: Result | null;
  hasPendingChanges: boolean;
}

export default function EvaluationPanel({ result, hasPendingChanges }: EvaluationPanelProps) {
  return (
    <section className="panel evaluation-panel">
      <div className="panel-heading"><span className="step">02</span><h2>CIGNAL review</h2><span className="panel-caption">FROM EVIDENCE TO OUTCOME</span></div>
      <div className="panel-body">
        {result ? <>
          <div className={`evaluation-receipt ${hasPendingChanges ? 'pending-facts' : ''}`} role="status">
            {hasPendingChanges
              ? 'Information has changed. This path shows the previous review. Select Review Information to refresh the outcome.'
              : 'Review Summary · based on the available information'}
          </div>
          <OutcomePath result={result} />
        </> : <p className="evaluation-receipt">Select Review Information to see the checks behind the outcome.</p>}
        <details className="assumptions">
          <summary>Understanding this review</summary>
          <p>Checks describe facts, not a score. A Managed Services record that matches the current legal record supports no finding only when the required evidence is reliable. An inactive service can also mean no finding for this scenario.</p>
          <p>Unconfirmed information needs verification. A correction task is not proof of resolution. Every decision uses the selected review date, and every next step remains subject to human review.</p>
        </details>
      </div>
    </section>
  );
}
