import React from "react";
import "./ItemCard.css";

interface Item {
  id: string;
  nome: string;
  data: string;
  aberto: boolean;
  vencimento: string;
  temperado: boolean;
  tags: string[];
}

interface Props {
  item: Item;
}

const ItemCard: React.FC<Props> = ({ item }) => {
  return (
    <div className="itemCard">
      <h3>{item.nome}</h3>
      <p><strong>Data:</strong> {item.data}</p>
      <p><strong>Vencimento:</strong> {item.vencimento}</p>
      <p><strong>Aberto:</strong> {item.aberto ? "Sim" : "Não"}</p>
      <p><strong>Temperado:</strong> {item.temperado ? "Sim" : "Não"}</p>
      <div className="tags">
        {item.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
};

export default ItemCard;
