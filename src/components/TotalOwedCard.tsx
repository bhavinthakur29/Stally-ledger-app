import { BlurView } from 'expo-blur';
import { useColorScheme } from 'nativewind';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { CurrencyText } from '@/components/CurrencyText';
import { useGlassBorder } from '@/lib/glass-styles';

const NEON_SHADOW_DARK = '#34d399';
const NEON_SHADOW_LIGHT = '#d97706';

type Props = {
  totalRupees: number;
};

export function TotalOwedCard({ totalRupees }: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme !== 'light';

  const shadowColor = isDark ? NEON_SHADOW_DARK : NEON_SHADOW_LIGHT;
  const glass = useGlassBorder();

  return (
    <View
      className="mt-4 overflow-hidden rounded-[24px]"
      style={[
        styles.card,
        glass.card,
        {
          shadowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.42 : 0.35,
          shadowRadius: 18,
          elevation: 14,
        },
      ]}
    >
      {Platform.OS === 'web' ? (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark ? 'rgba(6,78,59,0.35)' : 'rgba(254,243,199,0.55)',
            },
          ]}
        />
      ) : (
        <BlurView
          intensity={40}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}
      <View className="relative z-10 px-5 py-4">
        <Text className="text-sm font-medium uppercase tracking-wide text-amber-800/90 dark:text-emerald-400/95">
          Total owed
        </Text>
        <CurrencyText
          rupees={totalRupees}
          className="mt-1 text-3xl font-bold text-amber-800 dark:text-emerald-400"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
  },
});
