import { View, Text, FlatList, Image, TouchableOpacity, StatusBar, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

// Enhanced mockPosts data with more engaging content
const mockPosts = [
  {
    id: "1",
    user: "csk_official",
    userImage: require("../../assets/images/csk_logo.jpg"),
    image: require("../../assets/images/csk_logo.jpg"),
    caption: "Training hard for the next match! 💪 #WhistlePodu #Yellove",
    timestamp: Date.now() - 3600000,
    likes: 1243,
    comments: 128,
    views: 4567,
    isLiked: false,
    isSaved: false,
    isFollowing: false,
    highlights: ["🏏 Dhoni hitting sixes", "🔥 Jadeja's fielding magic", "💛 Team bonding"]
  },
  {
    id: "2",
    user: "royalchallengers",
    userImage: require("../../assets/images/rcb_logo.jpg"),
    image: require("../../assets/images/rcb_logo.jpg"),
    caption: "Game face on! 🔥 #PlayBold #RCB",
    timestamp: Date.now() - 7200000,
    likes: 892,
    comments: 56,
    views: 3210,
    isLiked: true,
    isSaved: true,
    isFollowing: true,
    highlights: ["🌟 Kohli's classic cover drive", "⚡ Siraj's fiery spell", "❤️ Fan meetup"]
  },
];

const getTimeAgo = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  if (minutes < 60) return `${minutes}m`;
  return `${hours}h`;
};

// Color palette
const appPurple = "#6b46c1";
const appRed = "#ef4444";
const appBlue = "#3b82f6";
const grayText = "#666";
const darkText = "#1a1a1a";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Enhanced Header with search and more actions */}
      <View className="bg-white border-b border-gray-200 pb-2">
        <View className="flex-row justify-between items-center px-4 py-4 mt-8">
          <Text className="text-3xl font-extrabold" style={{ color: appPurple }}>Sports</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity className="p-1">
              <Ionicons name="search-outline" size={28} color={appPurple} />
            </TouchableOpacity>
            <TouchableOpacity className="p-1">
              <Ionicons name="notifications-outline" size={28} color={appPurple} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Stories/Highlights row would go here */}
      </View>

      {/* Enhanced Posts Feed */}
      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View className="mb-6 bg-white rounded-lg overflow-hidden" style={{ 
            width: width - 8,
            marginHorizontal: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            {/* Enhanced Post Header */}
            <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
              <View className="flex-row items-center space-x-3">
                <Image
                  source={item.userImage}
                  className="w-10 h-10 rounded-full border-2"
                  style={{ borderColor: appPurple }}
                />
                <View>
                  <Text className="font-bold text-base" style={{ color: darkText }}>{item.user}</Text>
                  <Text className="text-xs text-gray-500">{getTimeAgo(item.timestamp)} ago</Text>
                </View>
              </View>
              <View className="flex-row items-center space-x-2">
                <TouchableOpacity className="p-1">
                  <Ionicons name="ellipsis-horizontal" size={20} color={grayText} />
                </TouchableOpacity>
                <TouchableOpacity 
                  className={`px-4 py-1 rounded-full ${item.isFollowing ? 'bg-gray-100' : 'bg-purple-50'}`}
                  style={{ borderWidth: 1, borderColor: item.isFollowing ? '#ddd' : appPurple }}
                >
                  <Text className={`text-sm font-semibold ${item.isFollowing ? 'text-gray-800' : ''}`} style={{ color: item.isFollowing ? grayText : appPurple }}>
                    {item.isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Post Image with engagement overlay */}
            <View className="relative">
              <Image
                source={item.image}
                className="w-full aspect-square"
                resizeMode="cover"
              />
              <View className="absolute bottom-2 left-2 bg-black/50 rounded-full px-2 py-1 flex-row items-center">
                <Ionicons name="eye" size={14} color="white" />
                <Text className="text-white text-xs ml-1">{item.views.toLocaleString()}</Text>
              </View>
            </View>

            {/* Action Buttons with more visual feedback */}
            <View className="px-4 pt-3 pb-2">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row space-x-6">
                  {/* Like Button with animation trigger */}
                  <TouchableOpacity 
                    className="flex-row items-center space-x-1 active:opacity-70"
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={item.isLiked ? "heart" : "heart-outline"}
                      size={26}
                      color={item.isLiked ? appRed : darkText}
                    />
                    <Text className="text-sm font-medium" style={{ color: darkText }}>
                      {item.likes > 0 ? item.likes.toLocaleString() : 'Like'}
                    </Text>
                  </TouchableOpacity>
                  
                  {/* Comment Button */}
                  <TouchableOpacity className="flex-row items-center space-x-1 active:opacity-70">
                    <Ionicons
                      name="chatbubble-outline"
                      size={24}
                      color={darkText}
                    />
                    <Text className="text-sm font-medium" style={{ color: darkText }}>
                      {item.comments > 0 ? item.comments.toLocaleString() : 'Comment'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {/* Save and Share Buttons */}
                <View className="flex-row space-x-4">
                  <TouchableOpacity activeOpacity={0.7}>
                    <Ionicons
                      name="paper-plane-outline"
                      size={24}
                      color={darkText}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Ionicons
                      name={item.isSaved ? "bookmark" : "bookmark-outline"}
                      size={24}
                      color={item.isSaved ? appPurple : darkText}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Enhanced Caption with hashtag highlighting */}
              <Text className="text-base mb-2" style={{ color: darkText }}>
                <Text className="font-bold">{item.user}</Text> {item.caption.split(' ').map((word, i) => 
                  word.startsWith('#') ? 
                  <Text key={i} style={{ color: appBlue }}>{word} </Text> : 
                  <Text key={i}>{word} </Text>
                )}
              </Text>
              
              {/* Post Highlights */}
              {item.highlights && (
                <View className="mb-2">
                  <Text className="text-sm font-semibold mb-1" style={{ color: appPurple }}>Match Highlights</Text>
                  <View className="flex-row flex-wrap">
                    {item.highlights.map((highlight, index) => (
                      <View key={index} className="bg-purple-50 rounded-full px-3 py-1 mr-2 mb-2">
                        <Text className="text-xs" style={{ color: appPurple }}>{highlight}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              {/* View all comments prompt */}
              <TouchableOpacity className="mt-1">
                <Text className="text-sm text-gray-500">
                  View all {item.comments} comments
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      
      {/* Bottom Navigation would go here */}
    </View>
  );
}