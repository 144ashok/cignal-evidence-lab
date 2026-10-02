import type { EvaluationInput } from '../types/experiment';
import type { FactOptions } from '../types/factOptions';
import TextField from './fields/TextField';
import SelectField from './fields/SelectField';
import SnapshotFields from './SnapshotFields';
import { displayEntity } from '../presentation/displayLabels';

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
      <div className="panel-heading"><span className="step">01</span><h2>Input facts</h2><span className="panel-caption">EXAMPLE DATA</span></div>
      <fieldset className="panel-body facts-fieldset" disabled={busy}>
        <p className="panel-description">Blank entries mean the information is not yet known. All dates and times use UTC.</p>
        <details className="metadata-fields"><summary>Scenario and Earlier Finding</summary>
          <TextField label="Scenario Reference" value={input.fixtureId ?? ''} onChange={value => update('fixtureId', value || null)} />
          <TextField label="Earlier Finding Reference (Optional)" value={input.priorFindingId ?? ''} onChange={value => update('priorFindingId', value || null)} />
          <p className="field-help">Leave the earlier finding reference blank to check this scenario's saved history automatically.</p>
        </details>
        <div className="field-pair">
          <div className="entity-summary">
            <span>Legal Entity</span><strong>{displayEntity(input.entityId)}</strong>
            <details className="metadata-fields"><summary>Record Reference</summary>
              <TextField label="Legal Entity Reference" value={input.entityId ?? ''} onChange={value => update('entityId', value || null)} />
            </details>
          </div>
          <SelectField label="What Changed" value={change.field ?? ''} options={options.changedFieldOptions} onChange={value => update('change', { ...change, field: value || null })} />
        </div>
        <div className="section-label">LEGAL CHANGE</div>
        <TextField label="Previous Value" value={change.oldValue ?? ''} onChange={value => update('change', { ...change, oldValue: value || null })} />
        <TextField label="Current Value" value={change.newValue ?? ''} onChange={value => update('change', { ...change, newValue: value || null })} />
        <SelectField label="Change Status" value={change.completionStatus ?? ''} options={options.completionStatusOptions} onChange={value => update('change', { ...change, completionStatus: value || null })} />
        <TextField label="Change Effective Date" value={change.effectiveAt ?? ''} onChange={value => update('change', { ...change, effectiveAt: value || null })} />
        <details className="metadata-fields"><summary>Legal Change Evidence</summary>
          {([{ key: 'eventId', label: 'Legal Change Reference' }, { key: 'entityId', label: 'Legal Entity on the Change' }, { key: 'completionEvidenceReference', label: 'Supporting Evidence Reference' }] as const).map(({ key, label }) => <TextField key={key} label={label} value={change[key] ?? ''} onChange={value => update('change', { ...change, [key]: value || null })} />)}
          <SelectField label="Change Evidence Confidence" value={change.completionEvidenceQuality ?? ''} options={options.evidenceQualityOptions} onChange={value => update('change', { ...change, completionEvidenceQuality: value || null })} />
        </details>

        <div className="section-label">CURRENT RECORDS</div>
        <TextField label="Current Legal Record" value={input.legalRecord.value ?? ''} onChange={value => update('legalRecord', { ...input.legalRecord, value: value || null })} />
        <SnapshotFields label="Legal record" snapshot={input.legalRecord} options={options} onChange={value => update('legalRecord', value)} />
        <TextField label="Current Managed Services Record" value={input.managedServices.value ?? ''} onChange={value => update('managedServices', { ...input.managedServices, value: value || null })} />
        <SnapshotFields label="Managed Services" snapshot={input.managedServices} options={options} onChange={value => update('managedServices', value)} />
        <SelectField label="Managed Service Active" value={input.service.active === null ? 'unknown' : String(input.service.active)} options={options.serviceActivityOptions} onChange={value => update('service', { ...input.service, active: value === 'unknown' ? null : value === 'true' })} />

        <div className="section-label">UPCOMING WORK & REVIEW</div>
        <TextField label="Review Date" value={input.asOf ?? ''} onChange={value => update('asOf', value || null)} />
        <TextField label="Upcoming Workflow Date" value={workflow.preparationAt ?? ''} onChange={value => update('workflow', { ...workflow, preparationAt: value || null })} />
        <p className="field-help">This is the planned preparation date, not a statutory deadline.</p>
        <SelectField label="Does This Change Affect Upcoming Work?" value={workflow.consumesFields === null ? 'unknown' : String(workflow.consumesFields.includes(change.field ?? ''))} options={options.workflowDependencyOptions} onChange={value => update('workflow', { ...workflow, consumesFields: value === 'unknown' ? null : value === 'true' && change.field ? [change.field] : [] })} />
        <details className="metadata-fields"><summary>Upcoming Work and Service Details</summary>
          {([{ key: 'id', label: 'Upcoming Work Reference' }, { key: 'entityId', label: 'Legal Entity for Upcoming Work' }, { key: 'evidenceReference', label: 'Work Preparation Evidence' }] as const).map(({ key, label }) => <TextField key={key} label={label} value={workflow[key] ?? ''} onChange={value => update('workflow', { ...workflow, [key]: value || null })} />)}
          <TextField label="Legal Entity Receiving the Service" value={input.service.entityId ?? ''} onChange={value => update('service', { ...input.service, entityId: value || null })} />
        </details>

        <div className="section-label">EXISTING CORRECTION WORK</div>
        <SelectField label="Existing Correction Activity" value={task.status ?? ''} options={options.correctionTaskOptions} onChange={value => update('updateTask', value === 'none' ? { id: null, status: 'none', owner: null, targetEntityId: null, targetChangeId: null, targetField: null, plannedCompletionAt: null } : { ...task, status: value || null })} />
        {task.status !== 'none' && <details className="metadata-fields"><summary>Correction Responsibility and Timing</summary>
          {([{ key: 'id', label: 'Correction Reference' }, { key: 'owner', label: 'Responsible Team or Colleague' }, { key: 'targetEntityId', label: 'Legal Entity Being Corrected' }, { key: 'targetChangeId', label: 'Related Legal Change' }, { key: 'targetField', label: 'Information Being Corrected' }, { key: 'plannedCompletionAt', label: 'Planned Completion Date' }] as const).map(({ key, label }) => <TextField key={key} label={label} value={task[key] ?? ''} onChange={value => update('updateTask', { ...task, [key]: value || null })} />)}
          <p className="field-help">To monitor existing work, the correction must cover this legal change, have an assigned owner, and be on track for upcoming work. Completed work must be confirmed against the updated Managed Services record.</p>
        </details>}
        <button className="run-button" onClick={onEvaluate} disabled={busy}>{busy ? 'Reviewing…' : 'Review Information'} <span>→</span></button>
        <div className="input-note">Finding history is saved for this scenario. Source records are never changed.</div>
      </fieldset>
    </section>
  );
}
