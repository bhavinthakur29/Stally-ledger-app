import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

/** Warm Light — ledger / cream surfaces, amber primary. */
export const warmLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#D97706',
    background: '#FFFDF5',
    card: '#F5F0E6',
    text: '#1C1917',
    border: '#E8E0D4',
    notification: '#B45309',
  },
};

/** Dark — slate surfaces, emerald accents (TekTally dark). */
export const tektallyDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#34D399',
    background: '#0A0A0A',
    card: '#171717',
    text: '#FAFAFA',
    border: '#262626',
    notification: '#34D399',
  },
};

export function navigationThemeForScheme(
  scheme: 'light' | 'dark' | null | undefined
): Theme {
  return scheme === 'dark' ? tektallyDarkTheme : warmLightTheme;
}
