// cartStore.js
import { ProductType } from '../types';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CartItem = {
  product: ProductType;
  quantity: number;
};

type CartStore = {
  cart: CartItem[];
  favorites: ProductType[];
  addToCart: (product: ProductType, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
  addToFavorites: (product: ProductType) => void;
  removeFromFavorites: (productId: number) => void;
  init: () => Promise<void>; // Include init function in the type

};

const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  favorites: [],

  // Load cart and favorites data from AsyncStorage on component mount
  init: async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      const favoritesData = await AsyncStorage.getItem('favorites');

      if (cartData) {
        set({ cart: JSON.parse(cartData) });
      }

      if (favoritesData) {
        set({ favorites: JSON.parse(favoritesData) });
      }
    } catch (error) {
      console.error('Error loading data from AsyncStorage:', error);
    }
  },

  addToCart: (product, quantity) => {
    set(state => {
      if (!state.cart.some(item => item.product.id === product.id)) {
        const newCart = [
          ...state.cart,
          {
            product,
            quantity,
          },
        ];
        AsyncStorage.setItem('cart', JSON.stringify(newCart));
        return { cart: newCart };
      }
      return state;
    });
  },

  removeFromCart: productId => {
    set(state => {
      const newCart = state.cart.filter(item => item.product.id !== productId);
      AsyncStorage.setItem('cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  updateCartItemQuantity: (productId, newQuantity) => {
    set(state => {
      const newCart = state.cart.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      );
      AsyncStorage.setItem('cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  clearCart: () => {
    AsyncStorage.removeItem('cart');
    set({ cart: [] });
  },

  addToFavorites: product => {
    set(state => {
      if (!state.favorites.some(fav => fav.id === product.id)) {
        const newFavorites = [...state.favorites, product];
        AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
        return { favorites: newFavorites };
      }
      return state;
    });
  },

  removeFromFavorites: productId => {
    set(state => {
      const newFavorites = state.favorites.filter(product => product.id !== productId);
      AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    });
  },
}));

useCartStore.getState().init();
// Initialize the store to load data from AsyncStorage on component mount
export { useCartStore };
