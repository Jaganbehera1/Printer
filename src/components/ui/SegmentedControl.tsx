export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  description?: string;
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
            className={`flex cursor-pointer flex-col justify-center rounded-xl border-2 px-4 py-3 transition-all duration-150 active:scale-[0.99] ${
              active
                ? 'border-primary-500 bg-primary-50 text-primary-900'
                : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={active}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span className="text-sm font-medium">{option.label}</span>
            {option.description && (
              <span className={`mt-0.5 text-xs ${active ? 'text-primary-700' : 'text-neutral-500'}`}>
                {option.description}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}
