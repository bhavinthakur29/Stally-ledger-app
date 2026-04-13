import { Text } from 'react-native';

import { formatInrRupees } from '@/lib/currency';
import { CURRENCY_FONT_BOLD, CURRENCY_FONT_REGULAR } from '@/lib/currency-font';

type Props = {
  rupees: number;
  className?: string;
  /** `bold` (700) for totals and cards; `regular` (400) for compact rows. */
  variant?: 'regular' | 'bold';
};

export function CurrencyText({ rupees, className, variant = 'bold' }: Props) {
  const fontFamily = variant === 'regular' ? CURRENCY_FONT_REGULAR : CURRENCY_FONT_BOLD;

  return (
    <Text className={className} style={{ fontFamily }}>
      {formatInrRupees(rupees)}
    </Text>
  );
}
