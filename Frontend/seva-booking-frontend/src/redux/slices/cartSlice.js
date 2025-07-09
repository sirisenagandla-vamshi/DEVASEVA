
import { createSlice } from '@reduxjs/toolkit';

// Initial cart state
const initialState = {
  items: [], // Array of cart items
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart or increase quantity if already exists
    addToCart: (state, action) => {
      const { id, name, price, image_url, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ id, name, price, image_url, quantity });
      }
    },

    // Remove item from cart by id
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    // Remove all items from cart
    clearCart: (state) => {
      state.items = [];
    },

    // Increase quantity of a specific item
    increaseQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    // Decrease quantity of a specific item (min 1)
    decreaseQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
  },
});

// Export actions and reducer
export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
