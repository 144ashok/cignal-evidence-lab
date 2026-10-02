import type { EvaluationInput } from '../types/experiment';
import type { FactOptions } from '../types/factOptions';
import TextField from './fields/TextField';
import SelectField from './fields/SelectField';
import SnapshotFields from './SnapshotFields';

interface InputFactsPanelProps {
  input: EvaluationInput;
  options: FactOptions;
  onInputChange: (input: EvaluationInput) => void;
  onEvaluate: () => void;
  busy: boolean;
}

export default function InputFactsPanel({ input, options, onInputChange, onEvaluate, busy }: InputFactsPanelProps) {
  function update<K extends keyof EvaluationInput>(key: K, value: EvaluationInput[K]) {
    onInputChange({ ...input, [key]: value });
  }
  const { change, workflow, updateTask: task } = input;

  return (
    <section className="panel input-panel">
      <div className="panel-heading"><span className="step">01</span><h2>Input facts</h2><span className="panel-caption">SYNTHETIC</span></div>
      <fieldset className="panel-body facts-fieldset" disabled={busy}>
        <p className="panel-description">Blank values are unknown. All times are explicit UTC inputs.</p>
        <details className="metadata-fields"><summary>Fixture and prior finding identifiers</summary>
          <TextField label="Fixture/test ID" value={input.fixtureId ?? ''} onChange={value => update('fixtureId', value || null)} />
          <TextField label="Prior finding ID (optional; otherwise looked up locally)" value={input.priorFindingId ?? ''} onChange={value => update('priorFindingId', value || null)} />
        </details>
        <div className="field-pair">
          <TextField label="Entity ID" value={input.entityId ?? ''} onChange={value => update('entityId', value || null)} />
          <TextField label="Changed field" value={change.field ?? ''} onChange={value => update('change', { ...change, field: value || null })} />
        </div>
        <div className="section-label">CHANGE RECORD</div>
        <TextField label="Old value" value={change.oldValue ?? ''} onChange={value => update('change', { ...change, oldValue: value || null })} />
        <TextField label="New value" value={change.newValue ?? ''} onChange={value => update('change', { ...change, newValue: value || null })} />
        <SelectField label="Completion status" value={change.completionStatus ?? ''} options={options.completionStatusOptions} onChange={value => update('change', { ...change, completionStatus: value || null })} />
        <TextField label="Effective at (UTC)" value={change.effectiveAt ?? ''} onChange={value => update('change', { ...change, effectiveAt: value || null })} />
        <details className="metadata-fields"><summary>Legal change evidence</summary>
          {(['eventId', 'entityId', 'completionEvidenceReference'] as const).map(key => <TextField key={key} label={key} value={change[key] ?? ''} onChange={value => update('change', { ...change, [key]: value || null })} />)}
          <SelectField label="Completion evidence quality" value={change.completionEvidenceQuality ?? ''} options={options.evidenceQualityOptions} onChange={value => update('change', { ...change, completionEvidenceQuality: value || null })} />
        </details>

        <div className="section-label">SOURCE RECORDS</div>
        <TextField label="Legal record value" value={input.legalRecord.value ?? ''} onChange={value => update('legalRecord', { ...input.legalRecord, value: value || null })} />
        <SnapshotFields label="Legal record" snapshot={input.legalRecord} options={options} onChange={value => update('legalRecord', value)} />
        <TextField label="Managed Services value" value={input.managedServices.value ?? ''} onChange={value => update('managedServices', { ...input.managedServices, value: value || null })} />
        <SnapshotFields label="Managed Services" snapshot={input.managedServices} options={options} onChange={value => update('managedServices', value)} />
        <SelectField label="Relevant service active" value={input.service.active === null ? 'unknown' : String(input.service.active)} options={[{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }, { value: 'unknown', label: 'Unknown' }]} onChange={value => update('service', { ...input.service, active: value === 'unknown' ? null : value === 'true' })} />

        <div className="section-label">WORKFLOW & CLOCK</div>
        <TextField label="Evaluation as-of (UTC)" value={input.asOf ?? ''} onChange={value => update('asOf', value || null)} />
        <TextField label="Workflow preparation (UTC)" value={workflow.preparationAt ?? ''} onChange={value => update('workflow', { ...workflow, preparationAt: value || null })} />
        <SelectField label="Workflow uses changed field" value={workflow.consumesFields === null ? 'unknown' : String(workflow.consumesFields.includes(change.field ?? ''))} options={[{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }, { value: 'unknown', label: 'Unknown' }]} onChange={value => update('workflow', { ...workflow, consumesFields: value === 'unknown' ? null : value === 'true' && change.field ? [change.field] : [] })} />
        <details className="metadata-fields"><summary>Workflow and service identifiers</summary>
          {(['id', 'entityId', 'evidenceReference'] as const).map(key => <TextField key={key} label={`Workflow ${key}`} value={workflow[key] ?? ''} onChange={value => update('workflow', { ...workflow, [key]: value || null })} />)}
          <TextField label="Service entity ID" value={input.service.entityId ?? ''} onChange={value => update('service', { ...input.service, entityId: value || null })} />
        </details>

        <div className="section-label">EXISTING CORRECTION WORK</div>
        <SelectField label="Correction task status" value={task.status ?? ''} options={options.correctionTaskOptions} onChange={value => update('updateTask', { ...task, status: value || null })} />
        <details className="metadata-fields"><summary>Task ownership, target and timing</summary>
          {(['id', 'owner', 'targetEntityId', 'targetChangeId', 'targetField', 'plannedCompletionAt'] as const).map(key => <TextField key={key} label={key} value={task[key] ?? ''} onChange={value => update('updateTask', { ...task, [key]: value || null })} />)}
        </details>
        <button className="run-button" onClick={onEvaluate} disabled={busy}>{busy ? 'Evaluating…' : 'Run evaluation'} <span>→</span></button>
        <div className="input-note">Local finding history is saved. Source records are never changed.</div>
      </fieldset>
    </section>
  );
}
