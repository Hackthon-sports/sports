import { Stack } from "expo-router";
export default function MessagesLayout() {
  return (
    <Stack>
      <Stack.Screen name="main" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false  }} />
    </Stack>
  );
}