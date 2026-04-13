import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuthContext } from '@/context/auth-context';
import { useGlassBorder } from '@/lib/glass-styles';
import { hapticSuccess } from '@/lib/haptics';
import { saveUserDisplayName } from '@/lib/user-profile';

const BLUR_INTENSITY_DARK = 58;
const BLUR_INTENSITY_LIGHT = 88;

export function SettingsProfileCard() {
  const { user, configured } = useAuthContext();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const glass = useGlassBorder();

  const uid = user?.uid ?? null;

  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const next = user?.displayName?.trim() ?? '';
    setName(next);
  }, [user?.uid, user?.displayName]);

  const email = user?.email ?? '';

  const dirty = useMemo(() => {
    const trimmed = name.trim();
    const current = user?.displayName?.trim() ?? '';
    return trimmed !== current;
  }, [name, user?.displayName]);

  const canSave = Boolean(uid && configured && dirty && name.trim().length > 0);

  const fieldShell = useMemo(
    () => ({
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: Platform.OS === 'ios' ? 12 : 10,
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    }),
    [isDark]
  );

  const iconColor = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(28,25,23,0.75)';
  const placeholderColor = isDark ? '#737373' : '#a8a29e';
  const inputColor = isDark ? '#fafafa' : '#1c1917';

  const onSave = useCallback(async () => {
    if (!uid || !configured) {
      Alert.alert('Unavailable', 'Sign in and configure Firebase to update your profile.');
      return;
    }
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Name required', 'Please enter a display name.');
      return;
    }

    setSaving(true);
    try {
      await saveUserDisplayName(uid, trimmed);
      await hapticSuccess();
      Alert.alert('Profile Updated!', 'Your display name has been saved.');
    } catch (e) {
      Alert.alert('Could not save', e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }, [uid, configured, name]);

  return (
    <View className="mb-4 overflow-hidden rounded-[24px]" style={[styles.card, glass.card]}>
      {Platform.OS === 'web' ? (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            },
          ]}
        />
      ) : (
        <BlurView
          intensity={isDark ? BLUR_INTENSITY_DARK : BLUR_INTENSITY_LIGHT}
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

      <View className="relative z-10 px-4 pb-5 pt-4">
        <View className="flex-row items-center gap-3">
          <View
            className="h-14 w-14 items-center justify-center rounded-full bg-white/10"
            style={glass.card}
          >
            <Ionicons name="person" size={28} color={iconColor} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-base font-semibold text-ledger-ink dark:text-neutral-100">
              Profile
            </Text>
            <Text className="mt-0.5 text-xs text-ledger-muted dark:text-neutral-500">
              {uid ? 'Edit your display name below' : 'Sign in to edit your profile'}
            </Text>
          </View>
        </View>

        <Text className="mb-1.5 mt-5 text-xs font-medium uppercase tracking-wide text-ledger-muted dark:text-neutral-500">
          Name
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your display name"
          placeholderTextColor={placeholderColor}
          editable={Boolean(uid && configured)}
          style={[glass.input, fieldShell, { color: inputColor }]}
          autoCapitalize="words"
          autoCorrect
        />

        <Text className="mb-1.5 mt-4 text-xs font-medium uppercase tracking-wide text-ledger-muted dark:text-neutral-500">
          Email
        </Text>
        <TextInput
          value={email}
          editable={false}
          placeholder="Not available"
          placeholderTextColor={placeholderColor}
          style={[
            glass.input,
            fieldShell,
            { color: isDark ? '#a3a3a3' : '#78716c', opacity: uid ? 0.92 : 1 },
          ]}
        />
        <Text className="mt-1.5 text-xs text-ledger-muted dark:text-neutral-500">
          Email is tied to your sign-in and can&apos;t be changed here.
        </Text>

        <View className="mt-5">
          <PrimaryButton
            title="Save changes"
            onPress={onSave}
            loading={saving}
            disabled={!canSave || saving}
          />
        </View>

        {!configured ? (
          <Text className="mt-3 text-center text-xs text-amber-800 dark:text-amber-400">
            Configure Firebase in app.json to sync profile to Firestore.
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
  },
});
