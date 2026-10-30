import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { getAuthClient, getDb } from '@/firebase/client';
import type { AdminUser } from '@/types/adminUser';

export function subscribeToAuth(onChange: (user: User | null) => void): () => void {
  return onAuthStateChanged(getAuthClient(), onChange);
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(getAuthClient(), email, password);
}

export function signOutAdmin(): Promise<void> {
  return signOut(getAuthClient());
}

export async function getAdminUser(uid: string): Promise<AdminUser | null> {
  const snapshot = await get(ref(getDb(), `adminUsers/${uid}`));
  if (!snapshot.exists()) return null;
  const value = snapshot.val() as Partial<AdminUser>;
  if (value.role !== 'admin') return null;
  return { uid, email: value.email ?? '', role: 'admin' };
}
