import { create } from 'zustand';
import mockProducts from '../app/data/mockproducts';

export type Product = {
  id: string;
  title: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  location: string;
  image?: any;
  freeDelivery?: boolean;
  brand?: string;
  size?: string;
  material?: string;
  weight?: string;
  color?: string;
  description?: string;
};

type Store = {
  products: Product[];         // All products
  addedProducts: Product[];    // User-added products
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
};

export const useStore = create<Store>((set) => ({
  products: [...mockProducts],
  addedProducts: [],
  addProduct: (product) =>
    set((state) => ({
      products: [product, ...state.products],
      addedProducts: [product, ...state.addedProducts],
    })),
  removeProduct: (id) =>
    set((state) => ({
      addedProducts: state.addedProducts.filter((product) => product.id !== id),
    })),
}));

// ✅ Cart Store with fixed types
type CartStore = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  addToCart: (product) =>
    set((state) => {
      const exists = state.cart.find((item) => item.id === product.id);
      if (exists) return state; // Don't add duplicates
      return { cart: [...state.cart, product] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),
  clearCart: () => set({ cart: [] }),
}));
