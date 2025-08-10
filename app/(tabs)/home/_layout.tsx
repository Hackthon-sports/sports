import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack >
      <Stack.Screen name="main" options={{ headerShown:false }} />
      <Stack.Screen name="notifications" options={{ headerShown:false }} />
      <Stack.Screen name="comment" options={{ headerShown: false }} />
      <Stack.Screen name="search" options={{ headerShown: false }} />
    </Stack>
  );
}
