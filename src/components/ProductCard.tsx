import { CheckCircle2, ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { CurrencyText } from '@/components/CurrencyText';
import { useTekTallyIconColors } from '@/hooks/useTekTallyIconColors';
import { useGlassBorder } from '@/lib/glass-styles';
import type { ProductDoc } from '@/types';

type Props = {
  product: ProductDoc;
  onPress: () => void;
  /** Completed balance — softer card + checkmark. */
  settled?: boolean;
};

export function ProductCard({ product, onPress, settled = false }: Props) {
  const icons = useTekTallyIconColors();
  const glass = useGlassBorder();

  return (
    <Pressable
      onPress={onPress}
      style={glass.card}
      className={`mb-3 flex-row items-center justify-between rounded-[24px] bg-transparent px-5 py-4 active:opacity-90 dark:bg-transparent ${settled ? 'opacity-75' : ''}`}
    >
      <View className="flex-1 pr-3">
        <Text
          className="text-lg font-semibold text-ledger-ink dark:text-neutral-100"
          numberOfLines={1}
        >
          {product.name}
        </Text>
        <Text className="mt-1 text-sm text-ledger-muted dark:text-neutral-500">
          {settled ? 'Settled' : 'Outstanding'}
        </Text>
        <CurrencyText
          rupees={product.remainingBalance}
          className={`mt-0.5 text-xl font-bold ${settled ? 'text-stone-500 dark:text-neutral-500' : 'text-amber-700 dark:text-emerald-400'}`}
        />
      </View>
      <View className="flex-row items-center gap-1.5">
        {settled ? (
          <CheckCircle2 color={icons.accent} size={22} opacity={0.85} />
        ) : null}
        <ChevronRight color={icons.chevron} size={22} />
      </View>
    </Pressable>
  );
}
