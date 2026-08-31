import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import "../components/css/OrderTracking.css";

export default function OrderTracking() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await api.get(
          `/orders/${id}`
        );

        setOrder(response.data);
      } catch (error) {
        console.error(
          "Unable to load order:",
          error
        );

        setError(
          "Unable to load your order."
        );
      }
    }

    if (id) {
      loadOrder();
    }
  }, [id]);

  function formatPrice(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  if (error) {
    return (
      <div className="tracking-page">

        <div className="tracking-error">

          <div className="tracking-error-icon">
            😕
          </div>

          <h1>
            Order not found
          </h1>

          <p>
            We couldn't find the order you're
            looking for.
          </p>

          <Link to="/">
            ← Back to BAP
          </Link>

        </div>

      </div>
    );
  }

  if (!order) {
    return (
      <div className="tracking-page">

        <div className="tracking-loading">
          Loading your order...
        </div>

      </div>
    );
  }

  return (
    <div className="tracking-page">

      {/* HEADER */}

      <div className="tracking-header">

        <Link
          to="/"
          className="tracking-back"
        >
          ← Back to BAP
        </Link>

        <p className="tracking-eyebrow">
          ORDER TRACKING
        </p>

        <h1>
          Order #{order.id}
        </h1>

        <p>
          We're keeping you updated every
          step of the way.
        </p>

      </div>


      <div className="tracking-layout">

        {/* STATUS */}

        <section className="tracking-card">

          <div className="tracking-card-header">

            <div>
              <p className="tracking-eyebrow">
                CURRENT STATUS
              </p>

              <h2>
                {order.status || "Processing"}
              </h2>
            </div>

            <div className="tracking-status-icon">
              🚴
            </div>

          </div>


          {/* PROGRESS */}

          <div className="tracking-progress">

            <div className="tracking-step active">

              <div className="tracking-step-icon">
                ✓
              </div>

              <div>
                <strong>
                  Order received
                </strong>

                <span>
                  Your order has been received.
                </span>
              </div>

            </div>


            <div className="tracking-line active" />


            <div
              className={`tracking-step ${
                order.status === "PREPARING" ||
                order.status === "READY" ||
                order.status === "OUT_FOR_DELIVERY" ||
                order.status === "DELIVERED"
                  ? "active"
                  : ""
              }`}
            >

              <div className="tracking-step-icon">
                🍳
              </div>

              <div>
                <strong>
                  Preparing
                </strong>

                <span>
                  The restaurant is preparing
                  your food.
                </span>
              </div>

            </div>


            <div className="tracking-line" />


            <div
              className={`tracking-step ${
                order.status === "OUT_FOR_DELIVERY" ||
                order.status === "DELIVERED"
                  ? "active"
                  : ""
              }`}
            >

              <div className="tracking-step-icon">
                🛵
              </div>

              <div>
                <strong>
                  On the way
                </strong>

                <span>
                  Your delivery partner is
                  bringing your order.
                </span>
              </div>

            </div>


            <div className="tracking-line" />


            <div
              className={`tracking-step ${
                order.status === "DELIVERED"
                  ? "active"
                  : ""
              }`}
            >

              <div className="tracking-step-icon">
                ✓
              </div>

              <div>
                <strong>
                  Delivered
                </strong>

                <span>
                  Enjoy your meal!
                </span>
              </div>

            </div>

          </div>

        </section>


        {/* ORDER DETAILS */}

        <aside className="tracking-summary">

          <div className="tracking-summary-card">

            <h2>
              Order details
            </h2>


            <div className="tracking-order-items">

              {order.items?.map(
                (item) => (

                  <div
                    key={item.id}
                    className="tracking-item"
                  >

                    <div>

                      <strong>
                        {item.quantity} ×{" "}
                        {item.name ||
                          item.menuItem?.name}
                      </strong>

                      <span>
                        {formatPrice(
                          item.priceCents ||
                          item.menuItem?.priceCents ||
                          0
                        )}
                      </span>

                    </div>

                    <strong>
                      {formatPrice(
                        (item.priceCents ||
                          item.menuItem?.priceCents ||
                          0) *
                          item.quantity
                      )}
                    </strong>

                  </div>

                )
              )}

            </div>


            <div className="tracking-divider" />


            <div className="tracking-total">

              <span>
                Total
              </span>

              <strong>
                {formatPrice(
                  order.totalCents || 0
                )}
              </strong>

            </div>

          </div>


          {/* DELIVERY */}

          <div className="tracking-delivery-card">

            <div className="tracking-delivery-icon">
              📍
            </div>

            <div>

              <strong>
                Delivery address
              </strong>

              <p>
                {order.deliveryAddress ||
                  "Delivery address"}
              </p>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}