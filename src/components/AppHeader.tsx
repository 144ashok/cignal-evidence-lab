export default function AppHeader() {
  return (
    <header>
      <a className="brand" href="./">
        <span className="brand-icon">c<span>ı</span></span>
        <strong>
          CIGNAL<span className="brand-divider">/</span>
          <span className="brand-sub">Evidence Lab</span>
        </strong>
      </a>
      <div className="header-right">
        <span className="local-dot" /> Local environment
        <span className="prototype">PROTOTYPE</span>
      </div>
    </header>
  );
}
