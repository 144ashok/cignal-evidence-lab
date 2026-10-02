import type { Status } from '../types/experiment';
import { statusPresentation } from '../config/statusPresentation';

export default function OutcomeStatusCard({ status, explanation }: { status: Status; explanation: string }) {
  return (
    <div className={`outcome-status-card outcome-status--${status.toLowerCase()}`} role="status" aria-live="polite" aria-atomic="true">
      <span className="outcome-kicker">CIGNAL outcome</span>
      <h3><span className="outcome-indicator" aria-hidden="true" />{statusPresentation[status].label}</h3>
      <code>{status}</code>
      <p>{explanation}</p>
    </div>
  );
}
