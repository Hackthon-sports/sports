// components/ProductList.tsx

import { Product, useStore } from '@/store';
import React from 'react';
import { FlatList } from 'react-native';
import ProductCard from './ProductCard';

// ✅ correct

// Static images
const glovesImage = require('../assets/images/gloves.png');
const batImage = require('../assets/images/bat1.png');
const footballImage = require('../assets/images/football.png');
const shoesImage = require('../assets/images/shoes.png');
const padsImage = require('../assets/images/pads.png');
const helmetImage = require('../assets/images/helmet.png');
const cricketballImage = require('../assets/images/cricketball.png');
const tshirtImage = require('../assets/images/tshirt.png');



const sampleProducts: Product[] = [
    {
        id: '1',
        title: 'Cricket Bat',
        price: '600',
        oldPrice: '1200',
        discount: '50%',
        location: 'Hyderabad',
        image: batImage,
       
    },
    {
        id: '2',
        title: 'Gloves',
        price: '700',
        oldPrice: '2499',
        discount: '28%',
        location: 'Bangalore',
        image: glovesImage,
        
    },
    {
        id: '3',
        title: 'Foot Ball',
        price: '300',
        oldPrice: '600',
        discount: '50%',
        location: 'Mumbai',
        image: footballImage,
        
    },
    {
        id: '4',
        title: 'Sports Shoes',
        price: '799',
        oldPrice: '1599',
        discount: '50%',
        location: 'Delhi',
        image: shoesImage,
       
    },
    {
        id: '5',
        title: 'Pads',
        price: '400',
        oldPrice: '800',
        discount: '50%',
        location: 'Bhimavaram',
        image: padsImage,
        
    },
    {
        id: '6',
        title: 'Helmet',
        price: '799',
        oldPrice: '1599',
        discount: '50%',
        location: 'Srikakulam',
        image: helmetImage,
        
    },
    {
        id: '7',
        title: 'Cricket Ball',
        price: '100',
        oldPrice: '400',
        discount: '75%',
        location: 'Vishakapatnam',
        image: cricketballImage,
        
    },
    {
        id: '8',
        title: 'Jersey',
        price: '150',
        oldPrice: '400',
        discount: '70%',
        location: 'Palasa',
        image: tshirtImage,
        
    },
];

const ProductList = () => {
    const { products } = useStore(); // ✅ from zustand
    // const allProducts : Product[] = sampleProducts;
    

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            // @ts-ignore
            renderItem={({ item }) => <ProductCard product={item} />}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
        />
    );
};

export default ProductList;

