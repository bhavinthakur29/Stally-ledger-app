import type { Timestamp } from 'firebase/firestore';

export interface FirebaseConfigShape {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface ProductDoc {
  id: string;
  name: string;
  /** Whole rupees still owed (integer). */
  remainingBalance: number;
  createdAt: Timestamp | null;
}

export interface TransactionDoc {
  id: string;
  /** Payment amount in whole rupees (reduces product.remainingBalance). */
  amount: number;
  note: string | null;
  /** HTTPS download URL from Firebase Storage, if a receipt was uploaded. */
  receiptUrl: string | null;
  createdAt: Timestamp | null;
}
