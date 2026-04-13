import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

const GLASS_BORDER_DARK = 'rgba(255, 255, 255, 0.1)';
const GLASS_BORDER_LIGHT = 'rgba(0, 0, 0, 0.05)';

/** Theme-aware glass border (light rim in dark mode, soft edge in light mode). */
export function useGlassBorder(): { card: ViewStyle; input: TextStyle } {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return useMemo(() => {
    const borderColor = isDark ? GLASS_BORDER_DARK : GLASS_BORDER_LIGHT;
    const base = { borderWidth: 1 as const, borderColor };
    return { card: base, input: base };
  }, [isDark]);
}
