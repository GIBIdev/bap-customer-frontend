import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import "../components/css/Checkout.css"

export default function Checkout() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState([]);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    instructions: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /*
   * Load cart
   */
  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCart(savedCart);
  }, []);


  /*
   * Price helper
   */
  function formatPrice(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }


  /*
   * Calculate subtotal
   */
  const subtotalCents = cart.reduce(
    (sum, item) =>
      sum +
      item.priceCents * item.quantity,
    0
  );


  /*
   * Delivery fee
   *
   * Temporary value.
   *
   * Later this should come from the backend
   * based on restaurant/customer location.
   */
  const deliveryFeeCents =
    subtotalCents > 0 ? 199 : 0;


  /*
   * Service fee
   *
   * Temporary value.
   *
   * Later this should come from BAP's
   * business rules.
   */
  const serviceFeeCents =
    Math.round(subtotalCents * 0.05);


  /*
   * Final total
   */
  const totalCents =
    subtotalCents +
    deliveryFeeCents +
    serviceFeeCents;


  /*
   * Address update
   */
  function handleAddressChange(e) {
    const { name, value } = e.target;

    setAddress((current) => ({
      ...current,
      [name]: value,
    }));
  }


  /*
   * Submit order
   */
  async function handlePlaceOrder(e) {
    e.preventDefault();

    setError("");


    /*
     * Customer must be authenticated.
     */
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }


    /*
     * Make sure cart isn't empty.
     */
    if (cart.length === 0) {
      setError(
        "Your cart is empty."
      );

      return;
    }


    /*
     * Basic address validation.
     */
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipCode
    ) {
      setError(
        "Please complete your delivery address."
      );

      return;
    }


    try {
      setLoading(true);


      /*
       * Create order.
       *
       * The exact payload may change once
       * we confirm your Prisma schema/backend.
       */
      const res = await api.post(
        "/orders",
        {
          items: cart.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),

          deliveryAddress: {
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            instructions:
              address.instructions,
          },

          subtotalCents,
          deliveryFeeCents,
          serviceFeeCents,
          totalCents,
        }
      );


      /*
       * Clear cart after successful order.
       */
      localStorage.removeItem("cart");

      setCart([]);


      /*
       * Backend should return the
       * newly created order.
       */
      const orderId =
        res.data.id ||
        res.data.orderId;


      if (!orderId) {
        throw new Error(
          "Order was created but no order ID was returned."
        );
      }


      /*
       * Go to order tracking.
       */
      navigate(`/order/${orderId}`);

    } catch (error) {
      console.error(
        "Unable to create order:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to place your order. Please try again."
      );

    } finally {
      setLoading(false);
    }
  }


  /*
   * Empty cart
   */
  if (cart.length === 0) {
    return (
      <div className="checkout-empty">

        <div className="checkout-empty-icon">
          🛒
        </div>

        <h1>Your cart is empty</h1>

        <p>
          Add some delicious food before
          checking out.
        </p>

        <Link
          to="/"
          className="bap-button bap-button-primary"
        >
          Browse Restaurants →
        </Link>

      </div>
    );
  }


  return (
    <div className="checkout-page">

      {/* HEADER */}

      <div className="checkout-header">

        <Link
          to="/cart"
          className="checkout-back"
        >
          ← Back to cart
        </Link>

        <h1>Checkout</h1>

        <p>
          Complete your delivery details
          and review your order.
        </p>

      </div>


      {/* ERROR */}

      {error && (
        <div className="login-error">
          {error}
        </div>
      )}


      <div className="checkout-layout">

        {/* =====================================
            LEFT SIDE
            ===================================== */}

        <form
          className="checkout-form"
          onSubmit={handlePlaceOrder}
        >

          {/* DELIVERY */}

          <div className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-step">
                1
              </div>

              <div>
                <h2>
                  Delivery address
                </h2>

                <p>
                  Where should we deliver
                  your order?
                </p>
              </div>

            </div>


            <div className="checkout-fields">

              {/* STREET */}

              <div className="checkout-field full">

                <label htmlFor="street">
                  Street address
                </label>

                <input
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  placeholder="123 Main Street"
                />

              </div>


              {/* CITY */}

              <div className="checkout-field">

                <label htmlFor="city">
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="Charlotte"
                />

              </div>


              {/* STATE */}

              <div className="checkout-field">

                <label htmlFor="state">
                  State
                </label>

                <input
                  id="state"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  placeholder="NC"
                />

              </div>


              {/* ZIP */}

              <div className="checkout-field">

                <label htmlFor="zipCode">
                  ZIP code
                </label>

                <input
                  id="zipCode"
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleAddressChange}
                  placeholder="28202"
                />

              </div>


              {/* INSTRUCTIONS */}

              <div className="checkout-field full">

                <label htmlFor="instructions">
                  Delivery instructions
                  <span>
                    {" "}Optional
                  </span>
                </label>

                <textarea
                  id="instructions"
                  name="instructions"
                  value={address.instructions}
                  onChange={handleAddressChange}
                  placeholder="Apartment number, gate code, special instructions..."
                  rows="4"
                />

              </div>

            </div>

          </div>


          {/* PAYMENT */}

          <div className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-step">
                2
              </div>

              <div>
                <h2>
                  Payment
                </h2>

                <p>
                  Secure payment processing
                </p>
              </div>

            </div>


            <div className="payment-placeholder">

              <div className="payment-icon">
                💳
              </div>

              <div>

                <strong>
                  Payment integration
                </strong>

                <p>
                  Payment processing will be
                  connected to the BAP payment
                  service.
                </p>

              </div>

            </div>

          </div>


          {/* PLACE ORDER */}

          <button
            type="submit"
            className="bap-button bap-button-primary bap-button-full checkout-submit"
            disabled={loading}
          >
            {loading
              ? "Placing order..."
              : `Place Order • ${formatPrice(totalCents)}`}
          </button>

        </form>


        {/* =====================================
            RIGHT SIDE — ORDER SUMMARY
            ===================================== */}

        <aside className="checkout-summary">

          <div className="checkout-summary-card">

            <h2>
              Your order
            </h2>


            <div className="summary-items">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="summary-item"
                >

                  <div>

                    <strong>
                      {item.quantity} ×{" "}
                      {item.name}
                    </strong>

                    <span>
                      {formatPrice(
                        item.priceCents
                      )}{" "}
                      each
                    </span>

                  </div>

                  <strong>
                    {formatPrice(
                      item.priceCents *
                      item.quantity
                    )}
                  </strong>

                </div>

              ))}

            </div>


            <div className="summary-divider" />


            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                {formatPrice(
                  subtotalCents
                )}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Delivery
              </span>

              <strong>
                {formatPrice(
                  deliveryFeeCents
                )}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Service fee
              </span>

              <strong>
                {formatPrice(
                  serviceFeeCents
                )}
              </strong>

            </div>


            <div className="summary-divider" />


            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                {formatPrice(
                  totalCents
                )}
              </strong>

            </div>


            <p className="checkout-security">
              🔒 Your payment information
              is securely processed.
            </p>

          </div>

        </aside>

      </div>

    </div>
  );
}