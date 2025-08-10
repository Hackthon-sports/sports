import React, { useState } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  Text,
  StyleProp,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

// Colors
const primaryPurple = "#5c2a9a";
const lightPurple = "#8b5cf6";
const white = "#ffffff";
const black = "#000000";
const lightGray = "#f3f4f6";

// AppText Props Interface
interface AppTextProps {
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

// Reusable AppText Component
const AppText: React.FC<AppTextProps> = ({ style, children, ...props }) => {
  return (
    <Text
      style={[
        {
          fontFamily:
            Platform.OS === "ios" ? "Avenir-Heavy" : "sans-serif-condensed",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Notification Interface
interface NotificationItem {
  id: string;
  title: string;
  description: string;
  image: any;
  timestamp: number;
  type: "tournament" | "match";
}

// Sample Notifications Data
const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Tournament Starting Soon!",
    description: "IPL 2025 kicks off tomorrow at 7:30 PM. Don’t miss it!",
    image: require("../../../assets/images/mi_logo.png"),
    timestamp: Date.now() - 3600000,
    type: "tournament",
  },
  {
    id: "2",
    title: "Match Result",
    description: "CSK defeated MI by 5 wickets in yesterday’s match.",
    image: require("../../../assets/images/csk_logo.jpg"),
    timestamp: Date.now() - 7200000,
    type: "match",
  },
  {
    id: "3",
    title: "Upcoming Match Alert",
    description: "RCB vs KKR starts tonight at 7:30 PM.",
    image: require("../../../assets/images/rcb_logo.jpg"),
    timestamp: Date.now() - 1800000,
    type: "match",
  },
];

// Function to get time ago
const getTimeAgo = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  return minutes < 60 ? `${minutes}m ago` : `${hours}h ago`;
};

export default function NotificationsScreen() {
  const [notifications] = useState<NotificationItem[]>(initialNotifications);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: lightGray }}>
      <StatusBar barStyle="dark-content" backgroundColor={white} />

      {/* Header */}
      <View
        style={{
          backgroundColor: white,
          borderBottomWidth: 1,
          borderBottomColor: lightGray,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color={primaryPurple} />
        </TouchableOpacity>
        <AppText style={{ fontSize: 24, fontWeight: "bold", color: primaryPurple }}>
          Notifications
        </AppText>
        <Ionicons name="notifications" size={28} color={primaryPurple} />
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
        ListEmptyComponent={
          <AppText style={{ textAlign: "center", color: "#9ca3af", marginTop: 40 }}>
            No notifications yet.
          </AppText>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: white,
              padding: 12,
              marginHorizontal: 10,
              marginVertical: 6,
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              gap: 12,
            }}
          >
            {/* Icon / Image */}
            <Image
              source={item.image}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                borderColor: lightPurple,
                borderWidth: 2,
              }}
            />

            {/* Text */}
            <View style={{ flex: 1 }}>
              <AppText style={{ fontWeight: "bold", fontSize: 16, color: black }}>
                {item.title}
              </AppText>
              <AppText style={{ fontSize: 14, color: black }}>
                {item.description}
              </AppText>
              <AppText style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                {getTimeAgo(item.timestamp)}
              </AppText>
            </View>

            {/* Type Icon */}
            <Ionicons
              name={item.type === "match" ? "trophy-outline" : "calendar-outline"}
              size={24}
              color={primaryPurple}
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
