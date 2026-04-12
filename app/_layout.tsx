import '../global.css';

import { ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import 'react-native-reanimated';

import { PushNotificationsRoot } from '@/components/PushNotificationsRoot';
import { SecurityProvider } from '@/components/SecurityProvider';
import { AuthProvider, useAuthContext } from '@/context/auth-context';
import { navigationThemeForScheme } from '@/lib/navigation-theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(main)',
};

SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (loading) return;
    const root = segments[0];
    if (!user && root !== 'login') {
      router.replace('/login');
    } else if (user && root === 'login') {
      router.replace('/');
    }
  }, [user, loading, segments, router]);

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [loading]);

  if (loading && configured) {
    return (
      <View className="flex-1 items-center justify-center bg-cream dark:bg-neutral-950">
        <ActivityIndicator
          size="large"
          color={colorScheme === 'dark' ? '#34D399' : '#D97706'}
        />
      </View>
    );
  }

  return <>{children}</>;
}

function RootStack() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: isDark ? '#0a0a0a' : '#fffdf5' },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}

function ThemedRoot() {
  const colorScheme = useColorScheme();
  const navigationTheme = navigationThemeForScheme(colorScheme);

  return (
    <ThemeProvider value={navigationTheme}>
      <AuthProvider>
        <PushNotificationsRoot>
          <AuthGate>
            <SecurityProvider>
              <RootStack />
            </SecurityProvider>
          </AuthGate>
        </PushNotificationsRoot>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return <ThemedRoot />;
}
