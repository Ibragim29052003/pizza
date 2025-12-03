import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// делаем асинхронный action (и внутри вынесенная бизнес логика)
export const fetchPizzas = createAsyncThunk(
  "pizza/fetchPizzasStatus", // этот префикс может быть любым, редакс вместо fetchPizzas.pending уже сам прикрутит наш префикс и даст свой суффикс
  async (params, thunkAPI) => {
    const { order, sortBy, category, search, pageCount } = params;
    const { data } = await axios.get(
      `https://68ff26cce02b16d1753ca841.mockapi.io/items?page=${pageCount}&limit=4&${category}&sortBy=${sortBy}&order=${order}&${search}`
    );

    if (data.length === 0) {
      return thunkAPI.rejectWithValue('Пиццы пустые')
    }
    return thunkAPI.fulfillWithValue(data)
  }
);

const initialState = {
  items: [],
  status: "loading", // loading | success | error
};

const pizzaSlice = createSlice({
  name: "pizza",
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPizzas.pending, (state) => {
        state.status = "loading";
        state.items = [];
      })
      .addCase(fetchPizzas.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "success";
      })
      .addCase(fetchPizzas.rejected, (state) => {
        state.status = "error";
        state.items = [];
      });
  },
});
export const selectPizzaData = (state) => state.pizza

export const { setItems } = pizzaSlice.actions;

export default pizzaSlice.reducer;
