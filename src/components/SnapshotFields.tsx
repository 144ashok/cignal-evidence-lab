import type { Snapshot } from '../types/experiment';
import type { FactOptions } from '../types/factOptions';
import TextField from './fields/TextField';
import SelectField from './fields/SelectField';

interface SnapshotFieldsProps {
  label: string;
  snapshot: Snapshot;
  options: FactOptions;
  onChange: (snapshot: Snapshot) => void;
}

export default function SnapshotFields({ label, snapshot, options, onChange }: SnapshotFieldsProps) {
  return (
    <details className="metadata-fields">
      <summary>{label} evidence details</summary>
      {([{ key: 'entityId', label: 'Legal Entity on the Record' }, { key: 'field', label: 'Information Covered' }, { key: 'evidenceReference', label: 'Supporting Evidence' }, { key: 'observedAt', label: 'Evidence Recorded Date' }, { key: 'version', label: 'Evidence Update Reference' }] as const).map(({ key, label }) => (
        <TextField key={key} label={label} value={snapshot[key] ?? ''} onChange={value => onChange({ ...snapshot, [key]: value || null })} />
      ))}
      <SelectField label="Evidence Confidence" value={snapshot.evidenceQuality ?? ''} options={options.evidenceQualityOptions} onChange={value => onChange({ ...snapshot, evidenceQuality: value || null })} />
      <p className="field-help">Confidence reflects the available evidence. Outdated or conflicting information needs review.</p>
    </details>
  );
}
