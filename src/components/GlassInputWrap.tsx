import { BlurView } from 'expo-blur';
import { type ReactNode } from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';

import { useGlassBorder } from '@/lib/glass-styles';

const R = 16;

type Props = {
  children: ReactNode;
};

/** Frosted shell for a single control (e.g. login fields). */
export function GlassInputWrap({ children }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const glass = useGlassBorder();
  const glassTint = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.42)';

  const blurAndroid =
    Platform.OS === 'android'
      ? ({
          experimentalBlurMethod: 'dimezisBlurView' as const,
          blurReductionFactor: 4,
        } as const)
      : {};

  return (
    <View
      style={{
        alignSelf: 'stretch',
        borderRadius: R,
        overflow: 'hidden',
        backgroundColor: 'transparent',
        ...glass.card,
        ...Platform.select({ android: { elevation: 3 }, default: {} }),
      }}
    >
      <BlurView
        intensity={Platform.OS === 'web' ? 48 : isDark ? 44 : 54}
        tint={isDark ? 'dark' : 'light'}
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { borderRadius: R }]}
        {...blurAndroid}
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { borderRadius: R, backgroundColor: glassTint }]}
      />
      <View style={{ zIndex: 10, backgroundColor: 'transparent' }}>{children}</View>
    </View>
  );
}
