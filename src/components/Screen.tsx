import { type ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  className?: string;
};

export function Screen({ children, className }: Props) {
  return (
    <SafeAreaView
      className={`flex-1 bg-cream dark:bg-neutral-950 ${className ?? ''}`}
      edges={['top', 'left', 'right']}
    >
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
}
