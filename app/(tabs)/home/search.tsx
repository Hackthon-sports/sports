import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const primaryPurple = "#5c2a9a";

// Sample data
const posts = [
  {
    id: "1",
    user: "csk_official",
    userImage: require("../../../assets/images/csk_logo.jpg"),
    caption: "Training hard for the next match! 💪 #WhistlePodu #Yellove",
  },
  {
    id: "2",
    user: "mumbaiindians",
    userImage: require("../../../assets/images/mi_logo.png"),
    caption: "Getting ready for the season! 🏆 #MI #Cricket",
  },
  {
    id: "3",
    user: "royalchallengers",
    userImage: require("../../../assets/images/rcb_logo.jpg"),
    caption: "Game face on! 🔥 #PlayBold #RCB",
  },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const filtered = posts.filter((p) =>
    p.user.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      {/* Search Bar Row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f3f4f6",
          borderRadius: 999,
          paddingHorizontal: 10,
          marginBottom: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={primaryPurple} />
        </TouchableOpacity>

        <TextInput
          placeholder="Search by username..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          style={{
            flex: 1,
            paddingVertical: 8,
            fontFamily:
              Platform.OS === "ios"
                ? "Avenir-Heavy"
                : "sans-serif-condensed",
          }}
        />
      </View>

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#999", marginTop: 40 }}>
            No posts found
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            <Image
              source={item.userImage}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 12,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {item.user}
              </Text>
              <Text style={{ color: "#666" }} numberOfLines={1}>
                {item.caption}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
