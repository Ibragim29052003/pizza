import { configureStore } from "@reduxjs/toolkit";
import filter from "./slice.js";

export const store = configureStore({
  reducer: {
    filter,
  },
});
