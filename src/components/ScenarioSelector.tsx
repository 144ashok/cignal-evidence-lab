import type { Scenario } from '../types/experiment';

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
    <div className="scenario-bar">
      <label htmlFor="scenario">TEST SCENARIO</label>
      <select id="scenario" value={selectedScenario.id} onChange={event => onSelect(event.target.value)}>
        {scenarios.map(scenario => (
          <option key={scenario.id} value={scenario.id}>{scenario.label}</option>
        ))}
      </select>
      <span>{selectedScenario.description}</span>
      <button className="reset" onClick={onReset}>↺ Reset facts</button>
    </div>
  );
}
