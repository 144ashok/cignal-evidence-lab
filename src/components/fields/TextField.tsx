interface TextFieldProps {
  label: string;
  value: string;
  type?: 'text' | 'date';
  onChange: (value: string) => void;
}

export default function TextField({ label, value, type = 'text', onChange }: TextFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={event => onChange(event.target.value)} />
    </label>
  );
}
