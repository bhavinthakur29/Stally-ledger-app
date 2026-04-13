import { Platform } from 'react-native';

/**
 * Loaded in root `_layout` via `@expo-google-fonts/space-mono` (`useSpaceMonoFonts`).
 * These PostScript names match `loadAsync` keys (equivalent to a “Space Mono Regular/Bold” family).
 */
export const CURRENCY_FONT_REGULAR = 'SpaceMono_400Regular';
export const CURRENCY_FONT_BOLD = 'SpaceMono_700Bold';

/** If custom fonts are unavailable, prefer system monospace + tabular nums (see `CurrencyText`). */
export const CURRENCY_FONT_MONOSPACE_FALLBACK = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
}) as string;
