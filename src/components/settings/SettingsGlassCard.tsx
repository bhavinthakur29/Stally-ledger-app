import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';

import { useGlassBorder } from '@/lib/glass-styles';

const BLUR_INTENSITY_LIGHT = 88;
const BLUR_INTENSITY_DARK = 48;

type Props = {
  children: ReactNode;
  className?: string;
};

export function SettingsGlassCard({ children, className = '' }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const glass = useGlassBorder();

  return (
    <View
      className={`mb-4 overflow-hidden rounded-[24px] ${className}`}
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
      <View className="relative z-10">{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
  },
});
