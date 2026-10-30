import type { DuplexMode, PrintMode } from '@/types/printJob';

export const PRINT_MODE_LABELS: Record<PrintMode, string> = {
  BLACK_WHITE: 'Black & White',
  COLOUR: 'Colour',
};

export const DUPLEX_LABELS: Record<DuplexMode, string> = {
  SINGLE: 'Single-sided',
  DOUBLE: 'Double-sided',
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDateTime(timestamp?: number | null): string {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatPageSelection(pageSelection: string): string {
  return pageSelection === 'ALL' ? 'All pages' : `Pages ${pageSelection}`;
}
