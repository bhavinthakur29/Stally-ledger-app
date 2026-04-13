import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
  type Firestore,
} from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

import type { FirebaseConfigShape } from '@/types';

/**
 * Single source for Firebase client config (from Expo extra, injected via app.config.js / EAS env).
 * Do not put API keys in UI components — reference this module only.
 */
function readFirebaseConfig(): FirebaseConfigShape {
  const extra = Constants.expoConfig?.extra as { firebase?: FirebaseConfigShape } | undefined;
  const fromExtra = extra?.firebase;
  if (
    fromExtra?.apiKey &&
    fromExtra.authDomain &&
    fromExtra.projectId &&
    fromExtra.storageBucket &&
    fromExtra.messagingSenderId &&
    fromExtra.appId
  ) {
    return fromExtra;
  }

  return {
    apiKey: process.env.EXPO_PUBLIC_FB_API_KEY ?? '',
    authDomain: process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN ?? '',
    projectId: process.env.EXPO_PUBLIC_FB_PROJECT_ID ?? '',
    storageBucket: process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET ?? '',
    messagingSenderId: process.env.EXPO_PUBLIC_FB_MESSAGING_SENDER_ID ?? '',
    appId: process.env.EXPO_PUBLIC_FB_APP_ID ?? '',
  };
}

const firebaseConfig = readFirebaseConfig();

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.storageBucket &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId
  );
}

let appInstance: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;
let storageInstance: FirebaseStorage | undefined;

function ensureApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Set EXPO_PUBLIC_FB_* in .env (local) or EAS secrets (production); see .env.example.'
    );
  }
  if (!appInstance) {
    appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return appInstance as FirebaseApp;
}

export function getFirebaseApp(): FirebaseApp {
  return ensureApp();
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    const app = ensureApp();
    try {
      authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      authInstance = getAuth(app);
    }
  }
  return authInstance as Auth;
}

export function getFirestoreDb(): Firestore {
  if (!dbInstance) {
    const app = ensureApp();
    try {
      dbInstance = initializeFirestore(app, {
        localCache: memoryLocalCache({}),
      });
    } catch {
      dbInstance = getFirestore(app);
    }
  }
  return dbInstance as Firestore;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storageInstance) {
    storageInstance = getStorage(ensureApp());
  }
  return storageInstance as FirebaseStorage;
}
