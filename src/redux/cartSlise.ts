import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export type PizzaItem = {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    type: string;
    size: number;
    count: number;
  }

interface CartSliceState {
  totalPrice: number;
  items: PizzaItem[];
}

const initialState: CartSliceState = {
  totalPrice: 0,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<PizzaItem>) {
      const findItem = state.items.find((obj) => obj.id === action.payload.id);
      if (findItem) {
        findItem.count++;
      } else {
        state.items.push({
          ...action.payload,
          count: 1,
        });
      }

      state.totalPrice = state.items.reduce((sum, obj) => {
        const countPizza = obj.count * obj.price;
        return countPizza + sum;
      }, 0);
    },

    // plusItem(state, action) {
    //   const increment = state.items.find((obj) => obj.id === action.payload);
    //   increment && increment.count++;
    // },

    minusItem(state, action: PayloadAction<string>) {
      const decrement = state.items.find((obj) => obj.id === action.payload);
      if (decrement && decrement.count >= 2) {
        decrement.count--;
      } else {
        state.items = state.items.filter((obj) => obj.id !== action.payload);
      }

      state.totalPrice = state.items.reduce((sum, obj) => {
        const countPizza = obj.count * obj.price;
        return countPizza + sum;
      }, 0);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((obj) => obj.id !== action.payload);
    },
    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

// чтобы не дублировать (state) => state.cart в разных местах, выносим селектор
export const selectCart = (state: RootState) => state.cart;
export const selectCartItemById = (id: string) => (state: RootState) =>
  state.cart.items.find((obj) => obj.id === id);

export const { addItem, removeItem, clearItems, minusItem } = cartSlice.actions;

export default cartSlice.reducer;
