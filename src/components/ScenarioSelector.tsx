import type { Scenario } from '../types/experiment';
import { businessText } from '../presentation/findingPresentation';
import { displayDisposition } from '../presentation/displayLabels';
import { statusPresentation } from '../config/statusPresentation';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  selectedScenario: Scenario;
  onSelect: (id: string) => void;
  onReset: () => void;
}

export default function ScenarioSelector({
  scenarios, selectedScenario, onSelect, onReset,
}: ScenarioSelectorProps) {
  return (
    <div className="scenario-selection">
      <div className="scenario-bar">
      <label htmlFor="scenario">SCENARIO</label>
      <select id="scenario" value={selectedScenario.id} onChange={event => onSelect(event.target.value)}>
        {scenarios.map(scenario => (
          <option key={scenario.id} value={scenario.id}>{businessText(scenario.label)}</option>
        ))}
      </select>
      <button className="reset" onClick={onReset}>↺ Reset facts</button>
      </div>
      <div className="scenario-details" aria-live="polite">
        <p>{businessText(selectedScenario.description)}</p>
        <p className="scenario-expectation">Expected for this scenario: {statusPresentation[selectedScenario.expectedStatus].label} · {displayDisposition(selectedScenario.expectedDisposition)}. Edited facts may produce a different outcome.</p>
        {selectedScenario.setupNote && <p>{businessText(selectedScenario.setupNote)}</p>}
      </div>
    </div>
  );
}
