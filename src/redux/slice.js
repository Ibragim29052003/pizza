import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchValue: '',
  categoryId: 0,
  pageCount: 1,
  sort: {
    name: "популярности",
    sortProperty: "rating",
  },
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // предыдущее состояние и наш action из компонента (action это то что прокричал dispatch)
    setCategoryId(state, action) {
      state.categoryId = action.payload;
    },
    setSortType(state, action) {
      // меняем sort на то, что прийдет в Sort.jsx а именно в dispatch(setSortType(obj))
      state.sort = action.payload;
    },
    setPageCount(state, action) {
      state.pageCount = action.payload;
    },
    setFilters(state, action) {
      state.sort = action.payload.sort
      state.pageCount = Number(action.payload.pageCount)
      state.categoryId = Number(action.payload.categoryId)
    }
  },
});

export const { setCategoryId, setSortType, setPageCount, setFilters } = filterSlice.actions;

export default filterSlice.reducer;
