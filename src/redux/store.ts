import { configureStore } from "@reduxjs/toolkit";
import filter from "./filterSlice";
import cart from "./cartSlise";
import pizza from "./pizzaSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    filter,
    cart,
    pizza,
  },
});

export type RootState = ReturnType<typeof store.getState>;

// продвинутый UseDispatch (с типизацией)
type AppDispatch = typeof store.dispatch; // в AppDispatch будут лежать все типы экшенов из всех слайсов
export const useAppDispatch = () => useDispatch<AppDispatch>();
