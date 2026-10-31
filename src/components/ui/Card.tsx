import type { ReactNode } from 'react';

export default function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_12px_36px_-24px_rgba(11,31,58,0.28)] ring-1 ring-white transition-[box-shadow,border-color] duration-200 hover:border-neutral-300 hover:shadow-[0_18px_42px_-24px_rgba(11,31,58,0.3)] sm:rounded-3xl sm:p-6 ${className}`}>
      {children}
    </div>
  );
}
