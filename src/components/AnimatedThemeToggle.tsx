import { Moon, Sun } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useStallyIconColors } from '@/hooks/useStallyIconColors';

const TRACK_W = 58;
const TRACK_H = 32;
const THUMB = 26;
const PAD = 3;
const TRAVEL = TRACK_W - THUMB - PAD * 2;

const SPRING = {
  damping: 14,
  stiffness: 160,
  mass: 0.65,
};

type Props = {
  /** `true` = dark mode (moon, thumb right). */
  value: boolean;
  onValueChange: (dark: boolean) => void;
};

export function AnimatedThemeToggle({ value, onValueChange }: Props) {
  const { accent } = useStallyIconColors();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, SPRING);
  }, [value, progress]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: PAD + progress.value * TRAVEL }],
  }));

  const moonIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.88 + progress.value * 0.12 }],
  }));

  const sunIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ scale: 0.88 + (1 - progress.value) * 0.12 }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel="Dark mode"
      hitSlop={8}
      onPress={() => onValueChange(!value)}
    >
      <View
        className="justify-center overflow-hidden rounded-full bg-black/10 dark:bg-white/15"
        style={{ width: TRACK_W, height: TRACK_H }}
      >
        <Animated.View
          className="absolute items-center justify-center rounded-full bg-white shadow-sm dark:bg-neutral-800"
          style={[
            {
              width: THUMB,
              height: THUMB,
              left: 0,
              top: (TRACK_H - THUMB) / 2,
            },
            thumbStyle,
          ]}
        >
          <View className="h-full w-full items-center justify-center">
            <Animated.View
              className="absolute items-center justify-center"
              style={moonIconStyle}
            >
              <Moon color={accent} size={15} strokeWidth={2.2} />
            </Animated.View>
            <Animated.View
              className="absolute items-center justify-center"
              style={sunIconStyle}
            >
              <Sun color={accent} size={15} strokeWidth={2.2} />
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
}
