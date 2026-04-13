import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image as ImageIcon, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { CurrencyText } from '@/components/CurrencyText';
import { ReceiptPreviewModal } from '@/components/ReceiptPreviewModal';
import { Screen } from '@/components/Screen';
import { useAuthContext } from '@/context/auth-context';
import { useProducts } from '@/hooks/useProducts';
import { useProductTransactions } from '@/hooks/useProductTransactions';
import { useStallyIconColors } from '@/hooks/useStallyIconColors';
import { glassCardBorder } from '@/lib/glass-styles';
import { hapticLight } from '@/lib/haptics';
import type { TransactionDoc } from '@/types';

function formatWhen(tx: TransactionDoc): string {
  const t = tx.createdAt;
  if (!t || typeof t.toDate !== 'function') return '—';
  try {
    return t.toDate().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = typeof id === 'string' ? id : '';
  const router = useRouter();
  const icons = useStallyIconColors();
  const { user } = useAuthContext();
  const { products } = useProducts(user?.uid);
  const { transactions, loading, error } = useProductTransactions(user?.uid, productId);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const product = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId]
  );

  return (
    <Screen>
      <View className="flex-1 px-4 pt-2">
        <View
          className="rounded-[24px] bg-parchment/90 px-5 py-4 dark:bg-neutral-900/80"
          style={glassCardBorder}
        >
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <Text
                className="text-xl font-bold text-ledger-ink dark:text-neutral-100"
                numberOfLines={2}
              >
                {product?.name ?? 'Product'}
              </Text>
              <Text className="mt-1 text-sm text-ledger-muted dark:text-neutral-500">Still owed</Text>
              <CurrencyText
                rupees={product?.remainingBalance ?? 0}
                className="mt-0.5 text-2xl font-bold text-amber-800 dark:text-emerald-400"
              />
            </View>
            <Pressable
              className="flex-row items-center gap-1 rounded-full bg-amber-600 px-3 py-2 active:bg-amber-700 dark:bg-emerald-500 dark:active:bg-emerald-600"
              onPress={() => {
                void hapticLight();
                router.push({ pathname: '/transaction', params: { productId } });
              }}
            >
              <Plus color={icons.onPrimaryButton} size={18} strokeWidth={2.5} />
              <Text className="font-semibold text-[#FFFDF5] dark:text-neutral-950">Pay</Text>
            </Pressable>
          </View>
        </View>

        <Text className="mb-2 mt-6 text-lg font-semibold text-ledger-ink dark:text-neutral-200">
          Payments
        </Text>

        {error ? (
          <Text className="mb-2 text-sm text-red-600 dark:text-red-400">{error}</Text>
        ) : null}

        <FlashList
          className="flex-1"
          data={transactions}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            loading ? (
              <Text className="py-6 text-ledger-muted dark:text-neutral-500">Loading…</Text>
            ) : (
              <Text className="py-6 text-ledger-muted dark:text-neutral-500">
                No payments recorded yet.
              </Text>
            )
          }
          renderItem={({ item }) => (
            <View
              className="mb-2 flex-row items-center rounded-[24px] bg-parchment/70 px-4 py-3 dark:bg-neutral-900/60"
              style={glassCardBorder}
            >
              <View className="min-w-0 flex-1">
                <CurrencyText
                  rupees={item.amount}
                  variant="regular"
                  className="text-base text-amber-800 dark:text-emerald-400"
                />
                <Text className="text-xs text-ledger-muted dark:text-neutral-500">{formatWhen(item)}</Text>
                {item.note ? (
                  <Text
                    className="mt-1 text-sm text-stone-600 dark:text-neutral-400"
                    numberOfLines={2}
                  >
                    {item.note}
                  </Text>
                ) : null}
              </View>
              {item.receiptUrl ? (
                <Pressable
                  className="ml-2 rounded-full bg-stone-200 p-2.5 active:bg-stone-300 dark:bg-neutral-800 dark:active:bg-neutral-700"
                  onPress={() => {
                    void hapticLight();
                    setPreviewUri(item.receiptUrl);
                  }}
                  hitSlop={8}
                >
                  <ImageIcon color={icons.accent} size={22} />
                </Pressable>
              ) : null}
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <ReceiptPreviewModal
        visible={previewUri !== null}
        imageUri={previewUri}
        onClose={() => setPreviewUri(null)}
      />
    </Screen>
  );
}
