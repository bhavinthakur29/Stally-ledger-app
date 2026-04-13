import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, Text, useColorScheme, View } from 'react-native';

import { hapticLight } from '@/lib/haptics';

type Props = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  isLast?: boolean;
};

export function SettingsCell({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  isLast = false,
}: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const chevronColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(68,64,60,0.45)';

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          void hapticLight();
          onPress();
        }}
        className="flex-row items-center gap-3.5 px-4 py-3.5 active:opacity-85"
      >
        <View className="w-9 items-center justify-center">{icon}</View>
        <View className="min-w-0 flex-1">
          <Text className="text-base font-medium text-ledger-ink dark:text-neutral-100">
            {title}
          </Text>
          {subtitle ? (
            <Text
              className="mt-0.5 text-sm text-ledger-muted dark:text-neutral-500"
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        {showChevron ? (
          <Ionicons name="chevron-forward" size={22} color={chevronColor} />
        ) : null}
      </Pressable>
      {!isLast ? (
        <View className="ml-[52px] mr-4 h-px bg-ledger-border/80 dark:bg-neutral-700/80" />
      ) : null}
    </>
  );
}
