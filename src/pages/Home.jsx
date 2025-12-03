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
import { setCategoryId, setPageCount, setFilters, selectFilter } from "../redux/slice";
import { useNavigate } from "react-router-dom";
import { selects } from "../copmonents/Sort";
import { fetchPizzas, selectPizzaData } from "../redux/pizzaSlice";

export const Home = () => {
  const navigate = useNavigate();
  const isSearch = useRef(false);
  const isMounted = useRef(false);

  // возвращает функцию, с помощью которой можно отправлять действия (actions) в Redux для изменения state
  const dispatch = useDispatch();

  const { items, status } = useSelector(selectPizzaData); // достаем из редакса
  // у useSelector внутри есть и свой провайдер и свой контекст
  const { categoryId, sort, pageCount, searchValue } = useSelector(selectFilter);
  const sortType = sort.sortProperty;

  // подписываемся на контекст SearchContext
  // когда значение в провайдере SearchContext изменится (value),
  // компонент Home и все его потомки, использующие useContext(SearchContext),
  // будут автоматически перерисованы с новыми данными (например, новым searchValue)

  // то есть все компоненты, находящиеся внутри <SearchContext.Provider>,
  // и использующие этот контекст, обновятся при изменении value.

  // const { searchValue } = useContext(SearchContext);

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

  const getPizzas = async () => {
    // setIsLoading(true); // чтобы начиналась загрузка (показывался скелетон)

    const order = sortType.includes("-") ? "asc" : "desc";
    const sortBy = sortType.replace("-", "");
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `search=${searchValue}` : "";

    // try {
    dispatch(
      fetchPizzas({
        order,
        sortBy,
        category,
        search,
        pageCount,
      })
    );
    // }
    // catch (error) {
    //   console.log(error);
    //   dispatch(fetchPizzas([])); // сбрасываем, чтобы не падало при отрисовке
    // } finally {
    // }
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
      getPizzas();
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
      {/* изначально создаем массив на 6 элементов (undefined) и меняем все на скелетон, чтобы при первом рендере сразу показывались скелетоны */}
      {status === "error" ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 👀</h2>
          <p>Не удалось получить пиццы 🍕😭</p>
        </div>
      ) : (
        <div className="content__items">
          {status === "loading" ? skeletons : pizzas}
        </div>
      )}
      <Pagination pageCount={pageCount} onChangePage={onChangePageNumber} />
    </div>
  );
};
