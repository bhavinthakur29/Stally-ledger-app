import { useState } from 'react';
import { Platform, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useAuthContext } from '@/context/auth-context';
import { hapticLight } from '@/lib/haptics';
import { registerForPushNotificationsAsync } from '@/lib/push-notifications';
import { sendTestPushHelloFromStally } from '@/lib/test-push';

export default function SettingsScreen() {
  const { configured } = useAuthContext();
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleTestNotification() {
    void hapticLight();
    setStatus(null);
    if (Platform.OS === 'web') {
      setStatus('Push notifications are not available on web.');
      return;
    }
    if (!configured) {
      setStatus('Configure Firebase before using the app.');
      return;
    }
    setSending(true);
    try {
      const token = await registerForPushNotificationsAsync();
      if (!token) {
        setStatus(
          'No Expo push token. Use a physical device, grant notification permission, and set extra.eas.projectId (or EXPO_PUBLIC_EAS_PROJECT_ID) for dev builds.'
        );
        return;
      }
      await sendTestPushHelloFromStally(token);
      setStatus('Sent. You should see “Hello from Stally!” shortly.');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Could not send test notification.');
    } finally {
      setSending(false);
    }
  }

  return (
    <Screen>
      <View className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-ledger-ink dark:text-neutral-100">Settings</Text>
        <Text className="mt-1 text-sm text-ledger-muted dark:text-neutral-500">
          Notifications and device checks
        </Text>

        <View className="mt-8 rounded-[24px] border border-ledger-border bg-parchment/80 p-5 dark:border-neutral-800 dark:bg-neutral-900/60">
          <Text className="text-base font-semibold text-ledger-ink dark:text-neutral-100">
            Push notifications
          </Text>
          <Text className="mt-2 text-sm leading-5 text-ledger-muted dark:text-neutral-500">
            After you sign in, Stally saves your Expo push token on your Firestore user document. Use
            the button below to send a test through Expo&apos;s push API.
          </Text>
          <View className="mt-5">
            <PrimaryButton
              title="Test notification"
              onPress={handleTestNotification}
              loading={sending}
              disabled={sending}
            />
          </View>
          {status ? (
            <Text className="mt-4 text-sm leading-5 text-ledger-ink dark:text-neutral-300">
              {status}
            </Text>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}
