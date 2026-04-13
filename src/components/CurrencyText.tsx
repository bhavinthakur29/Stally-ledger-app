import { isLoaded } from 'expo-font';
import { Platform, Text, type StyleProp, type TextStyle } from 'react-native';

import { formatInrRupees } from '@/lib/currency';
import {
  CURRENCY_FONT_BOLD,
  CURRENCY_FONT_MONOSPACE_FALLBACK,
  CURRENCY_FONT_REGULAR,
} from '@/lib/currency-font';

type Props = {
  rupees: number;
  className?: string;
  /** `bold` (700) for totals and cards; `regular` (400) for compact rows. */
  variant?: 'regular' | 'bold';
  style?: StyleProp<TextStyle>;
};

const TABULAR: TextStyle = {
  fontVariant: ['tabular-nums'],
};

export function CurrencyText({ rupees, className, variant = 'bold', style }: Props) {
  const preferred = variant === 'regular' ? CURRENCY_FONT_REGULAR : CURRENCY_FONT_BOLD;
  const customReady = isLoaded(preferred);
  const fontFamily = customReady ? preferred : CURRENCY_FONT_MONOSPACE_FALLBACK;

  const weightStyle: TextStyle = customReady
    ? {}
    : { fontWeight: variant === 'bold' ? '700' : '400' };

  return (
    <Text
      className={className}
      style={[
        TABULAR,
        {
          fontFamily,
          backgroundColor: 'transparent',
          letterSpacing: 0,
          ...weightStyle,
        },
        Platform.OS === 'android' ? { includeFontPadding: false } : null,
        style,
      ]}
    >
      {formatInrRupees(rupees)}
    </Text>
  );
}
