import type { TextStyle, ViewStyle } from 'react-native';

const glassBorder = {
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.1)',
} as const;

/** Shared glassmorphism border for views / pressables. */
export const glassCardBorder: ViewStyle = glassBorder;

/** Same border for `TextInput` (RN types separate `TextStyle` / `ViewStyle`). */
export const glassInputBorder: TextStyle = glassBorder;
