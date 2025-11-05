import { useContext, useEffect, useRef, useState } from "react";
import qs from "qs";
import {
  Categories,
  Sort,
  PizzaBlock,
  Skeleton,
  Pagination,
} from "../copmonents";

import { SearchContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryId, setPageCount, setFilters } from "../redux/slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { selects } from "../copmonents/Sort";

export const Home = () => {
  const navigate = useNavigate();
  const isSearch = useRef(false);
  const isMounted = useRef(false);

  // возвращает функцию, с помощью которой можно отправлять действия (actions) в Redux для изменения state
  const dispatch = useDispatch();
  // у useSelector внутри есть и свой провайдер и свой контекст
  const { categoryId, sort, pageCount } = useSelector((state) => state.filter);
  const sortType = sort.sortProperty;

  // подписываемся на контекст SearchContext
  // когда значение в провайдере SearchContext изменится (value),
  // компонент Home и все его потомки, использующие useContext(SearchContext),
  // будут автоматически перерисованы с новыми данными (например, новым searchValue)

  // то есть все компоненты, находящиеся внутри <SearchContext.Provider>,
  // и использующие этот контекст, обновятся при изменении value.

  const { searchValue } = useContext(SearchContext);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // чтобы при запросе на бэк учитывать выбранную категорию и сортировку,
  // состояния (categoryId, sortType) хранятся в родительском компоненте (Home).
  // так родитель может передавать текущие значения и функции обновления дочерним компонентам (Categories, Sort).
  // это удобнее, чем хранить useState внутри них, ведь данные нужны именно здесь — для формирования запроса.
  // const [categoryId, setCategoryId] = useState(0);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [sortType, setSortType] = useState({
  //   name: "популярности",
  //   sortProperty: "rating",
  // });

  const onClickCategory = (id) => {
    dispatch(setCategoryId(id)); // аналогия с мегафоном (мы кричим, что хотим изменить категорию)
  };

  const onChangePageNumber = (number) => {
    dispatch(setPageCount(number));
  };

  const fetchPizzas = () => {
    setIsLoading(true); // чтобы начиналась загрузка (показывался скелетон)

    const order = sortType.includes("-") ? "asc" : "desc";
    const sortBy = sortType.replace("-", "");
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `search=${searchValue}` : "";

    // fetch(
    //   `https://68ff26cce02b16d1753ca841.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}&${search}`
    // )
    //   .then((res) => {
    //     if (!res.ok) {
    //       return []; // если 404 или другая ошибка — возвращаем пустой массив
    //     }
    //     return res.json();
    //   })
    //   .then((arr) => {
    //     // проверка на то, что это действительно массив
    //     if (Array.isArray(arr)) {
    //       setItems(arr);
    //     } else {
    //       setItems([]); // безопасно
    //     }
    //     setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     console.error("Ошибка при получении данных:", err);
    //     setItems([]); // чтобы не падало
    //     setIsLoading(false);
    //   });

    // ДЕЛАЕМ axios вместо fetch
    axios
      .get(
        `https://68ff26cce02b16d1753ca841.mockapi.io/items?page=${pageCount}&limit=4&${category}&sortBy=${sortBy}&order=${order}&${search}`
      )
      .then((response) => {
        const data = response.data;

        // проверяем, что пришел массив (на случай если сервер вернет ошибку или объект)
        if (Array.isArray(data)) {
          setItems(response.data);
        } else {
          setItems([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setItems([]); // сбрасываем, чтобы не падало при отрисовке
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // 1. Если в URL есть параметры — применяем их и не делаем запрос сразу
    if (window.location.search) {
      // substring(1) - удаляем первый символ (то есть удаляем знак ?)
      const params = qs.parse(window.location.search.substring(1));

      const sort = selects.find(
        (obj) => obj.sortProperty === params.sortProperty
      );

      dispatch(
        setFilters({
          ...params,
          sort,
        })
      );
      isSearch.current = true; // отмечаем, что уже восстанавливаем состояние
    }
  }, [dispatch]);

  // 2. Когда фильтры изменились — если не восстановление из URL, тогда делаем запрос
  useEffect(() => {
    // при первом рендере главной странице нужно, чтобы мы сразу были в самом верху
    // чтобы не было ситуации, когда мы к примеру на странице корзины проскролили вниз
    // и при переходе на главную страницу скролл оставался так же снизу
    window.scrollTo(0, 0);
    if (!isSearch.current) {
      fetchPizzas();
    }

    isSearch.current = false;
  }, [categoryId, sortType, searchValue, pageCount]);

  // 3. Только после первого рендера — формируем URL
  useEffect(() => {
    if (isMounted.current) {
      // параметры которые прийдут, превращаем в одну целую строку
      const queryString = qs.stringify({
        sortProperty: sortType,
        categoryId,
        pageCount,
      });
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sortType, pageCount]);

  const pizzas = items.map((obj) => <PizzaBlock {...obj} key={obj.id} />);

  const skeletons = [...new Array(6)].map((_, index) => (
    <Skeleton key={index} />
  ));

  return (
    <div className="container">
      <div className="content__top">
        {/* то есть функция  (i) => setCategoryId(i) передается пропсом в <Categories />
        и уже там вызывается () => onClickCategory(index) и index передается 
        и становится (index) => setCategoryId(index)
        */}
        <Categories
          value={categoryId}
          onClickCategory={onClickCategory} // функция, которую я передаю дочернему компоненту.
          // её задача: когда ребёнок «сообщит» о клике, обновить состояние родителя.
        />
        <Sort
        // // родитель говорит ребёнку:
        // // “вот тебе текущее значение sortType и вот функция, чтобы обновить его.”
        // activeSelectIndex={sortType}
        // onClickSelectItem={(obj) => setSortType(obj)}
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
      <Pagination pageCount={pageCount} onChangePage={onChangePageNumber} />
    </div>
  );
};
