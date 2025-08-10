// app/store/_layout.tsx

import { Stack } from 'expo-router';

export default function StoreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
