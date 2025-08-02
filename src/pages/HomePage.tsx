import React from "react";
import ItemCard from "../components/ItemCard/ItemCard.tsx";

const items = [
  {
    id: "1",
    nome: "Frango",
    data: "2025-08-01",
    vencimento: "2025-08-10",
    aberto: true,
    temperado: false,
    tags: ["carne", "aves"],
  },
  {
    id: "2",
    nome: "Brócolis",
    data: "2025-07-28",
    vencimento: "2025-08-05",
    aberto: false,
    temperado: false,
    tags: ["vegetal"],
  },
];

const HomePage = () => {
  return (
    <div className="cardsContainer">
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default HomePage;
