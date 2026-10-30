import type { ButtonHTMLAttributes } from 'react';
import Spinner from '@/components/ui/Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary-600 text-white shadow-sm hover:bg-primary-700 focus-visible:ring-primary-300',
  secondary: 'border border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50 focus-visible:ring-neutral-300',
  ghost: 'text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-300',
  danger: 'bg-error-600 text-white shadow-sm hover:bg-error-700 focus-visible:ring-error-300',
  success: 'bg-success-600 text-white shadow-sm hover:bg-success-700 focus-visible:ring-success-300',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-sm gap-2',
  lg: 'h-14 px-6 text-base gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99] ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
