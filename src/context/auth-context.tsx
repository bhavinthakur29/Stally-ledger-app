import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, [configured]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configured,
      signIn: async (email, password) => {
        const auth = getFirebaseAuth();
        await signInWithEmailAndPassword(auth, email.trim(), password);
      },
      signUp: async (email, password) => {
        const auth = getFirebaseAuth();
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      },
      logOut: async () => {
        const auth = getFirebaseAuth();
        await signOut(auth);
      },
    }),
    [user, loading, configured]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
