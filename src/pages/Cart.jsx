/**
 * 
 * A class that handles our Cart
 * 
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../components/css/Cart.css";
import Navbar from "../components/layout/Navbar";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  function loadCart() {
    const savedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCart(savedCart);
  }

  function formatPrice(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function updateQuantity(itemId, change) {
    const updatedCart = cart
      .map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + change,
        };
      })
      .filter((item) => item.quantity > 0);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    setCart(updatedCart);
  }

  function removeItem(itemId) {
    const updatedCart = cart.filter(
      (item) => item.id !== itemId
    );

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    setCart(updatedCart);
  }

  function clearCart() {
    localStorage.removeItem("cart");
    setCart([]);
  }

  const totalCents = cart.reduce(
    (sum, item) =>
      sum + item.priceCents * item.quantity,
    0
  );

  /*
   * EMPTY CART
   */
  if (cart.length === 0) {
    return (

        <div className="cart-page">
          <div className="cart-empty">
            <div className="cart-empty-icon">
              🛒
            </div>

            <h1>Your cart is empty</h1>

            <p>
              Looks like you haven't added anything
              to your cart yet.
            </p>

            <Link
              to="/"
              className="cart-primary-button"
            >
              Browse Restaurants →
            </Link>
          </div>
        </div>
    );
  }

  /*
   * CART WITH ITEMS
   */
  return (

      <div className="cart-page">

        {/* HEADER */}
        <div className="cart-header">

          <Link
            to="/"
            className="cart-back"
          >
            ← Continue shopping
          </Link>

          <div className="cart-title-row">

            <div>
              <p className="cart-eyebrow">
                YOUR ORDER
              </p>

              <h1>Your Cart</h1>
            </div>

            <span className="cart-count">
              {cart.reduce(
                (sum, item) =>
                  sum + item.quantity,
                0
              )}{" "}
              items
            </span>

          </div>
        </div>

        {/* CONTENT */}
        <div className="cart-layout">

          {/* ITEMS */}
          <div className="cart-items">

            <div className="cart-items-header">

              <h2>
                Your items
              </h2>

              <button
                type="button"
                onClick={clearCart}
                className="cart-clear-button"
              >
                Clear cart
              </button>

            </div>

            {cart.map((item) => (

              <div
                key={item.id}
                className="cart-item"
              >

                <div className="cart-item-info">

                  <div className="cart-item-icon">
                    🍽️
                  </div>

                  <div>

                    <h3>
                      {item.name}
                    </h3>

                    {item.description && (
                      <p>
                        {item.description}
                      </p>
                    )}

                    <span className="cart-item-price">
                      {formatPrice(
                        item.priceCents
                      )}
                    </span>

                  </div>

                </div>

                <div className="cart-item-actions">

                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          -1
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <strong className="cart-item-total">
                    {formatPrice(
                      item.priceCents *
                      item.quantity
                    )}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item.id)
                    }
                    className="cart-remove"
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* SUMMARY */}
          <aside className="cart-summary">

            <div className="cart-summary-card">

              <h2>
                Order summary
              </h2>

              <div className="cart-summary-row">

                <span>
                  Subtotal
                </span>

                <strong>
                  {formatPrice(totalCents)}
                </strong>

              </div>

              <div className="cart-summary-row">

                <span>
                  Delivery
                </span>

                <span>
                  Calculated at checkout
                </span>

              </div>

              <div className="cart-summary-divider" />

              <div className="cart-total-row">

                <span>
                  Total
                </span>

                <strong>
                  {formatPrice(totalCents)}
                </strong>

              </div>

              <Link
                to="/checkout"
                className="cart-checkout-button"
              >
                Proceed to Checkout →
              </Link>

              <Link
                to="/"
                className="cart-continue"
              >
                Continue shopping
              </Link>

            </div>

          </aside>

        </div>

      </div>
  );
}