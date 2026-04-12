import {
  collection,
  onSnapshot,
  orderBy,
  query,
  type QuerySnapshot,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';

import { getFirestoreDb } from '@/lib/firebase';
import type { ProductDoc } from '@/types';

function mapProducts(snap: QuerySnapshot): ProductDoc[] {
  return snap.docs.map((d) => {
    const data = d.data() as {
      name?: string;
      remainingBalance?: number;
      createdAt?: ProductDoc['createdAt'];
    };
    return {
      id: d.id,
      name: typeof data.name === 'string' ? data.name : 'Untitled',
      remainingBalance:
        typeof data.remainingBalance === 'number' ? data.remainingBalance : 0,
      createdAt: data.createdAt ?? null,
    };
  });
}

export function useProducts(userId: string | undefined) {
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setProducts([]);
      setLoading(false);
      return;
    }
    const db = getFirestoreDb();
    const q = query(
      collection(db, 'users', userId, 'products'),
      orderBy('createdAt', 'desc')
    );
    setLoading(true);
    const unsub = onSnapshot(
      q,
      (snap) => {
        setProducts(mapProducts(snap));
        setError(null);
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [userId]);

  const totalOwed = products.reduce((sum, p) => sum + p.remainingBalance, 0);

  const activeProducts = useMemo(
    () => products.filter((p) => p.remainingBalance > 0),
    [products]
  );
  const settledProducts = useMemo(
    () => products.filter((p) => p.remainingBalance === 0),
    [products]
  );

  return { products, activeProducts, settledProducts, totalOwed, loading, error };
}
