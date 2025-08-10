import { Product } from '@/store';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // ✅ Import Ionicons

interface ProductCardProps {
  product: Product;
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

const ProductCard = ({ product, showRemoveButton = false, onRemove }: ProductCardProps) => {
  const router = useRouter();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this product on our app:\n\n${product.title} - ₹${product.price}\n\nLocation: ${product.location}\n\nView here: https://yourstore.com/product/${product.id}`,
      });
    } catch (error: any) {
      console.error('Error sharing product:', error.message);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/store/${product.id}`)}
      activeOpacity={0.9}
      className="w-[47%] bg-white rounded-2xl shadow-md border border-gray-100 px-3 py-2 mb-4"
    >
      {/* Image Section with Share Icon */}
      <View className="relative items-center">
        <Image
          source={
            typeof product.image === 'string'
              ? { uri: product.image }
              : product.image
          }
          className="h-[100px] w-[100px] rounded-lg"
        />

        {/* 🔗 Share Icon - Positioned at top-right */}
        <TouchableOpacity
          onPress={handleShare}
          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
        >
          <Ionicons name="share-social-outline" size={18} color="#CF9FFF" />
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View className="mt-2">
        <Text className="text-base font-semibold text-black" numberOfLines={1}>
          {product.title}
        </Text>

        {/* Price Row */}
        <View className="flex-row items-center space-x-1 mt-1">
          <Text className="text-sm font-bold text-green-600">₹{product.price}</Text>
          {product.oldPrice && (
            <Text className="text-xs line-through text-gray-400">₹{product.oldPrice}</Text>
          )}
        </View>

        {/* Location */}
        <Text className="text-xs text-gray-500 mt-0.5">{product.location}</Text>

        {/* 🗑️ Remove Button (optional) */}
        {showRemoveButton && (
          <TouchableOpacity
            onPress={onRemove}
            className="mt-2 bg-red-500 px-2 py-1 rounded-md self-start"
          >
            <Text className="text-white text-xs">Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
