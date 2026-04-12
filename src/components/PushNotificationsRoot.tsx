import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Alert, Platform } from 'react-native';

import { useAuthContext } from '@/context/auth-context';
import {
  clearUserPushToken,
  configureNotificationPresentation,
  ensureAndroidNotificationChannel,
  registerForPushNotificationsAsync,
  saveUserPushToken,
} from '@/lib/push-notifications';

let presentationConfigured = false;

/**
 * Registers push + Firestore token on login, clears on logout / account switch,
 * wires foreground listener (Alert popup).
 * Render inside AuthProvider.
 */
export function PushNotificationsRoot({ children }: { children: ReactNode }) {
  const { user, configured } = useAuthContext();
  const lastRegisteredUid = useRef<string | null>(null);

  useEffect(() => {
    if (!presentationConfigured) {
      configureNotificationPresentation();
      presentationConfigured = true;
    }
    void ensureAndroidNotificationChannel();
  }, []);

  useEffect(() => {
    if (!configured || Platform.OS === 'web') return;

    const sub = Notifications.addNotificationReceivedListener((notification) => {
      const title = notification.request.content.title ?? 'Stally';
      const body = notification.request.content.body ?? '';
      Alert.alert(title, body || undefined, [{ text: 'OK' }]);
    });

    return () => sub.remove();
  }, [configured]);

  useEffect(() => {
    if (!configured) return;

    if (!user) {
      if (lastRegisteredUid.current) {
        void clearUserPushToken(lastRegisteredUid.current).catch(() => undefined);
        lastRegisteredUid.current = null;
      }
      return;
    }

    const uid = user.uid;
    if (lastRegisteredUid.current && lastRegisteredUid.current !== uid) {
      void clearUserPushToken(lastRegisteredUid.current).catch(() => undefined);
      lastRegisteredUid.current = null;
    }

    let cancelled = false;
    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (cancelled || !token) return;
      try {
        await saveUserPushToken(uid, token);
        lastRegisteredUid.current = uid;
      } catch {
        /* Firestore rules / offline */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [configured, user?.uid]);

  return <>{children}</>;
}
