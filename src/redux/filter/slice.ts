import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SortItem, SortPropertyEnum, FilterSliceState } from "./types";


const initialState: FilterSliceState = {
  searchValue: "",
  categoryId: 0,
  pageCount: 1,
  sort: {
    name: "популярности",
    sortProperty: SortPropertyEnum.RATING_DESC,
  },
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // предыдущее состояние и наш action из компонента (action это то что прокричал dispatch)
    setCategoryId(state, action: PayloadAction<number>) {
      state.categoryId = action.payload;
    },
    setSearchValue(state, action: PayloadAction<string>) {
      state.searchValue = action.payload;
    },
    setSortType(state, action: PayloadAction<SortItem>) {
      // меняем sort на то, что прийдет в Sort.jsx а именно в dispatch(setSortType(obj))
      state.sort = action.payload;
    },
    setPageCount(state, action: PayloadAction<number>) {
      state.pageCount = action.payload;
    },
    setFilters(state, action: PayloadAction<FilterSliceState>) {
      state.sort = action.payload.sort;
      state.pageCount = Number(action.payload.pageCount);
      state.categoryId = Number(action.payload.categoryId);
    },
  },
});

export const {
  setCategoryId,
  setSortType,
  setPageCount,
  setFilters,
  setSearchValue,
} = filterSlice.actions;

export default filterSlice.reducer;

