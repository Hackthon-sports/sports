// pages/MyProducts.tsx
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/store';
import { FlatList, Text, View } from 'react-native';


const MyProducts = () => {
  const addedProducts = useStore((state) => state.addedProducts);
  const removeProduct = useStore((state) => state.removeProduct);

  if (addedProducts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500 text-base">No products added yet.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 pt-4 bg-white">
      <View className="mt-4">
        <Text className="text-violet-500 font-bold text-center mb-6 text-2xl">My Products</Text>
        <FlatList
          data={addedProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <ProductCard
            key ={item.id}
              product={item}
              showRemoveButton={true}
              onRemove={() => removeProduct(item.id)}
            />
          )}
        />
      </View>
    </View>
  );
};

export default MyProducts;
