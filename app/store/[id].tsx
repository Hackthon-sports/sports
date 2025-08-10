import { Product, useStore ,useCartStore} from '@/store'; // Zustand store to get dynamic products
import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import mockProducts from '../data/mockproducts';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userProducts = useStore((state) => state.products);
  const addToCart = useCartStore((state)=> state.addToCart);

  const allProducts: Product[] = [...mockProducts, ...userProducts];
  const product: Product | undefined = allProducts.find(
      (item) => String(item.id) === String(id)
  );

  if (!product) {
    return (
        <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-xl font-semibold text-red-500">Product not found</Text>
        </View>
    );
  }

  return (
      <ScrollView className="bg-white">
        {/* Product Image */}
        {product.image && (
            <Image
                source={typeof product.image === 'string' ? { uri: product.image } : product.image}
                className="w-full h-72 rounded-b-2xl"
                resizeMode="cover"
            />
        )}

        {/* Product Details */}
        <View className="p-4">
          <Text className="text-2xl font-bold text-black">{product.title}</Text>

          {/* Price & Discount */}
          <View className="flex-row items-center gap-2 mt-2">
            <Text className="text-lg font-semibold text-green-700">₹{product.price}</Text>
            {product.oldPrice && (
                <Text className="text-base text-gray-500 line-through">₹{product.oldPrice}</Text>
            )}
            {product.discount && (
                <Text className="text-sm text-red-600 font-semibold">{product.discount} OFF</Text>
            )}
          </View>

          {/* Other Info */}
          <Text className="mt-3 text-gray-700">Location: {product.location || 'N/A'}</Text>
          
         

          {/* Book Now Button */}
          <TouchableOpacity
              className="mt-6 bg-violet-500 py-3 rounded-xl"
              onPress={() => alert('Your contact details have been shared!')}
          >
            <Text className="text-white text-center text-lg font-semibold">Chat</Text>
           </TouchableOpacity>
           <TouchableOpacity
              className="mt-6 bg-violet-500 py-3 rounded-xl"
              onPress= {() =>{
                addToCart(product);
                alert('Item added to cart')
              }

               }
          >
            <Text className="text-white text-center text-lg font-semibold">Add to cart</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>
  );
}
