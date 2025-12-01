import { configureStore } from "@reduxjs/toolkit";
import filter from "./slice.js";
import cart from "./cartSlise.js";

export const store = configureStore({
  reducer: {
    filter,
    cart,
  },
});
