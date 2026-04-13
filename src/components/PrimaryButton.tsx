import { useColorScheme } from 'nativewind';
import { ActivityIndicator, Pressable, Text } from 'react-native';

type Props = {
  title: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'ghost';
};

export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  variant = 'solid',
}: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme !== 'light';
  const isDisabled = disabled || loading;
  const base =
    variant === 'solid'
      ? 'rounded-2xl bg-amber-600 px-5 py-3.5 active:bg-amber-700 dark:bg-emerald-500 dark:active:bg-emerald-600'
      : 'rounded-2xl border border-stone-300 bg-white/60 px-5 py-3.5 active:bg-stone-100 dark:border-neutral-700 dark:bg-transparent dark:active:bg-neutral-900';
  const textCls =
    variant === 'solid'
      ? 'text-center text-base font-semibold text-[#FFFDF5] dark:text-neutral-950'
      : 'text-center text-base font-medium text-stone-800 dark:text-neutral-100';

  const spinnerColor =
    variant === 'solid' ? (isDark ? '#0a0a0a' : '#FFFDF5') : isDark ? '#fafafa' : '#1c1917';

  return (
    <Pressable
      className={`${base} ${isDisabled ? 'opacity-50' : ''}`}
      disabled={isDisabled}
      onPress={() => void onPress()}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <Text className={textCls}>{title}</Text>
      )}
    </Pressable>
  );
}
