import { useTheme } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { Home, Settings } from 'lucide-react-native';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.dark ? '#34D399' : '#D97706',
        tabBarInactiveTintColor: theme.dark ? '#737373' : '#78716C',
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size ?? 22} />,
        }}
      />
    </Tabs>
  );
}
