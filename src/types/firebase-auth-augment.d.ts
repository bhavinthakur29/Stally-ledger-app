import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  /** React Native AsyncStorage-backed persistence (runtime export; types vary by platform bundle). */
  export function getReactNativePersistence(storage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }): Persistence;
}
