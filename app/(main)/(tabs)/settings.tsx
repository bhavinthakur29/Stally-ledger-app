import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, useColorScheme, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { AboutTekTallyModal } from '@/components/settings/AboutTekTallyModal';
import { SettingsCell } from '@/components/settings/SettingsCell';
import { SettingsGlassCard } from '@/components/settings/SettingsGlassCard';
import { SettingsProfileCard } from '@/components/settings/SettingsProfileCard';
import { useAuthContext } from '@/context/auth-context';
import { hapticLight } from '@/lib/haptics';

export default function SettingsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const iconMuted = isDark ? 'rgba(255,255,255,0.72)' : 'rgba(68,64,60,0.85)';
  const logoutIconColor = isDark ? '#f87171' : '#dc2626';

  const { logOut } = useAuthContext();

  const [aboutOpen, setAboutOpen] = useState(false);

  function showSecurityInfo() {
    void hapticLight();
    Alert.alert(
      'Security',
      'TekTally can use your device biometrics or PIN when you return to the app. Manage Face ID, Touch ID, or fingerprint in your device settings.'
    );
  }

  function confirmLogout() {
    void hapticLight();
    Alert.alert(
      'Logout of TekTally?',
      'You will need to sign in again to access your ledger.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            void logOut();
          },
        },
      ]
    );
  }

  function openTerms() {
    router.push({ pathname: '/legal', params: { type: 'tos' } });
  }

  function openPrivacy() {
    router.push({ pathname: '/legal', params: { type: 'pp' } });
  }

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-8 pt-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-2xl font-bold text-ledger-ink dark:text-neutral-100">Settings</Text>
        <Text className="mt-1 text-sm text-ledger-muted dark:text-neutral-500">
          Profile, security, and legal
        </Text>

        <Text className="mb-2 mt-8 text-xs font-semibold uppercase tracking-widest text-ledger-muted dark:text-neutral-500">
          Profile
        </Text>
        <SettingsProfileCard />

        <Text className="mb-2 mt-2 text-xs font-semibold uppercase tracking-widest text-ledger-muted dark:text-neutral-500">
          Preferences
        </Text>
        <SettingsGlassCard>
          <SettingsCell
            icon={<Ionicons name="finger-print-outline" size={22} color={iconMuted} />}
            title="Security"
            subtitle="Biometrics and device PIN"
            onPress={showSecurityInfo}
            isLast
          />
        </SettingsGlassCard>

        <Text className="mb-2 mt-2 text-xs font-semibold uppercase tracking-widest text-ledger-muted dark:text-neutral-500">
          Support & About
        </Text>
        <SettingsGlassCard>
          <SettingsCell
            icon={<Ionicons name="information-circle-outline" size={22} color={iconMuted} />}
            title="About TekTally"
            subtitle="Version, credits, and TekSquad"
            onPress={() => setAboutOpen(true)}
            isLast
          />
        </SettingsGlassCard>

        <Text className="mb-2 mt-2 text-xs font-semibold uppercase tracking-widest text-ledger-muted dark:text-neutral-500">
          Legal
        </Text>
        <SettingsGlassCard>
          <SettingsCell
            icon={<Ionicons name="document-text-outline" size={22} color={iconMuted} />}
            title="Terms of Service"
            subtitle="TekTally by TekSquad — full terms"
            onPress={openTerms}
          />
          <SettingsCell
            icon={<Ionicons name="shield-checkmark-outline" size={22} color={iconMuted} />}
            title="Privacy Policy"
            subtitle="TekTally by TekSquad — how we handle data"
            onPress={openPrivacy}
            isLast
          />
        </SettingsGlassCard>

        <View className="mt-12 w-full border-t border-ledger-border/90 pt-8 dark:border-neutral-700/90">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log out of TekTally"
            onPress={confirmLogout}
            className="flex-row items-center justify-center gap-2.5 rounded-[24px] border border-red-500/35 bg-red-500/10 py-4 active:opacity-85 dark:border-red-500/40 dark:bg-red-500/15"
          >
            <Ionicons name="log-out-outline" size={22} color={logoutIconColor} />
            <Text className="text-base font-semibold text-red-600 dark:text-red-400">Log out</Text>
          </Pressable>
        </View>
      </ScrollView>

      <AboutTekTallyModal visible={aboutOpen} onClose={() => setAboutOpen(false)} />
    </Screen>
  );
}
