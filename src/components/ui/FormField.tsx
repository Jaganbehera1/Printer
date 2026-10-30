import type { InputHTMLAttributes, ReactNode } from 'react';
import { inputClassName } from '@/components/ui/formStyles';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string | null;
  hint?: string;
  children: ReactNode;
}

export default function FormField({ label, htmlFor, error, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-neutral-800">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-error-700" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="text-sm text-neutral-500">{hint}</p>
      )}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  const { invalid, className = '', ...rest } = props;
  return <input {...rest} aria-invalid={invalid || undefined} className={`${inputClassName} ${className}`} />;
}
