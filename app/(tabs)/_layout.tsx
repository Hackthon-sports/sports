import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#B57EDC',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#eee',
          height: 60,
        },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            home: 'home-outline',
            messages: 'chatbubble-ellipses-outline',
            Tournament: 'trophy-outline',
            stores: 'cart-outline',
            profile: 'person-outline',
          };

          const iconName = icons[route.name as keyof typeof icons] || 'ellipse-outline';

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' ,headerShown:false}} />
      <Tabs.Screen name="messages" options={{ title: 'Messages' ,headerShown:false}} />
      <Tabs.Screen name="Tournament" options={{ title: 'Tournament',headerShown:false }} />
      <Tabs.Screen name="stores" options={{ title: 'Stores',headerShown:false }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile',headerShown:false }} />
    </Tabs>
  );
}
