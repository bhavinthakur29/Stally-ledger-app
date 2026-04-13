import { type ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/AppBackground';

type Props = {
  children: ReactNode;
  className?: string;
};

export function Screen({ children, className }: Props) {
  return (
    <SafeAreaView
      className={`flex-1 bg-transparent ${className ?? ''}`}
      edges={['top', 'left', 'right']}
    >
      <AppBackground />
      <View className="relative z-10 flex-1">{children}</View>
    </SafeAreaView>
  );
}
