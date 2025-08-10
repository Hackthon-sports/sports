import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const primaryPurple = "#5c2a9a";

export default function ChatScreen() {
  const { id, name, avatar } = useLocalSearchParams();
  const router = useRouter();

  const [messages, setMessages] = useState([
    { id: "1", text: "Hey there!", sender: "them", timestamp: Date.now() - 600000 },
    { id: "2", text: "Hi! How’s your day going?", sender: "me", timestamp: Date.now() - 540000 },
    { id: "3", text: "Pretty good, just working on a project.", sender: "them", timestamp: Date.now() - 300000 },
  ]);
  const flatListRef = useRef<FlatList>(null);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: input, sender: "me", timestamp: Date.now() },
    ]);
    setInput("");
  };

  // Scroll to end whenever messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView className="flex-1 bg-white">
          {/* Top Bar */}
          <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
            <TouchableOpacity onPress={() => router.back()} className="mr-2">
              <Ionicons name="arrow-back" size={28} color={primaryPurple} />
            </TouchableOpacity>

            {avatar ? (
              <Image
                source={{ uri: avatar as string }}
                className="w-12 h-12 rounded-full mr-3"
              />
            ) : null}
            <Text
              className="text-base font-bold text-neutral-800"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {name ?? "Chat"}
            </Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <View
                className={`mb-4 max-w-[75%] ${
                  item.sender === "me" ? "self-end" : "self-start"
                }`}
              >
                {/* Message Bubble */}
                <View
                  className={`px-4 py-3 rounded-2xl ${
                    item.sender === "me" ? "bg-purple-600" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`text-base ${
                      item.sender === "me" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.text}
                  </Text>
                </View>

                {/* Timestamp below bubble */}
                <Text
                  className={`mt-1 text-xs ${
                    item.sender === "me" ? "text-purple-300 text-right" : "text-gray-500 text-left"
                  }`}
                >
                  {formatTime(item.timestamp)}
                </Text>
              </View>
            )}
          />
          <View className="flex-row items-center border-t border-gray-200 p-3 bg-white">
            <TextInput
              placeholder="Type a message..."
              value={input}
              onChangeText={setInput}
              className="flex-1 bg-gray-100 p-4 rounded-full mr-3 text-base text-gray-900"
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              onPress={sendMessage}
              className="bg-purple-600 px-5 py-3 rounded-full shadow-md"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">Send</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
