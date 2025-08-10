// app/(tabs)/messages/main.tsx
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";

const lavender = "#B57EDC";

const mockMessages = [
  {
    id: "1",
    name: "Sneha",
    timestamp: Date.now() - 22 * 60 * 1000,
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "2",
    name: "Rahul",
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: "3",
    name: "Vijay Sai Bora",
    timestamp: Date.now() - 2 * 60 * 1000,
    avatar: "https://i.pravatar.cc/150?img=11",
  },
];

const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diff < 60 * 1000) return "Just now";
  if (minutes < 60) return `Active ${minutes}m ago`;
  if (hours < 24) return `Active ${hours}h ago`;
  return `Active ${days}d ago`;
};

export default function MessagesScreen() {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const filtered = mockMessages
    .filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-4">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Top Bar */}
      <View className="mb-4 relative">
        <Text className="text-2xl font-bold text-neutral-800">Messages</Text>
        <TouchableOpacity className="absolute right-0 top-0">
          <Text style={{ color: lavender }} className="font-semibold">
            Requests
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <TextInput
        placeholder="Search"
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
        className="bg-gray-100 text-neutral-800 p-3 rounded-xl mb-4"
      />

      {/* Message List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center py-3 border-b border-gray-200"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/messages/chat",
                params: {
                  id: item.id,
                  name: item.name,
                  avatar: item.avatar,
                },
              })
            }
          >
            <Image
              source={{ uri: item.avatar }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="text-neutral-800 font-semibold text-base">
                {item.name}
              </Text>
              <Text className="text-gray-500 text-sm">
                {getTimeAgo(item.timestamp)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
