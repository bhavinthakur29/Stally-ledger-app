import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function MainLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontWeight: '600', color: theme.colors.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ title: 'Activity' }} />
      <Stack.Screen
        name="transaction"
        options={{
          presentation: 'modal',
          title: 'Record payment',
          headerStyle: { backgroundColor: theme.colors.card },
        }}
      />
    </Stack>
  );
}
