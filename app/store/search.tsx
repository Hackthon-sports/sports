import ProductCard from '@/components/ProductCard';
import { Product, useStore } from '@/store';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const Search = (): React.ReactElement => {
  const products = useStore((state) => state.products) as Product[];
  const [searchText, setSearchText] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const trimmed = searchText.trim().toLowerCase();
    if (trimmed === '') {
      setFilteredProducts([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(trimmed) ||
      (product.description?.toLowerCase().includes(trimmed)) ||
      product.location.toLowerCase().includes(trimmed)
    );
    setFilteredProducts(filtered);
  }, [searchText, products]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const trimmed = text.trim();
    if (trimmed !== '' && !recentSearches.includes(trimmed)) {
      setRecentSearches((prev) => [trimmed, ...prev.slice(0, 4)]);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchText(search);
  };

  return (
    <SafeAreaView className="p-4 bg-white min-h-full">
      <TextInput
        className="border border-violet-500 rounded-md px-4 py-2 mb-4 text-base"
        placeholder="Search by product, location or description"
        value={searchText}
        autoFocus= {true}
        onChangeText={handleSearch}
      />

      {recentSearches.length > 0 && (
        <View className="mb-4">
          <Text className="font-bold text-lg mb-2 text-violet-500">Recent Searches:</Text>
          <View className="flex-row flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRecentSearchClick(search)}
                className="bg-gray-200 px-3 py-1 rounded-full"
              >
                <Text className="text-sm text-gray-700">{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View className="flex-wrap gap-3 flex-row pb-10">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id}  product={product} />
        ))}
        {searchText !== '' && filteredProducts.length === 0 && (
          <Text className="text-center text-gray-400 mt-10">No products found.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Search;
