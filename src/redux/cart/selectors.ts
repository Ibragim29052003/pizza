import { RootState } from "../store";

// чтобы не дублировать (state) => state.cart в разных местах, выносим селектор
export const selectCart = (state: RootState) => state.cart;
export const selectCartItemById = (id: string) => (state: RootState) =>
  state.cart.items.find((obj) => obj.id === id);