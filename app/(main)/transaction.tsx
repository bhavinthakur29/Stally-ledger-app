import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronDown, ImagePlus, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { PaymentSavingModal } from '@/components/PaymentSavingModal';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useAuthContext } from '@/context/auth-context';
import { useProducts } from '@/hooks/useProducts';
import { useTekTallyIconColors } from '@/hooks/useTekTallyIconColors';
import { parseRupeesInput } from '@/lib/currency';
import { useGlassBorder } from '@/lib/glass-styles';
import { hapticLight, hapticSuccess } from '@/lib/haptics';
import { PAYMENT_EXCEEDS_BALANCE_MESSAGE } from '@/lib/payment-errors';
import { addPaymentTransaction, type PaymentSavingPhase } from '@/lib/transactions';
import type { ProductDoc } from '@/types';

export default function TransactionModalScreen() {
  const router = useRouter();
  const icons = useTekTallyIconColors();
  const glass = useGlassBorder();
  const params = useLocalSearchParams<{ productId?: string }>();
  const preselect = typeof params.productId === 'string' ? params.productId : undefined;
  const { user, configured } = useAuthContext();
  const { products } = useProducts(user?.uid);

  const [productId, setProductId] = useState(preselect ?? '');
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [amountRaw, setAmountRaw] = useState('');
  const [note, setNote] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | PaymentSavingPhase>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) return;
    if (preselect) {
      setProductId(preselect);
      return;
    }
    if (products[0]) setProductId(products[0].id);
  }, [productId, preselect, products]);

  const selectedProduct: ProductDoc | undefined = products.find((p) => p.id === productId);

  const parsedAmount = useMemo(() => parseRupeesInput(amountRaw), [amountRaw]);

  const amountExceedsBalance = useMemo(() => {
    if (!selectedProduct) return false;
    if (!Number.isFinite(parsedAmount) || !Number.isInteger(parsedAmount) || parsedAmount <= 0) {
      return false;
    }
    return parsedAmount > selectedProduct.remainingBalance;
  }, [parsedAmount, selectedProduct]);

  async function pickFromLibrary() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setError('Photo library permission is required for receipts.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!res.canceled && res.assets[0]?.uri) {
      setImageUri(res.assets[0].uri);
    }
  }

  async function pickFromCamera() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setError('Camera permission is required to capture receipts.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.85 });
    if (!res.canceled && res.assets[0]?.uri) {
      setImageUri(res.assets[0].uri);
    }
  }

  function openReceiptPicker() {
    const library = 'Photo library';
    const camera = 'Camera';
    const cancel = 'Cancel';
    if (Platform.OS === 'web') {
      void pickFromLibrary();
      return;
    }
    Alert.alert('Receipt', 'Choose a source', [
      { text: library, onPress: () => void pickFromLibrary() },
      { text: camera, onPress: () => void pickFromCamera() },
      { text: cancel, style: 'cancel' },
    ]);
  }

  async function submit() {
    setError(null);
    if (!user || !configured) {
      setError('Sign in and configure Firebase first.');
      return;
    }
    if (!productId) {
      setError('Select a product.');
      return;
    }
    const amount = parseRupeesInput(amountRaw);
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount)) {
      setError('Enter a positive whole rupee amount.');
      return;
    }
    if (selectedProduct && amount > selectedProduct.remainingBalance) {
      setError(PAYMENT_EXCEEDS_BALANCE_MESSAGE);
      return;
    }
    setUploadStatus(imageUri ? 'compressing' : 'finishing');
    try {
      await addPaymentTransaction({
        userId: user.uid,
        productId,
        amountRupees: amount,
        note: note.trim() || undefined,
        localImageUri: imageUri,
        onPhase: (phase) => {
          setUploadStatus(phase);
          if (phase === 'compressing') {
            void hapticLight();
          }
        },
      });
      await hapticSuccess();
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save payment.');
    } finally {
      setUploadStatus('idle');
    }
  }

  return (
    <Screen>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        className="flex-1 px-4"
        contentContainerStyle={{ flexGrow: 1, paddingTop: 8, paddingBottom: 100 }}
        enableOnAndroid
        extraScrollHeight={100}
        scrollToOverflowEnabled
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <Text className="text-sm text-ledger-muted dark:text-neutral-500">
              Record a payment. Balance updates use a Firestore transaction so it stays consistent
              offline and online.
            </Text>

            <Text className="mb-1.5 mt-6 text-xs font-medium uppercase tracking-wide text-ledger-muted dark:text-neutral-500">
              Product
            </Text>
            <Pressable
              onPress={() => setProductMenuOpen(true)}
              className="flex-row items-center justify-between rounded-2xl border border-ledger-border bg-parchment px-4 py-3.5 active:bg-stone-200/80 dark:border-neutral-800 dark:bg-neutral-900 dark:active:bg-neutral-800"
            >
              <Text className="text-base text-ledger-ink dark:text-neutral-100">
                {selectedProduct?.name ?? 'Choose product'}
              </Text>
              <ChevronDown color={icons.chevron} size={22} />
            </Pressable>

            <Text className="mb-1.5 mt-4 text-xs font-medium uppercase tracking-wide text-ledger-muted dark:text-neutral-500">
              Amount paid (₹)
            </Text>
            <TextInput
              className="rounded-2xl bg-parchment px-4 py-3.5 text-base text-ledger-ink dark:bg-neutral-900 dark:text-neutral-100"
              style={[
                glass.input,
                amountExceedsBalance ? { borderColor: '#ef4444' } : null,
              ]}
              placeholder="e.g. 5000"
              placeholderTextColor="#a8a29e"
              keyboardType="number-pad"
              value={amountRaw}
              onChangeText={(t) => {
                setAmountRaw(t);
                setError(null);
              }}
            />
            {amountExceedsBalance ? (
              <Text className="mt-2 text-sm text-red-600 dark:text-red-400">
                {PAYMENT_EXCEEDS_BALANCE_MESSAGE}
              </Text>
            ) : null}

            <Text className="mb-1.5 mt-4 text-xs font-medium uppercase tracking-wide text-ledger-muted dark:text-neutral-500">
              Note (optional)
            </Text>
            <TextInput
              className="min-h-[88px] rounded-2xl bg-parchment px-4 py-3.5 text-base text-ledger-ink dark:bg-neutral-900 dark:text-neutral-100"
              style={glass.input}
              placeholder="Reference, bank, etc."
              placeholderTextColor="#a8a29e"
              multiline
              value={note}
              onChangeText={setNote}
            />

            <Text className="mb-2 mt-6 text-xs font-medium uppercase tracking-wide text-ledger-muted dark:text-neutral-500">
              Receipt (optional)
            </Text>
            <View className="flex-row flex-wrap items-center gap-3">
              <Pressable
                onPress={openReceiptPicker}
                className="flex-row items-center gap-2 rounded-2xl bg-parchment px-4 py-3 active:bg-stone-200/80 dark:bg-neutral-900 dark:active:bg-neutral-800"
                style={glass.card}
              >
                <ImagePlus color={icons.muted} size={20} />
                <Text className="text-sm font-medium text-stone-800 dark:text-neutral-200">
                  Attach receipt
                </Text>
              </Pressable>
              {imageUri ? (
                <View className="relative">
                  <Image source={{ uri: imageUri }} className="h-24 w-24 rounded-2xl" />
                  <Pressable
                    className="absolute -right-2 -top-2 rounded-full bg-stone-300 p-1 dark:bg-neutral-800"
                    onPress={() => setImageUri(null)}
                  >
                    <X color={icons.isDark ? '#fafafa' : '#1c1917'} size={16} />
                  </Pressable>
                </View>
              ) : null}
            </View>

            {error ? <Text className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</Text> : null}

            <View className="mt-8">
              <PrimaryButton
                title="Save payment"
                onPress={submit}
                disabled={amountExceedsBalance || uploadStatus !== 'idle'}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>

      <PaymentSavingModal
        visible={uploadStatus !== 'idle'}
        phase={uploadStatus === 'idle' ? 'finishing' : uploadStatus}
      />

      <Modal visible={productMenuOpen} transparent animationType="slide">
        <Pressable
          className="flex-1 justify-end bg-stone-100/70 dark:bg-stone-900/50 p-4 pb-0 rounded-xl"
          onPress={() => setProductMenuOpen(false)}
        >
          <Pressable
            className="max-h-[70%] rounded-t-[24px] border border-ledger-border border-b-0 bg-cream px-2 pb-10 pt-4 dark:border-neutral-800 dark:bg-neutral-950"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="mb-5 px-2 text-lg font-semibold text-ledger-ink dark:text-neutral-100">
              Select product
            </Text>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              automaticallyAdjustKeyboardInsets
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
            >
              {products.map((p) => (
                <Pressable
                  key={p.id}
                  className={`rounded-xl px-4 py-3.5 ${p.id === productId ? 'bg-amber-100 dark:bg-emerald-950/80' : 'active:bg-stone-200/80 dark:active:bg-neutral-900'}`}
                  onPress={() => {
                    setProductId(p.id);
                    setProductMenuOpen(false);
                  }}
                >
                  <Text className="text-base text-ledger-ink dark:text-neutral-100">{p.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable className="mt-2 py-3" onPress={() => setProductMenuOpen(false)}>
              <Text className="text-center text-ledger-muted dark:text-neutral-500">Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
