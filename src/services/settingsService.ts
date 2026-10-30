import { onValue, ref, update } from 'firebase/database';
import { getDb } from '@/firebase/client';
import type { PrintSettings } from '@/types/printSettings';
import { DEFAULT_SETTINGS } from '@/utils/constants';

const settingsRef = () => ref(getDb(), 'settings');

function mergeSettings(value: unknown): PrintSettings {
  if (!value || typeof value !== 'object') return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(value as Partial<PrintSettings>) };
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
