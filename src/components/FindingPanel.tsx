import type { Result } from '../engine';
import { statusPresentation } from '../config/statusPresentation';

interface FindingPanelProps {
  result: Result;
  onDownload: () => void;
}

export default function FindingPanel({ result, onDownload }: FindingPanelProps) {
  const { input } = result;
  const serviceValueCurrent = Boolean(input.change.newValue && input.managedServices.value === input.change.newValue);

  return (
    <section className="panel finding-panel">
      <div className="panel-heading">
        <span className="step">03</span>
        <h2>Finding</h2>
        <button
          className="export"
          onClick={onDownload}
          title="Download evaluated finding as JSON"
          aria-label="Download evaluated finding as JSON"
        >↓</button>
      </div>
      <div className="panel-body">
        <div className="finding-meta">
          <span className="section-label">
            {result.status === 'NO_CURRENT_FINDING' ? 'EVALUATION ID' : 'FINDING ID'}
          </span>
          <code>{result.findingId ?? 'No logical finding created'}</code>
        </div>
        <span className={`status-badge ${result.status.toLowerCase()}`}>
          {statusPresentation[result.status].label}
        </span>

        <div className="section-label spaced">EMISSION & LINKAGE</div>
        <code>{result.emissionDisposition}</code>
        <p className="explanation">Revision {result.revision} · Current: {result.isCurrent ? 'yes' : 'no'}</p>
        <p className="explanation">Earlier finding: {result.links.priorFindingId ?? 'none'}<br />Task: {result.links.taskId ?? 'none'}</p>
        <div className="section-label spaced">WORKFLOW</div>
        <p className="explanation">{result.workflow.id ?? 'Unknown'}<br />Preparation: {result.workflow.preparationAt ?? 'Unknown'}</p>

        <div className="section-label spaced">REASON CODE</div>
        <code className="reason">{result.reason}</code>
        <div className="section-label spaced">BUSINESS EXPLANATION</div>
        <p className="explanation">{result.explanation}</p>

        <div className="section-label spaced">COMPARED FACTS</div>
        <div className="comparison">
          <div>
            <span>Legal record</span>
            <strong>{input.legalRecord.value ?? 'Unknown'}</strong>
            <small>Expected · new value: {input.change.newValue ?? 'Unknown'}</small>
          </div>
          <div className={serviceValueCurrent ? '' : 'mismatch'}>
            <span>Managed Services <b>{serviceValueCurrent ? 'ALIGNED' : 'MISMATCH'}</b></span>
            <strong>{input.managedServices.value ?? 'Unknown'}</strong>
          </div>
        </div>

        <div className="section-label spaced">
          EVIDENCE REFERENCES <span className="count">{result.evidence.length}</span>
        </div>
        <div className="evidence-list">
          {result.evidence.map(evidence => (
            <details key={`${evidence.source}:${evidence.reference}`}>
              <summary>
                <span className="document-icon">▤</span>
                <span>{evidence.source}<code>{evidence.reference}</code></span>
                <span className="evidence-arrow">↗</span>
              </summary>
              <p>Entity: {evidence.entityId ?? 'unknown'} · Version: {evidence.version ?? 'not supplied'}<br />Time: {evidence.observedAt ?? 'not applicable'}<br />Quality: {evidence.quality ?? 'supplied dependency'}<br />Value: {evidence.value ?? 'unknown'}</p>
            </details>
          ))}
        </div>

        {result.unresolvedInformation.length > 0 && <div className="unresolved"><div className="section-label spaced">UNRESOLVED INFORMATION</div><ul>{result.unresolvedInformation.map(item => <li key={item}>{item}</li>)}</ul></div>}
        <details className="assumptions"><summary>Retained evidence history ({result.evidenceHistory.length})</summary>{result.evidenceHistory.map((item, index) => <p key={index}>{item.source} · {item.version}<br />{item.reference}<br />{item.observedAt} · {item.value}</p>)}</details>

        <div className="owner">
          <span className="avatar">MS</span>
          <div><span>ASSIGNED OWNER</span><strong>{result.owner}</strong></div>
        </div>
        <div className="action">
          <div className="section-label">↗ RECOMMENDED HUMAN ACTION</div>
          <p>{result.action}</p>
        </div>
        <div className="guardrails">
          <div>⌑ <strong>Human authorization required</strong></div>
          <code>customer_communication_authorized = false</code>
          <code>source_record_write_authorized = false</code>
        </div>
      </div>
    </section>
  );
}
