import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { CurrencyText } from '@/components/CurrencyText';
import { useGlassBorder } from '@/lib/glass-styles';

const NEON_SHADOW_DARK = '#34d399';
const NEON_SHADOW_LIGHT = '#d97706';
const CARD_RADIUS = 24;

const CURRENCY_TEXT_SHADOW = {
  textShadowColor: 'rgba(0, 0, 0, 0.15)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 2,
} as const;

type Props = {
  totalRupees: number;
};

export function TotalOwedCard({ totalRupees }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const glass = useGlassBorder();

  const shadowColor = isDark ? NEON_SHADOW_DARK : NEON_SHADOW_LIGHT;
  /** Stronger tint so frosted read is visible even when blur is subtle (Android fallback / low intensity). */
  const glassTint = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.45)';
  const labelColor = isDark ? '#34d399' : '#92400e';

  const blurAndroid =
    Platform.OS === 'android'
      ? ({
        experimentalBlurMethod: 'dimezisBlurView' as const,
        blurReductionFactor: 3,
      } as const)
      : {};

  return (
    <View
      style={[
        styles.shadowOuter,
        {
          shadowColor,
          /** Must stay transparent so BlurView samples the gradient behind the card (not a solid parent). */
          backgroundColor: 'transparent',
        },
      ]}
    >
      <View
        style={[
          styles.innerClip,
          glass.card,
          {
            borderRadius: CARD_RADIUS,
            overflow: 'hidden',
            backgroundColor: 'transparent',
            ...Platform.select({
              android: { elevation: 14 },
              default: {},
            }),
          },
        ]}
      >
        <BlurView
          intensity={Platform.OS === 'web' ? 55 : isDark ? 52 : 62}
          tint={isDark ? 'dark' : 'light'}
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.blurClip]}
          {...blurAndroid}
        />
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.blurClip,
            { backgroundColor: 'transparent' },
          ]}
        />
        <View style={styles.content}>
          <Text style={[styles.label, { color: labelColor, backgroundColor: 'transparent' }]}>
            Total owed
          </Text>
          <CurrencyText
            rupees={totalRupees}
            style={[
              styles.amount,
              CURRENCY_TEXT_SHADOW,
              { color: labelColor, backgroundColor: 'transparent' },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowOuter: {
    marginTop: 16,
    borderRadius: CARD_RADIUS,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
  },
  innerClip: {
    position: 'relative',
  },
  blurClip: {
    borderRadius: CARD_RADIUS,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  amount: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
