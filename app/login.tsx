import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { GlassInputWrap } from '@/components/GlassInputWrap';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useAuthContext } from '@/context/auth-context';
import { useGlassBorder } from '@/lib/glass-styles';
import { hapticSuccess } from '@/lib/haptics';

export default function LoginScreen() {
  const glass = useGlassBorder();
  const { signIn, signUp, configured } = useAuthContext();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    if (!configured) {
      setError('Add Firebase keys to your .env (see .env.example) or EAS secrets as EXPO_PUBLIC_FB_*.');
      return;
    }
    if (!email.trim() || password.length < 6) {
      setError('Valid email and password (6+ characters) required.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      await hapticSuccess();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Authentication failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingVertical: 40,
          }}
        >
          <Text className="text-4xl font-bold tracking-tight text-ledger-ink dark:text-neutral-100">
            TekTally
          </Text>
          <Text className="mt-2 text-base text-ledger-muted dark:text-neutral-500">
            Track every rupee. Settle every balance.
          </Text>

          {!configured ? (
            <View className="mt-6 rounded-[24px] bg-amber-50 p-4 dark:bg-amber-950/40" style={glass.card}>
              <Text className="text-sm font-medium text-amber-900 dark:text-amber-200">
                Firebase not configured
              </Text>
              <Text className="mt-2 text-sm leading-5 text-amber-950/90 dark:text-amber-100/80">
                Copy `.env.example` to `.env` and add your Firebase web app values from the Firebase
                console (or set EXPO_PUBLIC_FB_* in EAS for production builds), then restart Expo.
              </Text>
            </View>
          ) : null}

          <Text className="mb-1.5 mt-8 text-xs font-medium uppercase tracking-wide text-ledger-muted dark:text-neutral-500">
            Email
          </Text>
          <GlassInputWrap>
            <TextInput
              className="bg-transparent px-4 py-3.5 text-base text-ledger-ink dark:text-neutral-100"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder="you@example.com"
              placeholderTextColor="#a8a29e"
              value={email}
              onChangeText={setEmail}
              underlineColorAndroid="transparent"
            />
          </GlassInputWrap>

          <Text className="mb-1.5 mt-4 text-xs font-medium uppercase tracking-wide text-ledger-muted dark:text-neutral-500">
            Password
          </Text>
          <GlassInputWrap>
            <TextInput
              className="bg-transparent px-4 py-3.5 text-base text-ledger-ink dark:text-neutral-100"
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#a8a29e"
              value={password}
              onChangeText={setPassword}
              underlineColorAndroid="transparent"
            />
          </GlassInputWrap>

          {error ? (
            <Text className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</Text>
          ) : null}

          <View className="mt-8">
            <PrimaryButton
              title={mode === 'login' ? 'Sign in' : 'Create account'}
              onPress={submit}
              loading={loading}
            />
          </View>

          <Pressable
            className="mt-6 self-center py-2 active:opacity-70"
            onPress={() => {
              void Haptics.selectionAsync();
              setMode((m) => (m === 'login' ? 'signup' : 'login'));
              setError(null);
            }}
          >
            <Text className="text-center text-sm font-medium text-amber-700 dark:text-emerald-400">
              {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </Text>
          </Pressable>

          <Text className="mt-10 px-2 text-center text-[11px] leading-[16px] text-ledger-muted dark:text-neutral-500">
            <Text className="font-medium text-ledger-ink/75 dark:text-neutral-400">TekTally</Text>
            {' · '}
            <Text className="text-ledger-muted/85 dark:text-neutral-500/85">
              v1.0 · by TekSquad · 2026
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
