import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { ReactNode } from 'react';

type Tone = 'error' | 'success' | 'info';

const TONES: Record<Tone, { box: string; Icon: typeof Info }> = {
  error: { box: 'border-error-200 bg-error-50 text-error-800', Icon: AlertTriangle },
  success: { box: 'border-success-200 bg-success-50 text-success-800', Icon: CheckCircle2 },
  info: { box: 'border-secondary-200 bg-secondary-50 text-secondary-800', Icon: Info },
};

export default function Alert({ tone = 'error', children }: { tone?: Tone; children: ReactNode }) {
  const { box, Icon } = TONES[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-normal ${box}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
