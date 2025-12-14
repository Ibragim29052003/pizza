import { PizzaItem } from '../redux/cart/types';

export const calcTotalPrice = (items: PizzaItem[]) => {
return items.reduce((sum, obj) => {
    const countPizza = obj.count * obj.price;
    return countPizza + sum;
  }, 0);
};
