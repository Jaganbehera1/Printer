export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface SegmentedControlProps<T extends string> {
  name: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function SegmentedControl<T extends string>({ name, options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <label
            key={option.value}
            className={`flex min-h-[3.75rem] flex-col justify-center rounded-xl border-2 px-4 py-3 transition-all duration-150 ${
              option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-[0.99]'
            } ${
              active
                ? 'border-accent-500 bg-accent-50 text-primary-900 shadow-sm shadow-accent-500/10'
                : 'border-neutral-200 bg-white text-neutral-800 hover:border-primary-300 hover:bg-primary-50/50'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={active}
              disabled={option.disabled}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span className="text-sm font-medium">{option.label}</span>
            {option.description && (
              <span className={`mt-0.5 text-xs leading-5 ${active ? 'text-primary-700' : 'text-neutral-500'}`}>
                {option.description}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}
