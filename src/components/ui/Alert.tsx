import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { ReactNode } from 'react';

type Tone = 'error' | 'success' | 'info';

const TONES: Record<Tone, { box: string; Icon: typeof Info }> = {
  error: { box: 'border-error-200 bg-error-50 text-error-800 shadow-sm shadow-error-900/5', Icon: AlertTriangle },
  success: { box: 'border-success-200 bg-success-50 text-success-800 shadow-sm shadow-success-900/5', Icon: CheckCircle2 },
  info: { box: 'border-primary-200 bg-primary-50 text-primary-800 shadow-sm shadow-primary-900/5', Icon: Info },
};

export default function Alert({ tone = 'error', children }: { tone?: Tone; children: ReactNode }) {
  const { box, Icon } = TONES[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-6 ${box}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
