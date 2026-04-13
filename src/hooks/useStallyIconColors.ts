import { useMemo } from 'react';
import { useColorScheme } from 'nativewind';

export function useStallyIconColors() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme !== 'light';
  return useMemo(() => {
    return {
      isDark,
      muted: isDark ? '#a3a3a3' : '#78716c',
      chevron: isDark ? '#737373' : '#a8a29e',
      accent: isDark ? '#34d399' : '#d97706',
      onPrimaryButton: '#0a0a0a',
    };
  }, [isDark]);
}
