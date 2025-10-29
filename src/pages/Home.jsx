import { useEffect, useState } from "react";

import Categories from "../copmonents/Categories";
import Sort from "../copmonents/Sort";
import PizzaBlock from "../copmonents/PizzaBlock";
// import pizzas from "../assets/pizzas.json";
import { Skeleton } from "../copmonents/PizzaBlock/Skeleton";
export const Home = () => {
  // https://68ff26cce02b16d1753ca841.mockapi.io/items

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://68ff26cce02b16d1753ca841.mockapi.io/items")
      .then((res) => res.json())
      .then((arr) => {
        setItems(arr);
        setIsLoading(false);
      });
  }, []);
  return (
    <>
      <div className="content__top">
        <Categories />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {/* <PizzaBlock title="Чизбургер-пицца" price={395} />
                <PizzaBlock title="Сырная" price={450} />
                <PizzaBlock title="Креветки по-азиатски" price={290} />
                <PizzaBlock title="Сырный цыпленок" price={385} /> */}

        {/* изначально создаем массив на 6 элементов (undefined) и меняем все на скелетон, чтобы при первом рендере сразу показывались скелетоны  */}
        {isLoading
          ? [...new Array(6)].map((_, index) => <Skeleton key={index} />)
          : items.map((obj) => <PizzaBlock {...obj} key={obj.id}></PizzaBlock>)}
      </div>
    </>
  );
};
