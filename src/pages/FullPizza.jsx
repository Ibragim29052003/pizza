import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
const FullPizza = () => {
  const [pizza, setPizza] = useState();
  const { id } = useParams(); // в App.js у нас динамический параметр прописан как :id и с помощью useParams достаем динамические параметры
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchPizzas() {
      try {
        const { data } = await axios.get(
          `https://68ff26cce02b16d1753ca841.mockapi.io/items/${id}`
        );
        setPizza(data);
      } catch (error) {
          alert('Ошибка при получении пиццы 🍕')
        navigate('/')
      }
    }
    fetchPizzas(); 
  }, []);

  if (!pizza) {
    return 'Загрузка...'
  }
  return (
    <div className="container">
      <img src={pizza.imageUrl} alt="" />
      <h2>{pizza.title}</h2>
      <h4>{pizza.price} ₽</h4>
    </div>
  );
};

export default FullPizza;
