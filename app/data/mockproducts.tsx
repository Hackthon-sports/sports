 export type Product = {
    id:string;
    title:string;
    price:string;
    oldPrice?:string;
    discount?:string;
    location:string;
    image: any;

    freeDelivery?: boolean;

 };
 const glovesImage = require('../../assets/images/gloves.png');
 const batImage  = require('../../assets/images/bat1.png');
 const footballImage = require('../../assets/images/football.png');
 const shoesImage = require('../../assets/images/shoes.png');
 const padsImage = require('../../assets/images/pads.png');
 const helmetImage = require('../../assets/images/helmet.png');
 const cricketballImage = require('../../assets/images/cricketball.png');
 const tshirtImage = require('../../assets/images/tshirt.png');
 const sampleProducts: Product[] = [
     {
         id: '1',
         title: 'Cricket Bat',
         price: '600',
         oldPrice: '1200',
         discount: '50%',
         location: 'Hyderabad',
         image: batImage,
         freeDelivery: true,
     },
     {
         id: '2',
         title: 'Gloves',
         price: '700',
         oldPrice: '2499',
         discount: '28%',
         location: 'Bangalore',
         image: glovesImage,

         freeDelivery: false,
     },
     {
         id: '3',
         title: 'Foot Ball',
         price: '300',
         oldPrice: '600',
         discount: '50%',
         location: 'Mumbai',
         image: footballImage,

         freeDelivery: true,
     },
     {
         id: '4',
         title: 'Sports Shoes',
         price: '799',
         oldPrice: '1599',
         discount: '50%',
         location: 'Delhi',
         image: shoesImage,

         freeDelivery: true,
     },
     {
         id: '5',
         title: 'pads',
         price: '400',
         oldPrice: '800',
         discount: '50%',
         location: 'Bhimavaram',
         image: padsImage,

         freeDelivery: true,
     },
     {
         id: '6',
         title: 'Helmet',
         price: '799',
         oldPrice: '1599',
         discount: '50%',
         location: 'Srikakulam',
         image: helmetImage ,

         freeDelivery: true,
     },
     {
         id: '7',
         title: 'Cricket Ball',
         price: '100',
         oldPrice: '400',
         discount: '75%',
         location: 'vishakapatnam',
         image:  cricketballImage,

         freeDelivery: true,
     },
     {
         id: '8',
         title: 'Jersey',
         price: '150',
         oldPrice: '400',
         discount: '70%',
         location: 'palasa',
         image:  tshirtImage,

         freeDelivery: true,
     },
     // Add more sample products if you like
 ];
 export default sampleProducts;


