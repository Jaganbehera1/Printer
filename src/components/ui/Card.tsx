import type { ReactNode } from 'react';

export default function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      {children}
    </div>
  );
}
