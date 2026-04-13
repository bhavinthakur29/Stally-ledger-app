import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import { StyleSheet, View } from 'react-native';

const BLOB_GREEN = '#064e3b';
const BLOB_NAVY = '#020617';

/**
 * Fixed full-screen gradient + soft color blobs for glassmorphism depth.
 */
export function AppBackground() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme !== 'light';

  return (
    <View style={styles.root} pointerEvents="none">
      <LinearGradient
        colors={
          isDark
            ? [BLOB_NAVY, '#0c1a2e', '#022c22', BLOB_NAVY]
            : ['#f4f7fb', '#e8eef6', '#f0f4f8', '#e2e8f0']
        }
        locations={[0, 0.35, 0.65, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.blob,
          {
            top: isDark ? '-12%' : '-8%',
            left: isDark ? '-18%' : '-12%',
            backgroundColor: BLOB_GREEN,
            opacity: isDark ? 0.42 : 0.18,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          {
            bottom: isDark ? '-6%' : '-4%',
            right: isDark ? '-22%' : '-16%',
            backgroundColor: BLOB_NAVY,
            opacity: isDark ? 0.55 : 0.12,
          },
        ]}
      />
      <View
        style={[
          styles.blobSmall,
          {
            top: isDark ? '38%' : '42%',
            right: isDark ? '-10%' : '-6%',
            backgroundColor: BLOB_GREEN,
            opacity: isDark ? 0.22 : 0.1,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  blob: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
  },
  blobSmall: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
});
