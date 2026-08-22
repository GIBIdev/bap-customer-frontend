import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useParams } from "react-router-dom";

export default function Restaurant() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    api.get(`/restaurants/${id}`).then(res => setRestaurant(res.data));
  }, [id]);

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <h2>Menu</h2>
      {restaurant.menu.map(item => (
        <div key={item.id}>
          {item.name} — ${item.price}
        </div>
      ))}
    </div>
  );
}
