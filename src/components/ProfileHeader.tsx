import { BlurView } from 'expo-blur';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { useAuthContext } from '@/context/auth-context';
import { useGlassBorder } from '@/lib/glass-styles';
import { getTimeGreeting } from '@/lib/greeting';
import { getUserGreetingName } from '@/lib/user-display-name';

const BLUR_INTENSITY_DARK = 58;
const BLUR_INTENSITY_LIGHT = 88;

const GREETING_TICK_MS = 60_000;

export function ProfileHeader() {
  const { user } = useAuthContext();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [{ greeting, emoji }, setTimeGreeting] = useState(() => getTimeGreeting());

  useEffect(() => {
    function tick() {
      setTimeGreeting(getTimeGreeting());
    }
    const id = setInterval(tick, GREETING_TICK_MS);
    return () => clearInterval(id);
  }, []);

  /** First name / local-part; reflects `user.displayName` as soon as Auth reloads after Settings save. */
  const name = getUserGreetingName(user);
  const headline =
    user && name !== 'there' ? `${greeting}, ${name}` : greeting;
  const glass = useGlassBorder();

  return (
    <View
      className="mb-4 overflow-hidden rounded-[24px]"
      style={[styles.card, glass.card, { backgroundColor: 'transparent' }]}
    >
      {Platform.OS === 'web' ? (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            },
          ]}
        />
      ) : (
        <BlurView
          intensity={isDark ? BLUR_INTENSITY_DARK : BLUR_INTENSITY_LIGHT}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}
      {Platform.OS !== 'web' ? (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.04)',
            },
          ]}
        />
      ) : null}
      <View className="relative z-10 flex-row items-center gap-4 px-5 py-4">
        <View
          className="h-14 w-14 items-center justify-center rounded-full bg-white/10"
          style={glass.card}
        >
          <Text style={styles.avatarEmoji} allowFontScaling={false}>
            {emoji}
          </Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text
            className="text-lg font-semibold text-ledger-ink dark:text-neutral-100"
            numberOfLines={2}
          >
            {headline}
          </Text>
          {user?.email ? (
            <Text
              className="mt-1 text-sm text-ledger-muted dark:text-neutral-500"
              numberOfLines={1}
            >
              {user.email}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 30,
    lineHeight: 36,
    textAlign: 'center',
  },
});
