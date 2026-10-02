export default function LabIntroduction() {
  return (
    <>
      <div className="intro">
        <div>
          <div className="eyebrow">KNOWLEDGE OBJECT <span>/</span> 030</div>
          <h1>A legal change. A downstream gap.</h1>
          <p>Review the facts, understand the finding, and decide the next action.</p>
        </div>
        <div className="rules-tag">
          <span>⌘</span> Evidence and human review
          <small>PROTECT + SERVE</small>
        </div>
      </div>
      <div className="object-bar">
        <span className="object-icon">↳</span>
        <div>
          <strong>Legal Change Completed but Managed Services Data Remains Stale</strong>
          <span>Knowledge Object #30 <b>·</b> Legal entity maintenance</span>
        </div>
        <span className="version">HUMAN REVIEW</span>
      </div>
      <ol className="knowledge-journey" aria-label="From input facts to finding">
        {['Input Facts', 'Outcome Path', 'Finding'].map((step, index) => (
          <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong>{index < 2 && <span className="journey-arrow" aria-hidden="true">→</span>}</li>
        ))}
      </ol>
    </>
  );
}
