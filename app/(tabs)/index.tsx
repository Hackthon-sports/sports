import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Pressable, SafeAreaView, Text, View } from 'react-native'

const Home = () => {
  return (
      <SafeAreaView className="flex-1">
          <View className="flex-1  bg-white ">
              <View className="h-[10%] w-full bg-white flex-row items-center justify-between px-5 space-x-1 mt-4 ">
                  <Pressable><Text><Ionicons name="menu-outline" size={24} color='#7C3AED'/></Text> </Pressable>
                  <Text className="text-violet-600 text-xl font-bold">SportsHub</Text>
                  <View className="w-[20%] flex flex-row justify-between">
                      <Pressable><Text><Ionicons name="notifications-outline" size={24} color='#7C3AED'/></Text></Pressable>
                      <Pressable><Text><Ionicons name="search-outline" size={24} color='#7C3AED'/></Text></Pressable>
                  </View>
              </View>
              <View className="flex-1 items-center justify-center">
                  <Text className="text-xl font-semibold text-violet-600">Welcome to SportsHub!</Text>
              </View>
          </View>
      </SafeAreaView>

  )
}

export default Home

