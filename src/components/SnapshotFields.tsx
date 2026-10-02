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
      <summary>{label} evidence metadata</summary>
      {(['entityId', 'field', 'evidenceReference', 'observedAt', 'version'] as const).map(key => (
        <TextField key={key} label={key === 'observedAt' ? 'Observed at (UTC)' : key} value={snapshot[key] ?? ''} onChange={value => onChange({ ...snapshot, [key]: value || null })} />
      ))}
      <SelectField label="Evidence quality" value={snapshot.evidenceQuality ?? ''} options={options.evidenceQualityOptions} onChange={value => onChange({ ...snapshot, evidenceQuality: value || null })} />
    </details>
  );
}
