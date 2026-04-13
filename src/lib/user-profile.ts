import { reload, updateProfile } from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

import { getFirebaseAuth, getFirestoreDb } from '@/config/firebase';

/**
 * Updates Firebase Auth `displayName` and mirrors to `users/{uid}` in Firestore.
 * Uses `updateDoc` when the document exists; otherwise `setDoc` with merge.
 */
export async function saveUserDisplayName(uid: string, displayName: string): Promise<void> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user || user.uid !== uid) {
    throw new Error('Not signed in.');
  }

  await updateProfile(user, { displayName });

  try {
    await reload(user);
  } catch {
    /* offline or transient; updateProfile may still have updated in-memory user */
  }

  const db = getFirestoreDb();
  const ref = doc(db, 'users', uid);
  try {
    await updateDoc(ref, { displayName });
  } catch {
    await setDoc(ref, { displayName }, { merge: true });
  }
}
