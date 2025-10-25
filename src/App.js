import React from "react";
import Header from "./copmonents/Header";
import Categories from "./copmonents/Categories";
import Sort from "./copmonents/Sort";
import PizzaBlock from "./copmonents/PizzaBlock";
import pizzas from "./assets/pizzas.json";

import "./scss/app.scss";

function App() {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <div className="container">
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
            {pizzas.map((obj) => (
              <PizzaBlock {...obj} key={obj.id}></PizzaBlock>
            ))}
          </div>
        </div>
      </div>
    </div>
  );     
}

export default App;
