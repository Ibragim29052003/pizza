import { useState } from "react";

export default function Categories() {
  const [activeIndex, setActiveIndex] = useState(0);

  const categories = [
    "Все",
    "Мясные",
    "Вегетарианская",
    "Гриль",
    "Острые",
    "Закрытые",
  ];

  function onClickCategory(index) {
    setActiveIndex(index);
  }

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

        {categories.map((children, index) => (
          <li
            onClick={() => onClickCategory(index)}
            className={activeIndex === index ? "active" : ""}
            key={index}
          >
            {children}
          </li>
        ))}
      </ul>
    </div>
  );
}
