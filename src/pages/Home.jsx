import { useEffect, useState } from "react";

import Categories from "../copmonents/Categories";
import Sort from "../copmonents/Sort";
import PizzaBlock from "../copmonents/PizzaBlock";
// import pizzas from "../assets/pizzas.json";
import { Skeleton } from "../copmonents/PizzaBlock/Skeleton";
export const Home = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // чтобы при запросе на бэк учитывать выбранную категорию и сортировку,
  // состояния (categoryId, sortType) хранятся в родительском компоненте (Home).
  // так родитель может передавать текущие значения и функции обновления дочерним компонентам (Categories, Sort).
  // это удобнее, чем хранить useState внутри них, ведь данные нужны именно здесь — для формирования запроса.
  const [categoryId, setCategoryId] = useState(0);
  const [sortType, setSortType] = useState({
    name: "популярности",
    sortProperty: "rating",
  });
  useEffect(() => {
    setIsLoading(true); // чтобы начиналась загрузка (показывался скелетон)

    const order = sortType.sortProperty.includes("-") ? "asc" : "desc";
    const sortBy = sortType.sortProperty.replace("-", "");
    const category = categoryId > 0 ? `category=${categoryId}` : "";

    fetch(
      `https://68ff26cce02b16d1753ca841.mockapi.io/items?${category}&sortBy=${sortBy}&order=${order}`
    )
      .then((res) => res.json())
      .then((arr) => {
        setItems(arr);
        setIsLoading(false);
      });
    // при первом рендере главной странице нужно, чтобы мы сразу были в самом верху
    // чтобы не было ситуации, когда мы к примеру на странице корзины проскролили вниз
    // и при переходе на главную страницу скролл оставался так же снизу
    window.scrollTo(0, 0);
  }, [categoryId, sortType]);

  return (
    <div className="container">
      <div className="content__top">
        {/* то есть функция  (i) => setCategoryId(i) передается пропсом в <Categories />
        и уже там вызывается () => onClickCategory(index) и index передается 
        и становится (index) => setCategoryId(index)
        */}
        <Categories
          value={categoryId}
          onClickCategory={(i) => setCategoryId(i)} // функция, которую я передаю дочернему компоненту.
          // её задача: когда ребёнок «сообщит» о клике, обновить состояние родителя.
        />
        <Sort
          // родитель говорит ребёнку:
          // “вот тебе текущее значение sortType и вот функция, чтобы обновить его.”
          activeSelectIndex={sortType}
          onClickSelectItem={(obj) => setSortType(obj)}
        />
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
    </div>
  );
};
