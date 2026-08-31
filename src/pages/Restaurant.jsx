import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useParams, Link } from "react-router-dom";
import "../components/css/Restaurant.css";

export default function Restaurant() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/restaurants/${id}`)
      .then((res) => {
        setRestaurant(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load restaurant.");
      });
  }, [id]);

  function addToCart(item) {
    const cart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

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

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    alert(`${item.name} added to cart!`);
  }

  if (error) {
    return (
      <div className="restaurant-page">

        <div className="restaurant-error">

          <div className="restaurant-error-icon">
            😕
          </div>

          <h2>{error}</h2>

          <Link to="/">
            ← Back to restaurants
          </Link>

        </div>

      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="restaurant-page">

        <div className="restaurant-loading">
          Loading restaurant...
        </div>

      </div>
    );
  }

  return (
    <div className="restaurant-page">

      {/* HEADER */}

      <div className="restaurant-header">

        <Link
          to="/"
          className="restaurant-back"
        >
          ← Back to restaurants
        </Link>

        <div className="restaurant-hero">

          <div className="restaurant-hero-content">

            <p className="restaurant-eyebrow">
              RESTAURANT
            </p>

            <h1>
              {restaurant.name}
            </h1>

            {restaurant.description && (
              <p className="restaurant-description">
                {restaurant.description}
              </p>
            )}

            <div className="restaurant-meta">

              <span>
                📍 {restaurant.address}
              </span>

              <span>
                ⭐ 4.8
              </span>

              <span>
                ⚡ Fast delivery
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* MENU */}

      <main className="restaurant-content">

        <div className="restaurant-menu-header">

          <div>
            <p className="restaurant-eyebrow">
              MENU
            </p>

            <h2>
              What would you like?
            </h2>
          </div>

          <Link
            to="/cart"
            className="restaurant-cart-button"
          >
            🛒 View Cart
          </Link>

        </div>


        {restaurant.categories?.map(
          (category) => (

            <section
              key={category.id}
              className="restaurant-category"
            >

              <div className="restaurant-category-header">

                <h2>
                  {category.name}
                </h2>

                <span>
                  {category.items?.length || 0} items
                </span>

              </div>


              <div className="restaurant-items">

                {category.items?.map(
                  (item) => (

                    <div
                      key={item.id}
                      className="restaurant-item"
                    >

                      <div className="restaurant-item-info">

                        <h3>
                          {item.name}
                        </h3>

                        {item.description && (
                          <p>
                            {item.description}
                          </p>
                        )}

                        <strong>
                          ${(item.priceCents / 100).toFixed(2)}
                        </strong>

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          addToCart(item)
                        }
                        className="restaurant-add-button"
                      >
                        + Add
                      </button>

                    </div>

                  )
                )}

              </div>

            </section>

          )
        )}

      </main>

    </div>
  );
}
