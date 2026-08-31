import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useParams, Link } from "react-router-dom";

export default function Restaurant() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/restaurants/${id}`)
      .then((res) => setRestaurant(res.data))
      .catch((err) => {
        console.error(err);
        setError("Unable to load restaurant.");
      });
  }, [id]);

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        description: item.description,
        priceCents: item.priceCents,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${item.name} added to cart!`);
  };

  if (error) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>{error}</h2>
        <Link to="/">← Back to restaurants</Link>
      </div>
    );
  }

  if (!restaurant) {
    return <div style={{ padding: "40px" }}>Loading...</div>;
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <Link to="/">← Back to restaurants</Link>

      <h1 style={{ marginTop: "20px" }}>{restaurant.name}</h1>

      {restaurant.description && (
        <p>{restaurant.description}</p>
      )}

      <p>{restaurant.address}</p>

      {restaurant.categories.map((category) => (
        <section key={category.id} style={{ marginTop: "35px" }}>
          <h2>{category.name}</h2>

          {category.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                marginBottom: "12px",
                border: "1px solid #ddd",
                borderRadius: "12px",
              }}
            >
              <div>
                <h3 style={{ marginBottom: "6px" }}>
                  {item.name}
                </h3>

                {item.description && (
                  <p style={{ margin: "5px 0" }}>
                    {item.description}
                  </p>
                )}

                <strong>
                  ${(item.priceCents / 100).toFixed(2)}
                </strong>
              </div>

              <button
                onClick={() => addToCart(item)}
                style={{
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                + Add
              </button>
            </div>
          ))}
        </section>
      ))}

      <Link to="/cart">
        <button
          style={{
            marginTop: "30px",
            padding: "14px 25px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🛒 View Cart
        </button>
      </Link>
    </div>
  );
}
