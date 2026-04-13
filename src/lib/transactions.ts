import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { getFirestoreDb, getFirebaseStorage } from '@/lib/firebase';
import { PAYMENT_EXCEEDS_BALANCE_MESSAGE } from '@/lib/payment-errors';
import { compressReceiptForUpload } from '@/lib/receipt-compress';

export type PaymentSavingPhase = 'compressing' | 'uploading' | 'finishing';

export async function addPaymentTransaction(params: {
  userId: string;
  productId: string;
  amountRupees: number;
  note?: string;
  localImageUri?: string | null;
  /** Fired as each major step begins (for UI + haptics). */
  onPhase?: (phase: PaymentSavingPhase) => void;
}): Promise<{ transactionId: string }> {
  const { userId, productId, amountRupees, note, localImageUri, onPhase } = params;
  if (!Number.isInteger(amountRupees) || amountRupees <= 0) {
    throw new Error('Amount must be a positive whole number of rupees.');
  }

  let uploadUri: string | null = localImageUri ?? null;
  if (localImageUri) {
    onPhase?.('compressing');
    uploadUri = await compressReceiptForUpload(localImageUri);
  }

  const db = getFirestoreDb();
  const productRef = doc(db, 'users', userId, 'products', productId);
  const txColRef = collection(db, 'users', userId, 'products', productId, 'transactions');
  const txRef = doc(txColRef);

  onPhase?.('finishing');
  await runTransaction(db, async (transaction) => {
    const prodSnap = await transaction.get(productRef);
    if (!prodSnap.exists()) {
      throw new Error('Product not found.');
    }
    const data = prodSnap.data() as { remainingBalance?: number };
    const current = typeof data.remainingBalance === 'number' ? data.remainingBalance : 0;
    if (amountRupees > current) {
      throw new Error(PAYMENT_EXCEEDS_BALANCE_MESSAGE);
    }
    const next = current - amountRupees;
    transaction.update(productRef, { remainingBalance: next });
    transaction.set(txRef, {
      amount: amountRupees,
      note: note?.trim() ? note.trim() : null,
      receiptUrl: null,
      createdAt: serverTimestamp(),
    });
  });

  if (uploadUri) {
    onPhase?.('uploading');
    const storage = getFirebaseStorage();
    const objectRef = ref(storage, `users/${userId}/receipts/${txRef.id}.jpg`);
    const response = await fetch(uploadUri);
    const blob = await response.blob();
    await uploadBytes(objectRef, blob, { contentType: 'image/jpeg' });
    const url = await getDownloadURL(objectRef);
    await updateDoc(txRef, { receiptUrl: url });
  }

  return { transactionId: txRef.id };
}
