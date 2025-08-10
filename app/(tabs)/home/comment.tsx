// app/components/CommentsBottomSheet.tsx
import React, { useCallback, useMemo, useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import BottomSheet, { BottomSheetFlatList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const primaryPurple = "#5c2a9a";
const lightGray = "#f3f4f6";
const white = "#ffffff";
const black = "#000000";
const currentUserBg = "#d9c2f0";
const otherUserBg = "#ffffff";

interface Comment {
  id: string;
  user: string;
  userImage: any;
  text: string;
  timestamp: number;
}

interface CommentsBottomSheetProps {
  postId: string | null;
  onClose: () => void;
}

const getTimeAgo = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  return minutes < 60 ? `${minutes}m ago` : `${hours}h ago`;
};

// Memoized CommentItem to prevent unnecessary re-renders
const CommentItem = React.memo(({ item }: { item: Comment }) => {
  const isCurrentUser = item.user === "you";
  return (
    <View style={{ flexDirection: isCurrentUser ? "row-reverse" : "row", paddingVertical: 8, paddingHorizontal: 12 }}>
      <Image
        source={item.userImage}
        style={{ width: 40, height: 40, borderRadius: 20, marginHorizontal: 8 }}
      />
      <View style={{ maxWidth: "75%", backgroundColor: isCurrentUser ? currentUserBg : otherUserBg, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 }}>
        {!isCurrentUser && (
          <Text style={{ fontWeight: "bold", color: black, marginBottom: 2 }}>{item.user}</Text>
        )}
        <Text style={{ color: black, fontSize: 15 }}>{item.text}</Text>
        <Text style={{ fontSize: 12, color: "#6b7280", textAlign: isCurrentUser ? "right" : "left", marginTop: 4 }}>
          {getTimeAgo(item.timestamp)}
        </Text>
      </View>
    </View>
  );
});

const CommentsBottomSheet = forwardRef(({ postId, onClose }: CommentsBottomSheetProps, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<any>(null);
  const router = useRouter();

  const [comments, setComments] = useState<Comment[]>([
    { id: "1", user: "satish", userImage: require("../../../assets/images/csk_logo.jpg"), text: "Great post! 🔥", timestamp: Date.now() - 60000 },
    { id: "2", user: "ram charan", userImage: require("../../../assets/images/mi_logo.png"), text: "Can’t wait for the next match!", timestamp: Date.now() - 120000 },
    { id: "3", user: "you", userImage: require("../../../assets/images/rcb_logo.jpg"), text: "Absolutely! This is going to be fun! 😄", timestamp: Date.now() - 30000 },
  ]);
  const [newComment, setNewComment] = useState("");
  const currentUser = "you";

  const snapPoints = useMemo(() => ['40%', '75%'], []);

  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.expand(),
    close: () => bottomSheetRef.current?.close(),
  }));

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      user: currentUser,
      userImage: require("../../../assets/images/rcb_logo.jpg"),
      text: newComment.trim(),
      timestamp: Date.now(),
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (flatListRef.current && comments.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [comments]);

  const renderCommentItem = useCallback(({ item }: { item: Comment }) => {
    return <CommentItem item={item} />;
  }, []);

  const renderHandle = () => (
    <View style={{ padding: 12, alignItems: 'center' }}>
      <View style={{ width: 40, height: 5, borderRadius: 2.5, backgroundColor: '#d1d5db' }} />
    </View>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      backgroundStyle={{ backgroundColor: "#fbfaff", borderRadius: 20 }}
      handleComponent={renderHandle}
    >
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: primaryPurple }}>
            Comments
          </Text>
          <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
            <Ionicons name="close-circle-outline" size={30} color={primaryPurple} />
          </TouchableOpacity>
        </View>

        {/* Comments List */}
        <BottomSheetFlatList
          ref={flatListRef}
          data={[...comments].sort((a, b) => b.timestamp - a.timestamp)}
          keyExtractor={(item) => item.id}
          renderItem={renderCommentItem}
          contentContainerStyle={{ paddingBottom: 10 }}
          keyboardShouldPersistTaps="handled"
        />

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={{ flexDirection: "row", alignItems: "center", padding: 8, backgroundColor: white }}>
            <BottomSheetTextInput
              placeholder="Add a comment..."
              placeholderTextColor="#9ca3af"
              style={{ flex: 1, backgroundColor: "#f8f8fa", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 }}
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity onPress={handleAddComment} style={{ marginLeft: 8, backgroundColor: primaryPurple, borderRadius: 20, padding: 8 }}>
              <Ionicons name="send" size={20} color={white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </BottomSheet>
  );
});

export default CommentsBottomSheet;
