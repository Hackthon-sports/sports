import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    switch (route.name) {
                        case 'index':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'messages':
                            iconName = focused ? 'chatbox' : 'chatbox-outline';
                            break;
                        case 'tournaments':
                            iconName = focused ? 'trophy' : 'trophy-outline';
                            break;
                        case 'store':
                            iconName = focused ? 'cart' : 'cart-outline';
                            break;
                        case 'profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'ellipse';
                    }

                    return <Ionicons name={iconName} size={size} color="#7C3AED" />;
                },
                tabBarActiveTintColor: '#7C3AED',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="messages" />
            <Tabs.Screen name="tournaments" />
            <Tabs.Screen name="store" />
            <Tabs.Screen name="profile" />
        </Tabs>
    );
}
