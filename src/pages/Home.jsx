import { useContext, useEffect, useState } from "react";

import Categories from "../copmonents/Categories";
import Sort from "../copmonents/Sort";
import PizzaBlock from "../copmonents/PizzaBlock";
// import pizzas from "../assets/pizzas.json";
import { Skeleton } from "../copmonents/PizzaBlock/Skeleton";
import Pagination from "../copmonents/Pagination";
import { SearchContext } from "../App";
export const Home = () => {

// подписываемся на контекст SearchContext
// когда значение в провайдере SearchContext изменится (value),
// компонент Home и все его потомки, использующие useContext(SearchContext),
// будут автоматически перерисованы с новыми данными (например, новым searchValue)

// то есть все компоненты, находящиеся внутри <SearchContext.Provider>,
// и использующие этот контекст, обновятся при изменении value.

  const {searchValue} = useContext(SearchContext) 
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // чтобы при запросе на бэк учитывать выбранную категорию и сортировку,
  // состояния (categoryId, sortType) хранятся в родительском компоненте (Home).
  // так родитель может передавать текущие значения и функции обновления дочерним компонентам (Categories, Sort).
  // это удобнее, чем хранить useState внутри них, ведь данные нужны именно здесь — для формирования запроса.
  const [categoryId, setCategoryId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState({
    name: "популярности",
    sortProperty: "rating",
  });
  useEffect(() => {
    setIsLoading(true); // чтобы начиналась загрузка (показывался скелетон)

    const order = sortType.sortProperty.includes("-") ? "asc" : "desc";
    const sortBy = sortType.sortProperty.replace("-", "");
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `search=${searchValue}` : "";

    fetch(
      `https://68ff26cce02b16d1753ca841.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}&${search}`
    )
      .then((res) => {
        if (!res.ok) {
          return []; // если 404 или другая ошибка — возвращаем пустой массив
        }
        return res.json();
      })
      .then((arr) => {
        // проверка на то, что это действительно массив
        if (Array.isArray(arr)) {
          setItems(arr);
        } else {
          setItems([]); // безопасно
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при получении данных:", err);
        setItems([]); // чтобы не падало
        setIsLoading(false);
      });
    // при первом рендере главной странице нужно, чтобы мы сразу были в самом верху
    // чтобы не было ситуации, когда мы к примеру на странице корзины проскролили вниз
    // и при переходе на главную страницу скролл оставался так же снизу
    window.scrollTo(0, 0);
  }, [categoryId, sortType, searchValue, currentPage]);

  const pizzas = items.map((obj) => <PizzaBlock {...obj} key={obj.id} />);

  const skeletons = [...new Array(6)].map((_, index) => (
    <Skeleton key={index} />
  ));
  // такой вариант подходит если у меня статичный массив и тогда можно не обращаться на бэк
  // const pizzas = items
  //   .filter(({ title }) => {
  //     if (title.toLowerCase().includes(searchValue.toLowerCase())) {
  //       return true;
  //     }
  //     return false;
  //   })
  //   .map((obj) => <PizzaBlock {...obj} key={obj.id}></PizzaBlock>);

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
        {isLoading ? skeletons : pizzas}
      </div>
      <Pagination onChangePage={(number) => setCurrentPage(number)} />
    </div>
  );
};
