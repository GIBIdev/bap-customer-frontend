import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    api.get("/restaurants").then(res => setRestaurants(res.data));
  }, []);

  return (
    <div>
      <h1>Nearby Restaurants</h1>
      {restaurants.map(r => (
        <Link key={r.id} to={`/restaurant/${r.id}`}>
          <div>{r.name}</div>
        </Link>
      ))}
    </div>
  );
}
