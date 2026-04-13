import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, LogOut, Plus, Receipt } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AddProductModal } from '@/components/AddProductModal';
import { ProductCard } from '@/components/ProductCard';
import { ProfileHeader } from '@/components/ProfileHeader';
import { Screen } from '@/components/Screen';
import { TotalOwedCard } from '@/components/TotalOwedCard';
import { useAuthContext } from '@/context/auth-context';
import { useProducts } from '@/hooks/useProducts';
import { useStallyIconColors } from '@/hooks/useStallyIconColors';
import { useGlassBorder } from '@/lib/glass-styles';
import { hapticLight, hapticSuccess } from '@/lib/haptics';
import { addProduct } from '@/lib/products';
import type { ProductDoc } from '@/types';

/** Approximate row height (card + `mb-3`) for nested FlashList sizing. */
const LEDGER_ROW_HEIGHT = 118;
const ACTIVE_EMPTY_MIN_HEIGHT = 200;
const SETTLED_HEADER_HEIGHT = 52;

export default function DashboardScreen() {
  const router = useRouter();
  const icons = useStallyIconColors();
  const glass = useGlassBorder();
  const { user, logOut, configured } = useAuthContext();
  const { products, activeProducts, settledProducts, totalOwed, loading, error } = useProducts(
    user?.uid
  );
  const [addOpen, setAddOpen] = useState(false);
  const [settledOpen, setSettledOpen] = useState(false);

  const activeListHeight = useMemo(() => {
    if (activeProducts.length === 0) return ACTIVE_EMPTY_MIN_HEIGHT;
    return activeProducts.length * LEDGER_ROW_HEIGHT;
  }, [activeProducts.length]);

  const settledListHeight = useMemo(() => {
    if (!settledOpen || settledProducts.length === 0) return 0;
    return settledProducts.length * LEDGER_ROW_HEIGHT;
  }, [settledOpen, settledProducts.length]);

  function openProduct(p: ProductDoc) {
    void hapticLight();
    router.push(`/product/${p.id}`);
  }

  async function handleAddProduct(name: string, initialOwedRupees: number) {
    if (!user) return;
    await addProduct({ userId: user.uid, name, initialOwedRupees });
    await hapticSuccess();
  }

  function toggleSettled() {
    void hapticLight();
    setSettledOpen((v) => !v);
  }

  return (
    <Screen>
      <View className="flex-1 px-4">
        <ProfileHeader />
        <View className="flex-row items-center justify-between pb-2 pt-1">
          <View>
            <Text className="text-2xl font-bold text-ledger-ink dark:text-neutral-100">TekTally</Text>
            <Text className="text-sm text-ledger-muted dark:text-neutral-500">Your financial ledger</Text>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              accessibilityRole="button"
              className="rounded-full bg-stone-200/90 p-2.5 active:bg-stone-300 dark:bg-neutral-800 dark:active:bg-neutral-700"
              onPress={() => {
                void hapticLight();
                router.push('/transaction');
              }}
            >
              <Receipt color={icons.muted} size={22} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="rounded-full bg-stone-200/90 p-2.5 active:bg-stone-300 dark:bg-neutral-800 dark:active:bg-neutral-700"
              onPress={() => {
                void hapticLight();
                void logOut();
              }}
            >
              <LogOut color={icons.muted} size={22} />
            </Pressable>
          </View>
        </View>

        <TotalOwedCard totalRupees={totalOwed} />

        {!configured ? (
          <Text className="mt-4 text-center text-sm text-amber-800 dark:text-amber-400">
            Configure Firebase in app.json to load products.
          </Text>
        ) : null}

        {error ? (
          <Text className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{error}</Text>
        ) : null}

        <View className="mt-5 min-h-0 flex-1">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-xs font-semibold uppercase tracking-widest text-ledger-muted dark:text-neutral-500">
              Active ledger
            </Text>
            <Pressable
              onPress={() => {
                void hapticLight();
                setAddOpen(true);
              }}
              className="flex-row items-center gap-1.5 rounded-full bg-amber-600 px-4 py-2 active:bg-amber-700 dark:bg-emerald-500 dark:active:bg-emerald-600"
            >
              <Plus color={icons.onPrimaryButton} size={20} strokeWidth={2.5} />
              <Text className="font-semibold text-[#FFFDF5] dark:text-neutral-950">Add</Text>
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            <FlashList
              data={activeProducts}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={{ height: activeListHeight }}
              renderItem={({ item }) => (
                <ProductCard product={item} onPress={() => openProduct(item)} />
              )}
              ListEmptyComponent={
                loading ? (
                  <Text className="py-10 text-center text-ledger-muted dark:text-neutral-500">
                    Loading…
                  </Text>
                ) : products.length === 0 ? (
                  <Text className="px-2 py-10 text-center text-base leading-6 text-ledger-muted dark:text-neutral-500">
                    No products yet. Tap Add to create your first ledger entry.
                  </Text>
                ) : (
                  <Text className="px-2 py-10 text-center text-base font-medium leading-6 text-ledger-ink dark:text-neutral-200">
                    All settled! High five! 🙌
                  </Text>
                )
              }
            />

            {settledProducts.length > 0 ? (
              <View className="mt-2 pb-6">
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: settledOpen }}
                  onPress={toggleSettled}
                  className="flex-row items-center justify-between rounded-2xl bg-parchment/60 px-4 py-3.5 active:bg-stone-200/70 dark:bg-neutral-900/50 dark:active:bg-neutral-800"
                  style={[glass.card, { minHeight: SETTLED_HEADER_HEIGHT }]}
                >
                  <View>
                    <Text className="text-sm font-semibold text-ledger-ink dark:text-neutral-100">
                      Settled
                    </Text>
                    <Text className="mt-0.5 text-xs text-ledger-muted dark:text-neutral-500">
                      {settledProducts.length} paid in full
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xs font-medium text-amber-800 dark:text-emerald-500">
                      {settledOpen ? 'Hide' : 'Show'}
                    </Text>
                    {settledOpen ? (
                      <ChevronUp color={icons.muted} size={22} />
                    ) : (
                      <ChevronDown color={icons.muted} size={22} />
                    )}
                  </View>
                </Pressable>

                {settledOpen && settledListHeight > 0 ? (
                  <FlashList
                    data={settledProducts}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    style={{ height: settledListHeight, marginTop: 8 }}
                    renderItem={({ item }) => (
                      <ProductCard
                        settled
                        product={item}
                        onPress={() => openProduct(item)}
                      />
                    )}
                  />
                ) : null}
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>

      <AddProductModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddProduct}
      />
    </Screen>
  );
}
