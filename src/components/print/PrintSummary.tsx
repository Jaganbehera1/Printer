import { DUPLEX_LABELS, PRINT_MODE_LABELS, formatFileSize } from '@/utils/format';
import type { DuplexMode, PrintMode } from '@/types/printJob';

interface PrintSummaryProps {
  fileName: string | null;
  fileSize: number | null;
  pagesLabel: string;
  copies: number;
  printMode: PrintMode;
  duplex: DuplexMode;
}

export default function PrintSummary({ fileName, fileSize, pagesLabel, copies, printMode, duplex }: PrintSummaryProps) {
  const rows: [string, string][] = [
    ['Document', fileName ?? 'No file selected'],
    ['File size', fileSize === null ? '-' : formatFileSize(fileSize)],
    ['Pages', pagesLabel],
    ['Copies', String(copies)],
    ['Mode', PRINT_MODE_LABELS[printMode]],
    ['Sides', DUPLEX_LABELS[duplex]],
  ];

  return (
    <dl className="divide-y divide-neutral-100 rounded-xl bg-neutral-50 px-4">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-start justify-between gap-4 py-3">
          <dt className="text-sm text-neutral-500">{label}</dt>
          <dd className="min-w-0 truncate text-right text-sm font-medium text-neutral-900" title={value}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
