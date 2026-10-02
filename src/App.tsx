import { useEffect, useState } from 'react';
import { useFactOptions } from './hooks/useFactOptions';
import { evaluateInput, fetchFindings, fetchScenarios, resetFindings } from './api/experiment';
import type { EvaluationInput, Result, Scenario } from './types/experiment';
import { downloadFinding } from './utils/downloadFinding';
import AppHeader from './components/AppHeader';
import LabIntroduction from './components/LabIntroduction';
import ScenarioSelector from './components/ScenarioSelector';
import InputFactsPanel from './components/InputFactsPanel';
import EvaluationPanel from './components/EvaluationPanel';
import FindingPanel from './components/FindingPanel';
import AppFooter from './components/AppFooter';
import { displayEntity, displayInformation } from './presentation/displayLabels';
import { statusPresentation } from './config/statusPresentation';

export default function App() {
  const { state: factOptions, retry } = useFactOptions();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [scenarioId, setScenarioId] = useState('');
  const [input, setInput] = useState<EvaluationInput | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<Result[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setError('');
    fetchScenarios(controller.signal)
      .then(allFixtures => {
        if (controller.signal.aborted) return;
        const fixtures = allFixtures.filter(fixture => fixture.showInSelector);
        if (!fixtures.length) throw new Error('No scenarios are available.');
        setScenarios(fixtures);
        setScenarioId(fixtures[0].id);
        setInput(structuredClone(fixtures[0].input));
      })
      .catch(cause => { if (!controller.signal.aborted) setError(String(cause.message)); });
    return () => controller.abort();
  }, [loadAttempt]);

  useEffect(() => {
    if (!scenarioId) return;
    const controller = new AbortController();
    setHistoryLoading(true);
    setHistory([]);
    fetchFindings(scenarioId, controller.signal)
      .then(findings => { if (!controller.signal.aborted) setHistory(findings); })
      .catch(() => { if (!controller.signal.aborted) setError('Could not load this scenario’s finding history.'); })
      .finally(() => { if (!controller.signal.aborted) setHistoryLoading(false); });
    return () => controller.abort();
  }, [scenarioId, loadAttempt]);

  const selectedScenario = scenarios.find(scenario => scenario.id === scenarioId);
  const hasPendingChanges = result !== null && JSON.stringify(input) !== JSON.stringify(result.input);

  function selectScenario(id: string) {
    const scenario = scenarios.find(candidate => candidate.id === id);
    if (!scenario) return;
    setScenarioId(id);
    setInput(structuredClone(scenario.input));
    setResult(null);
    setError('');
  }

  async function runEvaluation() {
    if (!input || busy) return;
    setBusy(true);
    setError('');
    try {
      const next = await evaluateInput(input, scenarioId);
      setResult(next);
      setInput(next.input);
      setHistory(await fetchFindings(scenarioId));
    } catch {
      setError('The review could not be completed. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  async function resetHistory() {
    setBusy(true);
    setError('');
    try {
      await resetFindings(scenarioId);
      setHistory([]);
      setResult(null);
    } catch {
      setError('This scenario’s finding history could not be reset. Please try again.');
    } finally { setBusy(false); }
  }

  return (
    <div className="app">
      <AppHeader />
      <main>
        <LabIntroduction />
        {error && <div className="load-error" role="alert">{error}{!input && <button onClick={() => setLoadAttempt(value => value + 1)}>Retry</button>}</div>}
        {selectedScenario && (
          <fieldset disabled={busy} className="scenario-controls">
            <ScenarioSelector scenarios={scenarios} selectedScenario={selectedScenario} onSelect={selectScenario} onReset={() => selectScenario(scenarioId)} />
          </fieldset>
        )}
        <div className="panels">
          {factOptions.status === 'ready' && input ? (
            <InputFactsPanel input={input} options={factOptions.options} onInputChange={setInput} onEvaluate={runEvaluation} busy={busy || historyLoading} />
          ) : (
            <section className="panel"><div className="panel-body">
              {factOptions.status === 'error' ? <><p role="alert">{factOptions.message}</p><button onClick={retry}>Try again</button></> : <p role="status">Loading scenarios and review options…</p>}
            </div></section>
          )}
          {result ? <>
            <EvaluationPanel result={result} hasPendingChanges={hasPendingChanges} />
            <FindingPanel result={result} onDownload={() => downloadFinding(result)} />
          </> : <>
            <EvaluationPanel result={null} hasPendingChanges={false} />
            <section className="panel"><div className="panel-heading"><h2>Finding</h2></div><div className="panel-body"><p>No review yet.</p><code>customer_communication_authorized = false</code><br /><code>source_record_write_authorized = false</code></div></section>
          </>}
        </div>
        <section className="panel history-panel">
          <div className="panel-heading"><h2>Selected scenario history ({history.length})</h2><button className="reset" onClick={resetHistory} disabled={busy || historyLoading}>Reset this scenario’s history</button></div>
          <div className="panel-body">
            <p>Previous findings for this scenario are retained here. Updated evidence is reviewed against the existing finding, keeping the review history together.</p>
            {history.length === 0 ? <p>No findings recorded.</p> : <div className="table-scroll"><table>
              <thead><tr><th>Finding</th><th>Legal Entity</th><th>Information Reviewed</th><th>Outcome</th><th>Update</th><th>Current</th></tr></thead>
              <tbody>{history.map(item => <tr key={item.findingId}>
                <td><details><summary>Legal change review</summary><code>{item.findingId}</code></details></td>
                <td>{displayEntity(item.entityId)}</td><td>{displayInformation(item.changedField)}</td>
                <td>{statusPresentation[item.status].label}</td><td>{item.revision}</td><td>{item.isCurrent ? 'Yes' : 'No'}</td>
              </tr>)}</tbody>
            </table></div>}
          </div>
        </section>
        <AppFooter />
      </main>
    </div>
  );
}
