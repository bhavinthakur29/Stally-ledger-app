import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export async function hapticSuccess(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    /* optional on unsupported devices */
  }
}

export async function hapticLight(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    /* ignore */
  }
}
