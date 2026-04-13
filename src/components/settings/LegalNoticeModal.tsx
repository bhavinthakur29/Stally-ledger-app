import { X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { useStallyIconColors } from '@/hooks/useStallyIconColors';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  body: string;
};

export function LegalNoticeModal({ visible, onClose, title, body }: Props) {
  const icons = useStallyIconColors();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme !== 'light';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView
        className={`flex-1 ${isDark ? 'bg-neutral-950' : 'bg-cream'}`}
        edges={['top', 'left', 'right']}
      >
        <View className="flex-row items-center justify-between border-b border-ledger-border px-4 py-3 dark:border-neutral-800">
          <Text className="flex-1 pr-2 text-lg font-semibold text-ledger-ink dark:text-neutral-100">
            {title}
          </Text>
          <Pressable
            onPress={onClose}
            className="rounded-full p-2 active:opacity-70"
            hitSlop={12}
          >
            <X color={icons.muted} size={24} />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-5 pt-4"
          contentContainerClassName="pb-8"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-base leading-6 text-ledger-ink dark:text-neutral-300">{body}</Text>
        </ScrollView>

        <View className="px-5 pb-6">
          <PrimaryButton title="Close" onPress={onClose} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
