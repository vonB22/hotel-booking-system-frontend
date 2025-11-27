interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  options?: { value: string; label: string }[];
  textarea?: boolean;
  rows?: number;
  className?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  step?: string;
}

export default function FormInput({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  options,
  textarea = false,
  rows = 4,
  className = '',
  disabled = false,
  min,
  max,
  step,
}: FormInputProps) {
  const inputClasses = `w-full px-3 py-2 border border-gray-300 rounded-lg skeleton-input ${className}`;

  return (
    <div className="space-y-2">
      <label htmlFor={label} className="block text-sm text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {options ? (
        <select
          id={label}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={inputClasses}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={inputClasses}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={inputClasses}
        />
      )}
    </div>
  );
}
