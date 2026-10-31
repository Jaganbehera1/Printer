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
  primary: 'bg-gradient-to-r from-accent-400 to-accent-500 text-primary-900 shadow-md shadow-accent-700/20 hover:-translate-y-0.5 hover:from-accent-300 hover:to-accent-400 hover:shadow-lg focus-visible:ring-accent-300',
  secondary: 'border border-neutral-200 bg-white text-primary-800 shadow-sm hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50 focus-visible:ring-neutral-300',
  ghost: 'text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-300',
  danger: 'bg-error-600 text-white shadow-sm hover:bg-error-700 focus-visible:ring-error-300',
  success: 'bg-success-600 text-white shadow-sm hover:bg-success-700 focus-visible:ring-success-300',
};

const SIZES: Record<Size, string> = {
  sm: 'min-h-10 px-3 text-sm gap-1.5',
  md: 'min-h-11 px-4 text-sm gap-2',
  lg: 'min-h-12 px-5 text-base gap-2 sm:min-h-14 sm:px-6',
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
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99] ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
