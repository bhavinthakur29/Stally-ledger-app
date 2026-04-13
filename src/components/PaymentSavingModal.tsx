import { BlurView } from 'expo-blur';
import { ActivityIndicator, Modal, Platform, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { useGlassBorder } from '@/lib/glass-styles';
import type { PaymentSavingPhase } from '@/lib/transactions';

const COPY: Record<PaymentSavingPhase, string> = {
  compressing: 'Processing image…',
  uploading: 'Syncing with cloud…',
  finishing: 'Finishing up…',
};

type Props = {
  visible: boolean;
  phase: PaymentSavingPhase;
};

export function PaymentSavingModal({ visible, phase }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const glass = useGlassBorder();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View
          className="w-full max-w-sm overflow-hidden rounded-[24px]"
          style={[glass.card, { backgroundColor: 'transparent' }]}
        >
          {Platform.OS === 'web' ? (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.85)',
                },
              ]}
            />
          ) : (
            <BlurView
              intensity={isDark ? 48 : 72}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
          )}
          {Platform.OS !== 'web' ? (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              ]}
            />
          ) : null}
          <View className="items-center px-8 py-10">
            <ActivityIndicator size="large" color={isDark ? '#34d399' : '#d97706'} />
            <Text className="mt-6 text-center text-base font-medium leading-6 text-ledger-ink dark:text-neutral-100">
              {COPY[phase]}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
