import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const DARK_GRADIENT = ['#020617', '#0c1a2e', '#022c22', '#020617'] as const;
const LIGHT_GRADIENT = ['#f0f9ff', '#e0f2fe', '#ecfdf5', '#f0f9ff'] as const;

const B1_DARK = '#064e3b';
const B1_LIGHT = '#d1fae5';
const B2_DARK = '#020617';
const B2_LIGHT = '#f0f9ff';

const TIMING = {
  duration: 1000,
  easing: Easing.inOut(Easing.cubic),
};

/**
 * Full-screen gradients + soft blobs; colors ease over ~1s when theme changes.
 */
export function AppBackground() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme !== 'light';

  const t = useSharedValue(isDark ? 0 : 1);

  useEffect(() => {
    t.value = withTiming(isDark ? 0 : 1, TIMING);
  }, [isDark, t]);

  const darkLayerStyle = useAnimatedStyle(() => ({
    opacity: 1 - t.value,
  }));

  const lightLayerStyle = useAnimatedStyle(() => ({
    opacity: t.value,
  }));

  const blob1Anim = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(t.value, [0, 1], [B1_DARK, B1_LIGHT]),
    opacity: 0.42 + t.value * (0.22 - 0.42),
  }));

  const blob2Anim = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(t.value, [0, 1], [B2_DARK, B2_LIGHT]),
    opacity: 0.55 + t.value * (0.12 - 0.55),
  }));

  const blob3Anim = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(t.value, [0, 1], [B1_DARK, B1_LIGHT]),
    opacity: 0.22 + t.value * (0.1 - 0.22),
  }));

  return (
    <View style={styles.root} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, darkLayerStyle]} pointerEvents="none">
        <LinearGradient
          colors={[...DARK_GRADIENT]}
          locations={[0, 0.35, 0.65, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, lightLayerStyle]} pointerEvents="none">
        <LinearGradient
          colors={[...LIGHT_GRADIENT]}
          locations={[0, 0.35, 0.65, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.blob,
          {
            top: isDark ? '-12%' : '-8%',
            left: isDark ? '-18%' : '-12%',
          },
          blob1Anim,
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          {
            bottom: isDark ? '-6%' : '-4%',
            right: isDark ? '-22%' : '-16%',
          },
          blob2Anim,
        ]}
      />
      <Animated.View
        style={[
          styles.blobSmall,
          {
            top: isDark ? '38%' : '42%',
            right: isDark ? '-10%' : '-6%',
          },
          blob3Anim,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  blob: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
  },
  blobSmall: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
});
