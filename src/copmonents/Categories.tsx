import { FC, memo } from "react";

type CategoriesProps = {
  value: number;
  onClickCategory: (i: number) => void;
  getCategories?: (categories: string[]) => void;
};

const categories = [
  "Все",
  "Мясные",
  "Вегетарианская",
  "Гриль",
  "Острые",
  "Закрытые",
];

// если не изменились пропсы и не поменялся стейт, то компонент не будет перерисовываться благодаря memo
const Categories: FC<CategoriesProps> = memo(
  ({
  value,
  getCategories,
  onClickCategory,
}) => {
  // const [activeIndex, setActiveIndex] = useState(0);

  // function onClickCategory(index) {
  //   setActiveIndex(index);
  // }

  // getCategories && getCategories(categories);
  getCategories?.(categories);


  return (
    <div className="categories">
      <ul>
        {/* <li
          // обернули в анонимную функцию, чтобы onClick не вызывал сразу же функцию onClickCategory
          // иначе будет бесконечный ререндер
          onClick={() => onClickCategory(0)}
          className={activeIndex === 0 ? "active" : ""}
        >
          Все
        </li> */}

        {categories.map((categoryName, index) => (
          <li
            onClick={() => onClickCategory(index)}
            className={value === index ? "active" : ""}
            key={index}
          >
            {categoryName}
          </li>
        ))}
      </ul>
    </div>
  );
}
)

export default Categories;
