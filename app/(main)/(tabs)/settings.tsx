import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { AboutStallyModal } from '@/components/settings/AboutStallyModal';
import { LegalNoticeModal } from '@/components/settings/LegalNoticeModal';
import { SettingsCell } from '@/components/settings/SettingsCell';
import { SettingsGlassCard } from '@/components/settings/SettingsGlassCard';
import { SettingsProfileCard } from '@/components/settings/SettingsProfileCard';
import { SettingsSwitchRow } from '@/components/settings/SettingsSwitchRow';
import { useThemePreference } from '@/context/theme-preference-context';
import { hapticLight } from '@/lib/haptics';

const TERMS_PLACEHOLDER =
  'Terms of Service for Stally will appear here. This is placeholder copy until legal pages are published.';

const PRIVACY_PLACEHOLDER =
  'Privacy Policy for Stally will appear here. This is placeholder copy until legal pages are published.';

export default function SettingsScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme !== 'light';
  const iconMuted = isDark ? 'rgba(255,255,255,0.72)' : 'rgba(68,64,60,0.85)';

  const { darkModeEnabled, setDarkModeEnabled } = useThemePreference();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  function showSecurityInfo() {
    void hapticLight();
    Alert.alert(
      'Security',
      'Stally can use your device biometrics or PIN when you return to the app. Manage Face ID, Touch ID, or fingerprint in your device settings.'
    );
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
          Profile, appearance, and legal
        </Text>

        <Text className="mb-2 mt-8 text-xs font-semibold uppercase tracking-widest text-ledger-muted dark:text-neutral-500">
          Profile
        </Text>
        <SettingsProfileCard />

        <Text className="mb-2 mt-2 text-xs font-semibold uppercase tracking-widest text-ledger-muted dark:text-neutral-500">
          Preferences
        </Text>
        <SettingsGlassCard>
          <SettingsSwitchRow
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Frosted glass light theme when off"
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
          />
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
            title="About Stally"
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
            subtitle="Placeholder — full terms coming soon"
            onPress={() => setTermsOpen(true)}
          />
          <SettingsCell
            icon={<Ionicons name="shield-checkmark-outline" size={22} color={iconMuted} />}
            title="Privacy Policy"
            subtitle="Placeholder — full policy coming soon"
            onPress={() => setPrivacyOpen(true)}
            isLast
          />
        </SettingsGlassCard>
      </ScrollView>

      <AboutStallyModal visible={aboutOpen} onClose={() => setAboutOpen(false)} />
      <LegalNoticeModal
        visible={termsOpen}
        onClose={() => setTermsOpen(false)}
        title="Terms of Service"
        body={TERMS_PLACEHOLDER}
      />
      <LegalNoticeModal
        visible={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Privacy Policy"
        body={PRIVACY_PLACEHOLDER}
      />
    </Screen>
  );
}
