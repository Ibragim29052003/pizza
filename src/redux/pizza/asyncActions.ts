import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PizzaItem } from "./types";

// все ключи и значения string
// type FetchPizzasArgs = Record<string, string>; // то же самое что и { order: string; sortBy: string; category: string; search: string; pageCount: string }

// делаем асинхронный action (и внутри вынесенная бизнес логика)
// первое - что мы возвращаем из этого экшена - массив пицц
// второе - какие параметры мы принимаем в этот экшен
export const fetchPizzas = createAsyncThunk<
  PizzaItem[],
  Record<string, string>
>(
  "pizza/fetchPizzasStatus", // этот префикс может быть любым, редакс вместо fetchPizzas.pending уже сам прикрутит наш префикс и даст свой суффикс
  async (params, thunkAPI) => {
    const { order, sortBy, category, search, pageCount } = params;
    const { data } = await axios.get<PizzaItem[]>(
      `https://68ff26cce02b16d1753ca841.mockapi.io/items?page=${pageCount}&limit=4&${category}&sortBy=${sortBy}&order=${order}&${search}`
    );

    if (data.length === 0) {
      return thunkAPI.rejectWithValue("Пиццы пустые");
    }
    return thunkAPI.fulfillWithValue(data);
  }
);