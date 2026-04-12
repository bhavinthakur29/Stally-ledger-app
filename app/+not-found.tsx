import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View className="flex-1 items-center justify-center bg-cream px-6 dark:bg-neutral-950">
        <Text className="text-center text-xl font-semibold text-ledger-ink dark:text-neutral-100">
          This screen does not exist.
        </Text>
        <Link href="/" className="mt-6">
          <Text className="text-base text-amber-700 dark:text-emerald-400">Back to Stally</Text>
        </Link>
      </View>
    </>
  );
}
