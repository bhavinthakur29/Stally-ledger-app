import '../global.css';

import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
  useFonts as useSpaceMonoFonts,
} from '@expo-google-fonts/space-mono';
import { ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import 'react-native-reanimated';

import { AppBackground } from '@/components/AppBackground';
import { PushNotificationsRoot } from '@/components/PushNotificationsRoot';
import { SecurityProvider } from '@/components/SecurityProvider';
import { AuthProvider, useAuthContext } from '@/context/auth-context';
import { useCheckUpdates } from '@/hooks/useCheckUpdates';
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
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

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
      <View className="flex-1 bg-transparent">
        <AppBackground />
        <View className="absolute inset-0 z-10 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? '#34D399' : '#D97706'} />
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

function RootStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}

function ThemedRoot() {
  const scheme = useColorScheme();
  const navigationTheme = navigationThemeForScheme(scheme === 'dark' ? 'dark' : 'light');

  useCheckUpdates();

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
  const [fontsLoaded, fontError] = useSpaceMonoFonts({
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return <ThemedRoot />;
}
