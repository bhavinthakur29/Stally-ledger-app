import { Text } from 'react-native';

import { formatInrRupees } from '@/lib/currency';

type Props = {
  rupees: number;
  className?: string;
};

export function CurrencyText({ rupees, className }: Props) {
  return <Text className={className}>{formatInrRupees(rupees)}</Text>;
}
