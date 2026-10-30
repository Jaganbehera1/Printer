import { MAX_PAGE_NUMBER } from '@/utils/constants';

export type PageSelectionResult = { ok: true; value: string } | { ok: false; error: string };

export function resolvePageSelection(pageMode: 'ALL' | 'CUSTOM', pageRange: string): PageSelectionResult {
  if (pageMode === 'ALL') return { ok: true, value: 'ALL' };

  const cleaned = pageRange.replace(/\s+/g, '');
  if (!cleaned) {
    return { ok: false, error: 'Enter the pages to print, for example 1-5 or 2,4,6.' };
  }
  if (!/^\d+(-\d+)?(,\d+(-\d+)?)*$/.test(cleaned)) {
    return { ok: false, error: 'Use only numbers, dashes and commas, for example 1-5, 7, 9-10.' };
  }

  for (const part of cleaned.split(',')) {
    const [startText, endText] = part.split('-');
    const start = Number(startText);
    const end = endText === undefined ? start : Number(endText);
    if (start < 1 || end < 1) {
      return { ok: false, error: 'Page numbers must start at 1.' };
    }
    if (start > end) {
      return { ok: false, error: `The range ${part} goes backwards. Write the smaller number first.` };
    }
    if (end > MAX_PAGE_NUMBER) {
      return { ok: false, error: `Page numbers cannot be higher than ${MAX_PAGE_NUMBER}.` };
    }
  }

  return { ok: true, value: cleaned };
}
