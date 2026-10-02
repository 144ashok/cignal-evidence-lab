import type { SelectOption } from '../../types/factOptions';

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
}

export default function SelectField<T extends string>({
  label, value, options, onChange,
}: SelectFieldProps<T>) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={event => {
        const selected = options.find(option => option.value === event.target.value);
        if (selected) onChange(selected.value);
      }}>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
