import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useColorScheme } from 'nativewind';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { useAuthContext } from '@/context/auth-context';
import { useGlassBorder } from '@/lib/glass-styles';
import { getTimeOfDayGreeting } from '@/lib/greeting';
import { getUserGreetingName } from '@/lib/user-display-name';

const BLUR_INTENSITY_DARK = 58;
const BLUR_INTENSITY_LIGHT = 88;

export function ProfileHeader() {
  const { user } = useAuthContext();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme !== 'light';

  const greeting = getTimeOfDayGreeting();
  const name = getUserGreetingName(user);

  const iconColor = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(28,25,23,0.75)';
  const glass = useGlassBorder();

  return (
    <View className="mb-4 overflow-hidden rounded-[24px]" style={[styles.card, glass.card]}>
      {Platform.OS === 'web' ? (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark ? 'rgba(23,23,23,0.55)' : 'rgba(255,253,245,0.78)',
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
      <View className="relative z-10 flex-row items-center gap-4 px-5 py-4">
        <View
          className="h-14 w-14 items-center justify-center rounded-full bg-white/10"
          style={glass.card}
        >
          <Ionicons name="person" size={30} color={iconColor} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-lg font-semibold text-ledger-ink dark:text-neutral-100">
            {greeting}
          </Text>
          <Text
            className="mt-0.5 text-base text-ledger-muted dark:text-neutral-400"
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
  },
});
