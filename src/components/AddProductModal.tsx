import { useState } from 'react';
import { Modal, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { parseRupeesInput } from '@/lib/currency';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, initialOwedRupees: number) => Promise<void>;
};

export function AddProductModal({ visible, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [owedRaw, setOwedRaw] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    const owed = parseRupeesInput(owedRaw);
    if (!name.trim()) {
      setError('Enter a product name.');
      return;
    }
    if (!Number.isFinite(owed) || owed < 0 || !Number.isInteger(owed)) {
      setError('Enter a valid whole rupee amount (0 or more).');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(name.trim(), owed);
      setName('');
      setOwedRaw('');
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save product.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-stone-900/50 dark:bg-black/60">
        <View className="rounded-t-[24px] border border-ledger-border border-b-0 bg-cream px-5 pb-10 pt-6 dark:border-neutral-800 dark:bg-neutral-950">
          <Text className="text-xl font-bold text-ledger-ink dark:text-neutral-100">New product</Text>
          <Text className="mt-1 text-sm text-ledger-muted dark:text-neutral-500">
            Track what is owed for a purchase, loan, or subscription.
          </Text>
          <Text className="mb-1.5 mt-5 text-xs font-medium uppercase tracking-wide text-ledger-muted dark:text-neutral-500">
            Name
          </Text>
          <TextInput
            className="rounded-2xl border border-ledger-border bg-parchment px-4 py-3.5 text-base text-ledger-ink dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
            placeholder="e.g. MacBook EMI"
            placeholderTextColor="#a8a29e"
            value={name}
            onChangeText={setName}
          />
          <Text className="mb-1.5 mt-4 text-xs font-medium uppercase tracking-wide text-ledger-muted dark:text-neutral-500">
            Total owed (₹, whole rupees)
          </Text>
          <TextInput
            className="rounded-2xl border border-ledger-border bg-parchment px-4 py-3.5 text-base text-ledger-ink dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
            placeholder="e.g. 220000"
            placeholderTextColor="#a8a29e"
            keyboardType="number-pad"
            value={owedRaw}
            onChangeText={setOwedRaw}
          />
          {error ? <Text className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</Text> : null}
          <View className="mt-6 flex-row gap-3">
            <View className="flex-1">
              <PrimaryButton title="Cancel" variant="ghost" onPress={onClose} disabled={loading} />
            </View>
            <View className="flex-1">
              <PrimaryButton title="Save" onPress={handleSave} loading={loading} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
