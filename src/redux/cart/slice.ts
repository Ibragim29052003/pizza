import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartSliceState, PizzaItem } from "./types";
import { getCartFromLocalStorage } from "../../utils/getCartFromLocalStorage";
import { calcTotalPrice } from "../../utils/calcTotalPrice";


const { items, totalPrice } = getCartFromLocalStorage();

const initialState: CartSliceState = {
  totalPrice,
  items,
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

      state.totalPrice = calcTotalPrice(state.items);
    },

    // plusItem(state, action) {
    //   const increment = state.items.find((obj) => obj.id === action.payload);
    //   increment && increment.count++;
    // },

    minusItem(state, action: PayloadAction<string>) {
      const decrement = state.items.find((obj) => obj.id === action.payload);
      if (decrement && decrement.count >= 2) {
        decrement.count--;
      }

      // state.totalPrice = state.items.reduce((sum, obj) => {
      //   const countPizza = obj.count * obj.price;
      //   return countPizza + sum;
      // }, 0);
      state.totalPrice = calcTotalPrice(state.items);
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


export const { addItem, removeItem, clearItems, minusItem } = cartSlice.actions;

export default cartSlice.reducer;
