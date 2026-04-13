import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

const STORAGE_KEY = 'stally.theme';

type ThemePreferenceContextValue = {
  colorScheme: 'light' | 'dark';
  isDark: boolean;
  /** `true` when the UI is in dark mode (switch on). */
  darkModeEnabled: boolean;
  setDarkModeEnabled: (enabled: boolean) => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();

  useLayoutEffect(() => {
    setColorScheme('dark');
  }, [setColorScheme]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        setColorScheme(stored === 'light' ? 'light' : 'dark');
      } catch {
        if (!cancelled) setColorScheme('dark');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setColorScheme]);

  const setDarkModeEnabled = useCallback(
    (enabled: boolean) => {
      const next = enabled ? 'dark' : 'light';
      setColorScheme(next);
      void AsyncStorage.setItem(STORAGE_KEY, next);
    },
    [setColorScheme]
  );

  const value = useMemo<ThemePreferenceContextValue>(() => {
    const scheme = colorScheme === 'light' ? 'light' : 'dark';
    return {
      colorScheme: scheme,
      isDark: scheme === 'dark',
      darkModeEnabled: scheme === 'dark',
      setDarkModeEnabled,
    };
  }, [colorScheme, setDarkModeEnabled]);

  return (
    <ThemePreferenceContext.Provider value={value}>{children}</ThemePreferenceContext.Provider>
  );
}

export function useThemePreference() {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error('useThemePreference must be used within ThemePreferenceProvider');
  }
  return ctx;
}
