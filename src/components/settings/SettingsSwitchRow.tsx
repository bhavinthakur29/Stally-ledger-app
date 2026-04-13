import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useColorScheme } from 'nativewind';
import { Switch, Text, View } from 'react-native';

import { AnimatedThemeToggle } from '@/components/AnimatedThemeToggle';

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isLast?: boolean;
  /** Capsule moon/sun toggle with spring (e.g. dark mode). */
  variant?: 'switch' | 'theme';
};

export function SettingsSwitchRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  isLast = false,
  variant = 'switch',
}: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme !== 'light';

  const iconColor = isDark ? 'rgba(255,255,255,0.72)' : 'rgba(68,64,60,0.85)';

  return (
    <>
      <View className="flex-row items-center gap-3.5 px-4 py-3.5">
        <View className="w-9 items-center justify-center">
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-base font-medium text-ledger-ink dark:text-neutral-100">{title}</Text>
          {subtitle ? (
            <Text
              className="mt-0.5 text-sm text-ledger-muted dark:text-neutral-500"
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        {variant === 'theme' ? (
          <AnimatedThemeToggle value={value} onValueChange={onValueChange} />
        ) : (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{
              false: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
              true: isDark ? 'rgba(52,211,153,0.45)' : 'rgba(217,119,6,0.45)',
            }}
            thumbColor={isDark ? '#f5f5f5' : '#fffdf5'}
            ios_backgroundColor={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}
          />
        )}
      </View>
      {!isLast ? (
        <View className="ml-[52px] mr-4 h-px bg-ledger-border/80 dark:bg-neutral-700/80" />
      ) : null}
    </>
  );
}
