import {
  collection,
  onSnapshot,
  orderBy,
  query,
  type QuerySnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { getFirestoreDb } from '@/lib/firebase';
import type { TransactionDoc } from '@/types';

function mapTx(snap: QuerySnapshot): TransactionDoc[] {
  return snap.docs.map((d) => {
    const data = d.data() as {
      amount?: number;
      note?: string | null;
      receiptUrl?: string | null;
      createdAt?: TransactionDoc['createdAt'];
    };
    return {
      id: d.id,
      amount: typeof data.amount === 'number' ? data.amount : 0,
      note: data.note ?? null,
      receiptUrl: data.receiptUrl ?? null,
      createdAt: data.createdAt ?? null,
    };
  });
}

export function useProductTransactions(
  userId: string | undefined,
  productId: string | undefined
) {
  const [transactions, setTransactions] = useState<TransactionDoc[]>([]);
  const [loading, setLoading] = useState(Boolean(userId && productId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !productId) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    const db = getFirestoreDb();
    const q = query(
      collection(db, 'users', userId, 'products', productId, 'transactions'),
      orderBy('createdAt', 'desc')
    );
    setLoading(true);
    const unsub = onSnapshot(
      q,
      (snap) => {
        setTransactions(mapTx(snap));
        setError(null);
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [userId, productId]);

  return { transactions, loading, error };
}
