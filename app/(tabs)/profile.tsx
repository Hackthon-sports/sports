import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // or any other icon lib

export default function ProfileScreen() {
  const navigation = useNavigation();

  const posts = [
    require('../../assets/images/rcb_logo.jpg'),
    require('../../assets/images/rcb_logo.jpg'),
    require('../../assets/images/rcb_logo.jpg'),
    require('../../assets/images/rcb_logo.jpg'),
    require('../../assets/images/rcb_logo.jpg'),
    require('../../assets/images/rcb_logo.jpg'),
  ];

  return (
    <ScrollView className="flex-1 bg-black px-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mt-4">
        <Text className="text-white text-lg font-bold">sai_prasanth1234</Text>
        <View className="flex-row space-x-4 items-center">
          <Ionicons name="timer-outline" size={24} color="white" />
          <Ionicons name="add-outline" size={24} color="white" />
        </View>
      </View>

      {/* Profile Info */}
      <View className="flex-row items-center mt-6">
        <View className="items-center">
          <Image source={require('../../assets/images/rcb_logo.jpg')} className="w-20 h-20 rounded-full" />
        </View>
        <View className="flex-row justify-around flex-1">
          <View className="items-center">
            <Text className="text-white font-bold text-lg">5</Text>
            <Text className="text-white">Posts</Text>
          </View>
          <View className="items-center">
            <Text className="text-white font-bold text-lg">142</Text>
            <Text className="text-white">Followers</Text>
          </View>
          <View className="items-center">
            <Text className="text-white font-bold text-lg">155</Text>
            <Text className="text-white">Following</Text>
          </View>
        </View>
      </View>

      {/* Name */}
      <Text className="text-white font-bold mt-2">sai prasanth</Text>

      {/* Buttons */}
      <View className="flex-row space-x-2 mt-4">
        <TouchableOpacity className="flex-1 bg-neutral-800 py-1.5 rounded-md">
          <Text className="text-white text-center font-semibold">Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-neutral-800 py-1.5 rounded-md">
          <Text className="text-white text-center font-semibold">Share Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-8 bg-neutral-800 py-1.5 rounded-md items-center justify-center">
          <Ionicons name="person-add-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Highlights */}
      <ScrollView horizontal className="mt-6" showsHorizontalScrollIndicator={false}>
        {['New', 'CRICKET', 'MOVIES', 'FRIENDS'].map((item, index) => (
          <View key={index} className="items-center mr-4">
            <View className="w-16 h-16 rounded-full bg-neutral-700 items-center justify-center">
              <Ionicons name="add" size={24} color="white" />
            </View>
            <Text className="text-white text-xs mt-1">{item}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Tabs */}
      <View className="flex-row justify-around mt-6 border-t border-neutral-700 pt-2">
        <Ionicons name="grid-outline" size={24} color="white" />
        <Ionicons name="film-outline" size={24} color="white" />
        <Ionicons name="person-circle-outline" size={24} color="white" />
      </View>

      {/* Posts Grid */}
      <View className="flex-row flex-wrap mt-2 justify-between">
        {posts.map((post, index) => (
          <Image
            key={index}
            source={post}
            className="w-[32%] h-32 m-0.5 rounded-sm"
            resizeMode="cover"
          />
        ))}
      </View>
    </ScrollView>
  );
}