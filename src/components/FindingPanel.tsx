import type { Result } from '../types/experiment';
import { businessText, displayTime, presentFinding } from '../presentation/findingPresentation';
import { displayDisposition, displayEntity, displayEvidenceQuality, displayEvidenceSource, displayInformation, displayWorkflow } from '../presentation/displayLabels';
import OutcomeStatusCard from './OutcomeStatusCard';

interface FindingPanelProps { result: Result; onDownload: () => void }

export default function FindingPanel({ result, onDownload }: FindingPanelProps) {
  const view = presentFinding(result);
  const { input } = result;
  return (
    <section className="panel finding-panel">
      <div className="panel-heading">
        <span className="step">03</span><h2>Finding</h2>
        <button className="export" onClick={onDownload} title="Download finding" aria-label="Download finding">↓</button>
      </div>
      <div className="panel-body finding-body">
        <OutcomeStatusCard status={result.status} explanation={view.explanation} />

        <section className="finding-section why-section">
          <h3>Why This Finding Exists</h3>
          <p>{view.decisiveReason}</p>
          {result.status === 'NO_CURRENT_FINDING' && <p className="section-context">This review does not support a current finding.</p>}
        </section>

        <section className={`record-comparison comparison--${view.comparison.tone}`} aria-labelledby="compared-records-title">
          <h3 id="compared-records-title">What Was Compared</h3>
          <strong className="comparison-state">{view.comparison.label}</strong>
          <dl>
            <div><dt>Legal entity</dt><dd>{displayEntity(input.entityId)}</dd></div>
            <div><dt>Current legal information</dt><dd>{input.change.newValue ?? 'Not available'}</dd></div>
            <div><dt>Legal record</dt><dd>{input.legalRecord.value ?? 'Not available'}</dd></div>
            <div><dt>Managed Services record</dt><dd>{input.managedServices.value ?? 'Not available'}</dd></div>
          </dl>
          <p>{view.comparison.detail}</p>
        </section>

        <section className="finding-section evidence-support">
          <h3>What Evidence Supports It</h3>
          <p className="section-context">Records supporting this review, with their evidence confidence. Original references are available in the details below.</p>
          {view.evidence.length ? <ul className="supporting-records">{view.evidence.map(item => (
            <li key={`${item.source}:${item.reference}`}>
              <div className="evidence-heading"><strong>{displayEvidenceSource(item.source)}</strong><span className={item.needsReview ? 'evidence-review' : 'evidence-provided'}>{item.needsReview ? 'Needs review' : 'Confirmed'}</span></div>
              <p>{item.source === 'Workflow dependency' ? displayInformation(item.value) : item.value ?? 'Information not available'}</p>
              <p className="evidence-meta">Legal entity: {displayEntity(item.entityId)}</p>
              {item.observedAt && <p className="evidence-meta">Recorded: {displayTime(item.observedAt)}</p>}
              {item.quality && <p className="evidence-meta">Evidence confidence: {displayEvidenceQuality(item.quality)}</p>}
              <details className="evidence-reference"><summary>Evidence reference</summary>
                <p className="evidence-meta">{item.source === 'Legal completion' ? 'Legal change reference' : item.source === 'Workflow dependency' ? 'Workflow reference' : 'Evidence update reference'}: {item.version ?? 'Not available'}</p>
                <code>{item.reference}</code>
              </details>
            </li>
          ))}</ul> : <p>No supporting references are available.</p>}
        </section>

        <section className={`finding-section evidence-gaps ${view.gaps.length ? 'has-gaps' : ''}`}>
          <h3>What Evidence Is Missing</h3>
          {view.gaps.length ? <><p className="section-context">Missing, disputed or unverified information:</p><ul>{view.gaps.map(gap => <li key={gap}>{gap}</li>)}</ul></> : <p>No required evidence is missing or disputed in this review.</p>}
        </section>

        <section className="finding-section human-action">
          <h3>Human Action Required</h3><p>{view.action}</p>
          <p className="section-context">Proposed owner: {businessText(result.owner)}</p>
        </section>
        <section className="finding-section expected-next-step">
          <h3>Expected Next Step</h3><p>{view.nextStep}</p>
          <dl className="workflow-context"><div><dt>Upcoming work</dt><dd>{displayWorkflow(result.workflow.id)}</dd></div><div><dt>Workflow preparation</dt><dd>{displayTime(result.workflow.preparationAt)}</dd></div>{result.links.taskId && <div><dt>Planned correction date</dt><dd>{displayTime(input.updateTask.plannedCompletionAt)}</dd></div>}</dl>
        </section>

        <details className="finding-audit-details">
          <summary>Finding References and Evidence History</summary>
          <dl><div><dt>Finding reference</dt><dd>{result.findingId ?? 'No finding created'}</dd></div><div><dt>Reason reference</dt><dd>{result.reason}</dd></div><div><dt>Scenario reference</dt><dd>{result.fixtureId}</dd></div><div><dt>Legal entity reference</dt><dd>{result.entityId}</dd></div><div><dt>Information reviewed</dt><dd>{displayInformation(result.changedField)}</dd></div><div><dt>Workflow reference</dt><dd>{result.workflow.id}</dd></div><div><dt>Finding update</dt><dd>{displayDisposition(result.emissionDisposition)}</dd></div><div><dt>Update / current</dt><dd>{result.revision} / {result.isCurrent ? 'Yes' : 'No'}</dd></div><div><dt>Earlier finding reference</dt><dd>{result.links.priorFindingId ?? 'None'}</dd></div><div><dt>Existing correction reference</dt><dd>{result.links.taskId ?? 'None'}</dd></div></dl>
          <h4>Retained evidence ({result.evidenceHistory.length})</h4>
          <ul>{result.evidenceHistory.map((item, index) => <li key={index}>{displayEvidenceSource(item.source)} · {item.version}<br /><code>{item.reference}</code><br />{displayTime(item.observedAt)} · {item.source === 'Workflow dependency' ? displayInformation(item.value) : item.value}</li>)}</ul>
        </details>
        <div className="guardrails"><div><strong>Human authorization required</strong></div><code>customer_communication_authorized = false</code><code>source_record_write_authorized = false</code></div>
      </div>
    </section>
  );
}
