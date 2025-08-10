import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system'; // <-- New import
import { SafeAreaView } from "react-native-safe-area-context";
import CommentsBottomSheet from "./comment";

const { width } = Dimensions.get("window");

interface Post {
  id: string;
  user: string;
  userImage: number;
  image?: any;
  video?: number;
  caption: string;
  timestamp: number;
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
}

interface AppTextProps {
  style?: any;
  children: React.ReactNode;
}

const initialPosts: Post[] = [
  {
    id: "1",
    user: "csk_official",
    userImage: require("../../../assets/images/csk_logo.jpg"),
    image: require("../../../assets/images/csk_logo.jpg"),
    caption: "Training hard for the next match! 💪 #WhistlePodu #Yellove",
    timestamp: Date.now() - 3600000,
    likes: 1243,
    comments: 128,
    views: 4567,
    isLiked: false,
    isSaved: false,
    isFollowing: false,
  },
  {
    id: "3",
    user: "mumbaiindians",
    userImage: require("../../../assets/images/mi_logo.png"),
    video: require("../../../assets/videos/college.mp4"),
    caption: "Getting ready for the season! 🏆 #MI #Cricket",
    timestamp: Date.now() - 5400000,
    likes: 1560,
    comments: 210,
    views: 8900,
    isLiked: false,
    isSaved: false,
    isFollowing: false,
  },
  {
    id: "2",
    user: "royalchallengers",
    userImage: require("../../../assets/images/rcb_logo.jpg"),
    image: require("../../../assets/images/rcb_logo.jpg"),
    caption: "Game face on! 🔥 #PlayBold #RCB",
    timestamp: Date.now() - 7200000,
    likes: 892,
    comments: 56,
    views: 3210,
    isLiked: true,
    isSaved: true,
    isFollowing: true,
  },
  {
    id: "4",
    user: "royalchallengers",
    userImage: require("../../../assets/images/rcb_logo.jpg"),
    image: require("../../../assets/images/rcb_logo.jpg"),
    caption: "Game face on! 🔥 #PlayBold #RCB",
    timestamp: Date.now() - 7200000,
    likes: 892,
    comments: 56,
    views: 3210,
    isLiked: true,
    isSaved: true,
    isFollowing: true,
  },
];

const getTimeAgo = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  return minutes < 60 ? `${minutes}m` : `${hours}h`;
};

const primaryPurple = "#5c2a9a";
const lightPurple = "#8b5cf6";
const white = "#ffffff";
const black = "#000000";
const lightGray = "#f3f4f6";
const red = "#ef4444";

const AppText = ({ style, ...props }: AppTextProps) => {
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
    />
  );
};

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [videoStatus, setVideoStatus] = useState<{
    [key: string]: { isMuted: boolean; hasEnded: boolean };
  }>({});

  const commentsBottomSheetRef = useRef<any>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const openComments = (postId: string) => {
    setSelectedPostId(postId);
    commentsBottomSheetRef.current?.open();
  };

  const closeComments = () => {
    setSelectedPostId(null);
    commentsBottomSheetRef.current?.close();
  };

  // Corrected sharePost function using FileSystem
  const sharePost = async (post: Post) => {
    if (!(await Sharing.isAvailableAsync())) {
      console.log('Sharing is not available on this device.');
      return;
    }

    try {
      let contentToShare = {
        message: `${post.user} shared: "${post.caption}" on Sports Hub.`,
      };

      let fileUri;

      if (post.image || post.video) {
        // Resolve the asset source to get the development server URI (http://...)
        const assetSource = Image.resolveAssetSource(post.image || post.video);
        const remoteUri = assetSource.uri;
        
        // Define a local file path to download the asset to
        const localFileName = post.image ? `post_${post.id}.jpg` : `post_${post.id}.mp4`;
        const localUri = FileSystem.cacheDirectory + localFileName;

        // Download the file from the remote URI to the local cache directory
        await FileSystem.downloadAsync(remoteUri, localUri);
        fileUri = localUri;
      }

      if (fileUri) {
        // Share the locally downloaded file
        await Sharing.shareAsync(fileUri, {
          dialogTitle: 'Share this post',
          ...contentToShare,
        });
      } else {
        // Fallback to sharing only the message if no media is found
        await Share.share(contentToShare);
      }

    } catch (error: any) {
      console.error("Error sharing:", error.message);
    }
  };

  const lastTap = useRef<{ [key: string]: number | null }>({});
  const videoRefs = useRef<{ [key: string]: Video | null }>({});

  const [likedPostId, setLikedPostId] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const handleDoubleTap = (postId: string) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTap.current[postId] && now - lastTap.current[postId]! < DOUBLE_PRESS_DELAY) {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            if (post.isLiked) return post;
            return {
              ...post,
              isLiked: true,
              likes: post.likes + 1,
            };
          }
          return post;
        })
      );

      setLikedPostId(postId);
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start(() => setLikedPostId(null));
      });
      lastTap.current[postId] = null;
    } else {
      lastTap.current[postId] = now;
    }
  };

  const toggleMute = (postId: string) => {
    const current = videoStatus[postId]?.isMuted ?? true;
    setVideoStatus((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        isMuted: !current,
      },
    }));
  };

  const replayVideo = (postId: string) => {
    const videoRef = videoRefs.current[postId];
    if (videoRef) {
      videoRef.replayAsync().then(() => {
        setVideoStatus((prev) => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            hasEnded: false,
          },
        }));
      });
    }
  };

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const toggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  const toggleFollow = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, isFollowing: !post.isFollowing } : post
      )
    );
  };

  const filteredPosts = posts.filter((post) =>
    post.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMedia = (item: Post) => {
    const status = videoStatus[item.id] || { isMuted: true, hasEnded: false };
    const isAnimating = likedPostId === item.id;

    if (item.image) {
      return (
        <TouchableWithoutFeedback onPress={() => handleDoubleTap(item.id)}>
          <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
            <Image
              source={item.image}
              style={{ width: "100%", aspectRatio: 1, resizeMode: "cover" }}
            />
            {isAnimating && (
              <Animated.View
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  top: "40%",
                  transform: [{ scale: scaleAnim }],
                  opacity: scaleAnim,
                }}
                pointerEvents="none"
              >
                <Ionicons
                  name="heart"
                  size={100}
                  color="rgba(239,68,68,0.85)"
                  style={{ textShadowColor: "rgba(0,0,0,0.3)", textShadowRadius: 10 }}
                />
              </Animated.View>
            )}
          </View>
        </TouchableWithoutFeedback>
      );
    } else if (item.video) {
      return (
        <View style={{ position: "relative" }}>
          <TouchableWithoutFeedback onPress={() => handleDoubleTap(item.id)}>
            <Video
              ref={(ref) => {
                videoRefs.current[item.id] = ref;
              }}
              source={item.video}
              style={{ width: "100%", aspectRatio: 1 }}
              resizeMode={ResizeMode.CONTAIN}
              isMuted={status.isMuted}
              shouldPlay={!status.hasEnded}
              isLooping={false}
              onPlaybackStatusUpdate={(playbackStatus) => {
                if (!playbackStatus.isLoaded) return;
                if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                  setVideoStatus((prev) => ({
                    ...prev,
                    [item.id]: { ...prev[item.id], hasEnded: true },
                  }));
                }
              }}
              onError={(e) => console.log("Video error:", e)}
            />
          </TouchableWithoutFeedback>

          {isAnimating && (
            <Animated.View
              style={{
                position: "absolute",
                alignSelf: "center",
                top: "40%",
                transform: [{ scale: scaleAnim }],
                opacity: scaleAnim,
              }}
              pointerEvents="none"
            >
              <Ionicons
                name="heart"
                size={100}
                color="rgba(239,68,68,0.85)"
                style={{ textShadowColor: "rgba(0,0,0,0.3)", textShadowRadius: 10 }}
              />
            </Animated.View>
          )}

          <TouchableOpacity
            onPress={() => toggleMute(item.id)}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "rgba(0,0,0,0.4)",
              padding: 8,
              borderRadius: 999,
            }}
          >
            <Ionicons
              name={status.isMuted ? "volume-mute" : "volume-high"}
              size={24}
              color={white}
            />
          </TouchableOpacity>

          {status.hasEnded && (
            <TouchableOpacity
              onPress={() => replayVideo(item.id)}
              style={{
                position: "absolute",
                top: "40%",
                alignSelf: "center",
                backgroundColor: "rgba(0,0,0,0.4)",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <AppText style={{ color: white, fontWeight: "bold" }}>
                Watch Again
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: lightGray }}>
      <StatusBar barStyle="dark-content" backgroundColor={white} />

      <View
        style={{
          backgroundColor: white,
          borderBottomWidth: 1,
          borderBottomColor: lightGray,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <AppText
            style={{ fontSize: 24, fontWeight: "bold", color: primaryPurple }}
          >
            Sports Hub
          </AppText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() => router.push("/(tabs)/home/search")}
            >
              <Ionicons name="search" size={26} color={primaryPurple} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/home/notifications")}
            >
              <Ionicons name="notifications" size={26} color={primaryPurple} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}
        ListEmptyComponent={
          <AppText
            style={{ textAlign: "center", color: "#9ca3af", marginTop: 40 }}
          >
            No posts found.
          </AppText>
        }
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 16,
              borderRadius: 8,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
              width: width - 20,
              marginHorizontal: 10,
              backgroundColor: white,
              height: "auto",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 6,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <Image
                  source={item.userImage}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 24,
                    borderColor: lightPurple,
                    borderWidth: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <View>
                  <AppText
                    style={{ fontWeight: "bold", fontSize: 14, color: black }}
                  >
                    {item.user}
                  </AppText>
                  <AppText style={{ fontSize: 10, color: black }}>
                    {getTimeAgo(item.timestamp)} ago
                  </AppText>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: item.isFollowing ? lightGray : primaryPurple,
                }}
                onPress={() => toggleFollow(item.id)}
              >
                <AppText
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: item.isFollowing ? black : white,
                  }}
                >
                  {item.isFollowing ? "Following" : "Follow"}
                </AppText>
              </TouchableOpacity>
            </View>

            {renderMedia(item)}

            <View style={{ padding: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <View style={{ flexDirection: "row", gap: 24 }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                    onPress={() => toggleLike(item.id)}
                  >
                    <Ionicons
                      name={item.isLiked ? "heart" : "heart-outline"}
                      size={28}
                      color={item.isLiked ? red : black}
                    />
                    <AppText
                      style={{ fontWeight: "bold", fontSize: 14, color: black }}
                    >
                      {item.likes > 0 ? item.likes.toLocaleString() : "Like"}
                    </AppText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                    onPress={() => openComments(item.id)}
                  >
                    <Ionicons name="chatbubble-outline" size={28} color={black} />
                    <AppText
                      style={{ fontWeight: "bold", fontSize: 14, color: black }}
                    >
                      {item.comments > 0
                        ? item.comments.toLocaleString()
                        : "Comment"}
                    </AppText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => sharePost(item)}
                  >
                    <Ionicons name="paper-plane-outline" size={28} color={black} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity activeOpacity={0.7} onPress={() => toggleSave(item.id)}>
                  <Ionicons
                    name={item.isSaved ? "bookmark" : "bookmark-outline"}
                    size={28}
                    color={item.isSaved ? primaryPurple : black}
                  />
                </TouchableOpacity>
              </View>

              <AppText style={{ fontSize: 16, color: black, lineHeight: 22 }}>
                <AppText style={{ fontWeight: "bold" }}>{item.user}</AppText>{" "}
                {item.caption.split(" ").map((word, i) =>
                  word.startsWith("#") ? (
                    <AppText key={i} style={{ color: primaryPurple }}>
                      {word}{" "}
                    </AppText>
                  ) : (
                    <AppText key={i}>{word} </AppText>
                  )
                )}
              </AppText>
            </View>
          </View>
        )}
      />
      <CommentsBottomSheet
        ref={commentsBottomSheetRef}
        postId={selectedPostId}
        onClose={closeComments}
      />
    </SafeAreaView>
  );
}