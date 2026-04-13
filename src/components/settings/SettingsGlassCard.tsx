import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { useColorScheme } from 'nativewind';
import { Platform, StyleSheet, View } from 'react-native';

import { useGlassBorder } from '@/lib/glass-styles';

const BLUR_INTENSITY_LIGHT = 88;
const BLUR_INTENSITY_DARK = 58;

type Props = {
  children: ReactNode;
  className?: string;
};

export function SettingsGlassCard({ children, className = '' }: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme !== 'light';
  const glass = useGlassBorder();

  return (
    <View
      className={`mb-4 overflow-hidden rounded-[24px] ${className}`}
      style={[styles.card, glass.card]}
    >
      {Platform.OS === 'web' ? (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark ? 'rgba(23,23,23,0.58)' : 'rgba(255,255,255,0.72)',
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
      <View className="relative z-10">{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
  },
});
