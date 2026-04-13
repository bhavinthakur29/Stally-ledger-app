import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { getFirestoreDb } from '@/config/firebase';
import { deleteField, doc, setDoc } from 'firebase/firestore';

const ANDROID_DEFAULT_CHANNEL_ID = 'default';

/** Ensures background notifications use a high-importance channel (system tray / heads-up). */
export async function ensureAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_DEFAULT_CHANNEL_ID, {
    name: 'Default',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#D97706',
  });
}

/**
 * Foreground: suppress system banner (RootLayout listener shows an Alert instead).
 * Background: OS presents the notification in the tray using the Android channel.
 */
export function configureNotificationPresentation(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: false,
      shouldShowList: false,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Requests permission (if needed), resolves Expo push token, returns null if unavailable.
 * Physical device required; not supported on web.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  if (!Device.isDevice) return null;

  await ensureAndroidNotificationChannel();

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;

  console.log('Fetching token for ID:', projectId);

  try {
    const pushToken = await Notifications.getExpoPushTokenAsync({ projectId });
    return pushToken.data;
  } catch {
    return null;
  }
}

export async function saveUserPushToken(userId: string, token: string): Promise<void> {
  const db = getFirestoreDb();
  await setDoc(
    doc(db, 'users', userId),
    { pushToken: token },
    { merge: true }
  );
}

export async function clearUserPushToken(userId: string): Promise<void> {
  const db = getFirestoreDb();
  await setDoc(
    doc(db, 'users', userId),
    { pushToken: deleteField() },
    { merge: true }
  );
}
