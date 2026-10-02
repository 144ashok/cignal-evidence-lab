import type { Result } from '../types/experiment';
import { presentFinding } from '../presentation/findingPresentation';

export default function OutcomePath({ result }: { result: Result }) {
  const presentation = presentFinding(result);
  return (
    <section className="outcome-path" aria-labelledby="outcome-path-title">
      <h3 id="outcome-path-title">Outcome Path</h3>
      <p className="path-intro">These checks explain the outcome. Highlighted items show why it was reached; a failed check does not always mean a finding exists.</p>
      <ol className="path-checks">{presentation.outcomePath.map(check => (
        <li className={`path-check ${check.decisionPoint ? 'decision-check' : ''}`} key={check.name}>
          <span className={`path-symbol ${check.passed === null ? 'unknown' : check.passed ? 'passed' : 'failed'}`} aria-label={check.passed === null ? 'Unknown' : check.passed ? 'Passed' : 'Failed'}>{check.passed === null ? '?' : check.passed ? '✓' : '×'}</span>
          <div><strong>{check.name}</strong>{check.decisionPoint && <span className="decision-label">Decision point</span>}<p>{check.detail}</p></div>
        </li>
      ))}</ol>
      <div className="path-conclusion"><span>Outcome</span><code>{result.status}</code><p>{presentation.decisiveReason}</p></div>
    </section>
  );
}
