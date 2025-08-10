import ProductList from '@/components/ProductList';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StoreHome = () => {
    return (
        <View className="flex-1 bg-white mt-6 pt-25 relative">

            <TouchableOpacity
                className="bg-violet-100 p-3 rounded-lg border border-violet-600 m-4"
                onPress={() => router.push('/store/search')}
            >
                <Text className="text-violet-900 font-normal">Search products</Text>
            </TouchableOpacity>
           
     <View className="flex-row items-center justify-end pr-6 gap-4">
  <TouchableOpacity onPress={() => router.push('/store/myProducts')}>
    <Feather name="shopping-bag" size={25} color="#6D28D9" />
  </TouchableOpacity>

  <TouchableOpacity onPress={() => router.push('/store/Cart')}>
      <MaterialCommunityIcons name="cart" size={25} color="#6D28D9" />

  </TouchableOpacity>
</View>




           
            <View className="p-4">
                <Text className="text-violet-400 font-bold text-2xl">Explore Products</Text>
            </View>

            <ProductList />

            <TouchableOpacity
                onPress={() => router.push('/store/sell')}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-violet-400 w-28 h-12 rounded-3xl flex-row items-center justify-center border border-violet-600 shadow-xl z-50"
            >
                <Text className="text-white font-semibold text-lg ml-1">SELL</Text>
            </TouchableOpacity>
        </View>
    );
};

export default StoreHome;
