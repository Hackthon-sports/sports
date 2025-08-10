import { useStore } from '@/store';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
 // ✅ Updated import from 'react-native-uuid'
 import 'react-native-get-random-values';

const Sell = () => {
    const addProduct = useStore((state) => state.addProduct);

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [location, setLocation] = useState('');
    const [brand, setBrand] = useState('');
    const [size, setSize] = useState('');
    const [length, setLength] = useState('');
    const [features, setFeatures] = useState('');
    const [imageUri, setImageUri] = useState('');

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        if (!title || !price || !location || !imageUri) {
            alert('Please fill all required fields and select an image.');
            return;
        }

        const newProduct = {
           id: uuidv4(), // ✅ Use universally unique ID
            title,
            price,
            oldPrice,
            location,
            image: imageUri,
            freeDelivery: true,
            brand,
            size,
            length,
            features,
        };

        addProduct(newProduct);

        // Clear the form
        setTitle('');
        setPrice('');
        setOldPrice('');
        setLocation('');
        setBrand('');
        setSize('');
        setLength('');
        setFeatures('');
        setImageUri('');

        alert('Product posted successfully!');
        
        router.replace('/store/myProducts')

    };

    return (
        <ScrollView className="p-4 mt-6 mb-4 bg-white">
            <Text className="text-2xl font-bold mb-4 text-violet-500 text-center">Sell a Product</Text>

            <TextInput
                className="border border-violet-500 bg-violet-100 rounded-xl p-3 mb-3"
                placeholder="Title *"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                className="border border-violet-500 bg-violet-100 rounded-xl p-3 mb-3"
                placeholder="Price *"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
            />

            <TextInput
                className="border border-violet-500 bg-violet-100 rounded-xl p-3 mb-3"
                placeholder="Old Price (optional)"
                value={oldPrice}
                onChangeText={setOldPrice}
                keyboardType="numeric"
            />

            <TextInput
                className="border border-violet-500 bg-violet-100 rounded-xl p-3 mb-3"
                placeholder="Location *"
                value={location}
                onChangeText={setLocation}
            />

            <TextInput
                className="border border-violet-500 bg-violet-100 rounded-xl p-3 mb-3"
                placeholder="Brand (optional)"
                value={brand}
                onChangeText={setBrand}
            />

            <TextInput
                className="border border-violet-500 bg-violet-100 rounded-xl p-3 mb-3"
                placeholder="Size (optional)"
                value={size}
                onChangeText={setSize}
            />

            <TextInput
                className="border border-violet-500 bg-violet-100 rounded-xl p-3 mb-3"
                placeholder="Length (optional)"
                value={length}
                onChangeText={setLength}
            />

            <TextInput
                className="border border-violet-500 bg-violet-100 rounded-xl p-3 mb-3"
                placeholder="Special Features (optional)"
                value={features}
                onChangeText={setFeatures}
            />

            <TouchableOpacity
                className="bg-violet-500 p-3 rounded-xl mb-4"
                onPress={pickImage}
            >
                <Text className="text-white text-center font-semibold">Add Image</Text>
            </TouchableOpacity>

            {imageUri !== '' && (
                <Image
                    source={{uri: imageUri}}
                    className="w-full h-64 rounded-xl mb-4"
                    resizeMode="cover"
                />
            )}

            <TouchableOpacity
                className="bg-violet-500 p-3 rounded-xl"
                onPress={handleSubmit}
            >
                <Text className="text-white text-center font-semibold">Post Product</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Sell;
