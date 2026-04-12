import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { getFirestoreDb } from '@/lib/firebase';

export async function addProduct(params: {
  userId: string;
  name: string;
  initialOwedRupees: number;
}): Promise<{ productId: string }> {
  const { userId, name, initialOwedRupees } = params;
  if (!name.trim()) throw new Error('Product name is required.');
  if (!Number.isInteger(initialOwedRupees) || initialOwedRupees < 0) {
    throw new Error('Initial balance must be a non-negative whole number of rupees.');
  }

  const db = getFirestoreDb();
  const col = collection(db, 'users', userId, 'products');
  const ref = await addDoc(col, {
    name: name.trim(),
    remainingBalance: initialOwedRupees,
    createdAt: serverTimestamp(),
  });
  return { productId: ref.id };
}
