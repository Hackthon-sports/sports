import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useCartStore } from '@/store';
import { useRouter } from 'expo-router';
import ProductCard from '@/components/ProductCard';

const Cart = () => {
  const cartItems = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const router = useRouter();

  if (cartItems.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500 text-base">Your cart is empty.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 pt-4 bg-white">
      <View className="mt-4">
        <Text className="text-violet-500 font-bold text-center mb-6 text-2xl">My Cart</Text>
        <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
      <ProductCard
      product={item}
      showRemoveButton={true}
      onRemove={() => removeFromCart(item.id)}
      />
       )}
       />

      </View>
    </View>
  );
};

export default Cart;
