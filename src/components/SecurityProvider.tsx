import { BlurView } from 'expo-blur';
import {
  authenticateAsync,
  getEnrolledLevelAsync,
  SecurityLevel,
} from 'expo-local-authentication';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  type AppStateStatus,
  Platform,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuthContext } from '@/context/auth-context';

/** Milliseconds away from the app before we require unlock again (if you left while unlocked). */
const LOCK_AFTER_INACTIVE_MS = 60_000;

type Props = {
  children: ReactNode;
};

export function SecurityProvider({ children }: Props) {
  const { user } = useAuthContext();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const prevAppStateRef = useRef<AppStateStatus>(AppState.currentState);
  /** Set to `Date.now()` when AppState becomes background (last moment we were active in-app). */
  const lastActiveTimeRef = useRef<number | null>(null);
  /** Snapshot: was the ledger visible (unlocked) right before we went to background/inactive? */
  const wasUnlockedAtBackgroundRef = useRef(false);
  const isLockedRef = useRef(true);
  const [isLocked, setIsLocked] = useState(true);
  const authInFlight = useRef(false);

  isLockedRef.current = isLocked;

  const runAuthenticate = useCallback(async () => {
    if (Platform.OS === 'web' || !user) {
      setIsLocked(false);
      return;
    }
    if (authInFlight.current) return;
    authInFlight.current = true;
    try {
      const level = await getEnrolledLevelAsync();
      if (level === SecurityLevel.NONE) {
        setIsLocked(false);
        return;
      }

      const result = await authenticateAsync({
        promptMessage: 'Unlock TekTally',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use device PIN',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsLocked(false);
      }
    } finally {
      authInFlight.current = false;
    }
  }, [user]);

  useEffect(() => {
    if (!user || Platform.OS === 'web') {
      setIsLocked(false);
      return;
    }
    setIsLocked(true);
    lastActiveTimeRef.current = null;
    void runAuthenticate();
  }, [user?.uid, runAuthenticate]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const prev = prevAppStateRef.current;
      prevAppStateRef.current = next;
      setAppState(next);

      if (Platform.OS === 'web') return;

      if (next === 'background' || next === 'inactive') {
        wasUnlockedAtBackgroundRef.current = !isLockedRef.current;
        lastActiveTimeRef.current = Date.now();
        return;
      }

      if (next === 'active' && (prev === 'background' || prev === 'inactive')) {
        if (!user) return;

        const timeInactive =
          lastActiveTimeRef.current !== null
            ? Date.now() - lastActiveTimeRef.current
            : Number.POSITIVE_INFINITY;
        const hadBeenUnlocked = wasUnlockedAtBackgroundRef.current;

        if (hadBeenUnlocked && timeInactive <= LOCK_AFTER_INACTIVE_MS) {
          setIsLocked(false);
          return;
        }

        setIsLocked(true);

        if (!hadBeenUnlocked || timeInactive > LOCK_AFTER_INACTIVE_MS) {
          void runAuthenticate();
        }
      }
    });
    return () => sub.remove();
  }, [user?.uid, runAuthenticate]);

  const showTaskSwitcherBlur = appState === 'inactive' || appState === 'background';
  const showLockGate =
    Boolean(user) && Platform.OS !== 'web' && appState === 'active' && isLocked;

  const blurTint = isDark ? 'dark' : 'light';

  return (
    <View style={styles.root}>
      <View style={styles.content} pointerEvents={showLockGate ? 'none' : 'auto'}>
        {children}
      </View>

      {showTaskSwitcherBlur ? (
        Platform.OS === 'web' ? (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.webPrivacyOverlay]}
          />
        ) : (
          <BlurView
            intensity={isDark ? 85 : 95}
            tint={blurTint}
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.blurLayer]}
          />
        )
      ) : null}

      {showLockGate ? (
        <View style={[StyleSheet.absoluteFill, styles.lockOverlay]} pointerEvents="box-none">
          <SafeAreaView
            style={[
              styles.lockFill,
              isDark ? styles.lockFillDark : styles.lockFillLight,
            ]}
          >
            <View className="flex-1 items-center justify-center px-8">
              <View
                className={`mb-6 items-center justify-center rounded-[28px] border px-10 py-6 ${isDark
                  ? 'border-emerald-500/35 bg-emerald-500/10'
                  : 'border-amber-600/30 bg-amber-600/10'
                  }`}
              >
                <Text className="text-center text-4xl font-bold tracking-tight text-ledger-ink dark:text-neutral-100">
                  TekTally
                </Text>
                <Text className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/80 dark:text-emerald-400/90">
                  Ledger
                </Text>
              </View>
              <Text className="text-center text-base text-ledger-muted dark:text-neutral-400">
                Unlock to view balances and payments
              </Text>
              <View className="mt-10 w-full max-w-sm">
                <PrimaryButton title="Tap to Unlock" onPress={runAuthenticate} />
              </View>
            </View>
          </SafeAreaView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  blurLayer: {
    zIndex: 900,
  },
  webPrivacyOverlay: {
    backgroundColor: '#0a0a0a',
    opacity: 0.92,
    zIndex: 900,
  },
  lockOverlay: {
    zIndex: 1000,
  },
  lockFill: {
    flex: 1,
  },
  lockFillLight: {
    backgroundColor: '#FFFDF5',
  },
  lockFillDark: {
    backgroundColor: '#0a0a0a',
  },
});
