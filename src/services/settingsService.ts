import { onValue, ref, update } from 'firebase/database';
import { getDb } from '@/firebase/client';
import type { PrintSettings } from '@/types/printSettings';
import { BRAND_NAME, DEFAULT_SETTINGS } from '@/utils/constants';

const settingsRef = () => ref(getDb(), 'settings');
const LEGACY_SCHOOL_NAME = 'Your School Name';

function mergeSettings(value: unknown): PrintSettings {
  if (!value || typeof value !== 'object') return DEFAULT_SETTINGS;
  const settings = { ...DEFAULT_SETTINGS, ...(value as Partial<PrintSettings>) };
  if (typeof settings.schoolName === 'string' && settings.schoolName.trim() === LEGACY_SCHOOL_NAME) {
    settings.schoolName = BRAND_NAME;
  }
  return settings;
}

export function subscribeToSettings(
  onData: (settings: PrintSettings) => void,
  onError: (error: unknown) => void
): () => void {
  return onValue(settingsRef(), (snapshot) => onData(mergeSettings(snapshot.val())), onError);
}

export function saveSettings(changes: PrintSettings): Promise<void> {
  return update(settingsRef(), changes);
}
