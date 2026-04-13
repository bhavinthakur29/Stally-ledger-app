import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { X } from 'lucide-react-native';
import { Modal, Pressable, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { useStallyIconColors } from '@/hooks/useStallyIconColors';

const TEKSQUAD_URL = 'https://teksquad.netlify.app/';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function AboutStallyModal({ visible, onClose }: Props) {
  const icons = useStallyIconColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const version = Constants.expoConfig?.version ?? '—';

  async function openTekSquad() {
    const can = await Linking.canOpenURL(TEKSQUAD_URL);
    if (can) await Linking.openURL(TEKSQUAD_URL);
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView
        className={`flex-1 ${isDark ? 'bg-neutral-950' : 'bg-cream'}`}
        edges={['top', 'left', 'right']}
      >
        <View className="flex-row items-center justify-between border-b border-ledger-border px-4 py-3 dark:border-neutral-800">
          <Text className="text-lg font-semibold text-ledger-ink dark:text-neutral-100">
            About TekTally
          </Text>
          <Pressable
            onPress={onClose}
            className="rounded-full p-2 active:opacity-70"
            hitSlop={12}
          >
            <X color={icons.muted} size={24} />
          </Pressable>
        </View>

        <View className="flex-1 px-5 pt-6">
          <Text className="text-2xl font-bold text-ledger-ink dark:text-neutral-100">TekTally</Text>
          <Text className="mt-2 text-sm text-ledger-muted dark:text-neutral-500">
            Your personal ledger for what you owe.
          </Text>

          <Text className="mt-8 text-xs font-semibold uppercase tracking-wide text-ledger-muted dark:text-neutral-500">
            App version
          </Text>
          <Text className="mt-1 text-lg font-semibold text-ledger-ink dark:text-neutral-200">
            {version}
          </Text>

          <Text className="mt-8 text-xs font-semibold uppercase tracking-wide text-ledger-muted dark:text-neutral-500">
            Credits
          </Text>
          <View className="mt-2 flex-row flex-wrap items-center">
            <Text className="text-base leading-6 text-ledger-ink dark:text-neutral-300">
              Proudly developed by{' '}
            </Text>
            <Pressable
              onPress={() => void openTekSquad()}
              accessibilityRole="link"
              accessibilityLabel="Open TekSquad website"
              className="active:opacity-70"
            >
              <Text className="text-base font-semibold leading-6 text-amber-700 underline dark:text-emerald-400">
                TekSquad
              </Text>
            </Pressable>
            <Text className="text-base leading-6 text-ledger-ink dark:text-neutral-300">.</Text>
          </View>
          <Text className="mt-3 text-sm text-ledger-muted dark:text-neutral-500">
            Tap TekSquad to visit our site.
          </Text>
        </View>

        <View className="px-5 pb-6">
          <PrimaryButton title="Done" onPress={onClose} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
