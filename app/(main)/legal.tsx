import { BlurView } from 'expo-blur';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { AppBackground } from '@/components/AppBackground';
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from '@/constants/LegalContent';
import { parseLegalDocument } from '@/lib/parse-legal-document';

export default function LegalScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { type } = useLocalSearchParams<{ type?: string }>();

  const isPrivacy = type === 'pp';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const source = isPrivacy ? PRIVACY_POLICY : TERMS_OF_SERVICE;
  const blocks = useMemo(() => parseLegalDocument(source), [source]);

  const blurAndroid =
    Platform.OS === 'android'
      ? ({
          experimentalBlurMethod: 'dimezisBlurView' as const,
          blurReductionFactor: 4,
        } as const)
      : {};

  const glassTint = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.5)';

  return (
    <>
      <Stack.Screen options={{ title }} />
      <View className="flex-1">
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <AppBackground />
        </View>
        <BlurView
          intensity={Platform.OS === 'web' ? 48 : isDark ? 40 : 56}
          tint={isDark ? 'dark' : 'light'}
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
          {...blurAndroid}
        />
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: glassTint },
          ]}
        />
        <ScrollView
          style={{ flex: 1, zIndex: 1 }}
          contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator
          automaticallyAdjustKeyboardInsets
        >
          {blocks.map((block, i) => (
            <View key={i} className={i > 0 ? 'mt-1' : ''}>
              {block.heading ? (
                <Text
                  className="text-[17px] font-bold text-ledger-ink dark:text-neutral-100"
                  style={{ marginTop: i === 0 ? 0 : 20, marginBottom: 8 }}
                >
                  {block.heading}
                </Text>
              ) : null}
              <Text
                className="text-[15px] text-ledger-ink dark:text-neutral-200"
                style={{ lineHeight: 22 }}
              >
                {block.body}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}
