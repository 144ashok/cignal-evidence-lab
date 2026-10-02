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

export default function App() {
  const { state: factOptions, retry } = useFactOptions();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [scenarioId, setScenarioId] = useState('');
  const [input, setInput] = useState<EvaluationInput | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<Result[]>([]);
  const [evaluationCount, setEvaluationCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setError('');
    Promise.all([fetchScenarios(controller.signal), fetchFindings()])
      .then(([fixtures, findings]) => {
        if (controller.signal.aborted) return;
        if (!fixtures.length) throw new Error('No local fixtures are available.');
        setScenarios(fixtures);
        setScenarioId(fixtures[0].id);
        setInput(structuredClone(fixtures[0].input));
        setHistory(findings);
      })
      .catch(cause => { if (!controller.signal.aborted) setError(String(cause.message)); });
    return () => controller.abort();
  }, [loadAttempt]);

  const selectedScenario = scenarios.find(scenario => scenario.id === scenarioId);
  const hasPendingChanges = result !== null && JSON.stringify(input) !== JSON.stringify(result.input);

  function selectScenario(id: string) {
    const scenario = scenarios.find(candidate => candidate.id === id);
    if (!scenario) return;
    setScenarioId(id);
    setInput(structuredClone(scenario.input));
  }

  async function runEvaluation() {
    if (!input || busy) return;
    setBusy(true);
    setError('');
    try {
      const next = await evaluateInput(input);
      setResult(next);
      setInput(next.input);
      setEvaluationCount(count => count + 1);
      setHistory(await fetchFindings());
    } catch {
      setError('Evaluation could not complete. Check that the local Node server is running, then try again.');
    } finally {
      setBusy(false);
    }
  }

  async function resetHistory() {
    setBusy(true);
    setError('');
    try {
      await resetFindings();
      setHistory([]);
      setResult(null);
      setEvaluationCount(0);
    } catch {
      setError('Local finding history could not be reset.');
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
            <InputFactsPanel input={input} options={factOptions.options} onInputChange={setInput} onEvaluate={runEvaluation} busy={busy} />
          ) : (
            <section className="panel"><div className="panel-body">
              {factOptions.status === 'error' ? <><p role="alert">{factOptions.message}</p><button onClick={retry}>Retry options</button></> : <p role="status">Loading local fixtures and options…</p>}
            </div></section>
          )}
          {result ? <>
            <EvaluationPanel result={result} evaluationCount={evaluationCount} hasPendingChanges={hasPendingChanges} />
            <FindingPanel result={result} onDownload={() => downloadFinding(result)} />
          </> : <>
            <section className="panel"><div className="panel-heading"><h2>CIGNAL evaluation</h2></div><div className="panel-body">Run an evaluation to inspect the observable checks.</div></section>
            <section className="panel"><div className="panel-heading"><h2>Finding</h2></div><div className="panel-body"><p>No evaluation yet.</p><code>customer_communication_authorized = false</code><br /><code>source_record_write_authorized = false</code></div></section>
          </>}
        </div>
        <section className="panel history-panel">
          <div className="panel-heading"><h2>Local finding history ({history.length})</h2><button className="reset" onClick={resetHistory} disabled={busy}>Reset local finding state</button></div>
          <div className="panel-body">
            <p>Run the same facts again to inspect duplicate suppression. Use a newer snapshot to update the same finding. Independent scenarios share this interactive history; reset it to start a separate experiment.</p>
            {history.length === 0 ? <p>No findings recorded.</p> : <div className="table-scroll"><table><thead><tr><th>Finding</th><th>Entity</th><th>Field</th><th>Outcome</th><th>Revision</th><th>Current</th></tr></thead><tbody>{history.map(item => <tr key={item.findingId}><td>{item.findingId}</td><td>{item.entityId}</td><td>{item.changedField}</td><td>{item.status}</td><td>{item.revision}</td><td>{item.isCurrent ? 'Yes' : 'No'}</td></tr>)}</tbody></table></div>}
          </div>
        </section>
        <AppFooter />
      </main>
    </div>
  );
}
