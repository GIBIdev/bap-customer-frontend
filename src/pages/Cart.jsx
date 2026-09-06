import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/layout/Navbar";
import "../components/css/Checkout.css";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    instructions: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (savedCart.length === 0) {
      navigate("/cart");
    }
    setCart(savedCart);

    // Pre-fill user data if authenticated
    if (user) {
      setFormData(prev => ({
        ...prev,
        address: user.address || "",
        phone: user.phone || "",
      }));
    }
  }, [navigate, user]);

  function formatPrice(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  const totalCents = cart.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const deliveryFee = totalCents > 0 ? 299 : 0; // $2.99 delivery fee
  const tax = Math.round(totalCents * 0.08); // 8% tax
  const grandTotal = totalCents + deliveryFee + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate form
    if (!formData.address || !formData.city || !formData.zipCode) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Prepare order data
    const orderData = {
      items: cart,
      total: grandTotal,
      subtotal: totalCents,
      deliveryFee,
      tax,
      customer: {
        name: user?.name || "Guest",
        email: user?.email || "",
        phone: formData.phone,
      },
      deliveryAddress: {
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        instructions: formData.instructions,
      },
      paymentMethod,
    };

    try {
      // Call your backend API
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const result = await response.json();
      
      // If payment method is card, redirect to payment
      if (paymentMethod === "card") {
        // Redirect to payment processing
        navigate(`/payment/${result.orderId}`);
      } else {
        // Cash on delivery - mark as success
        setSuccess(true);
        localStorage.removeItem("cart");
        setTimeout(() => {
          navigate("/order-tracking");
        }, 3000);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <div className="checkout-success">
          <div className="success-icon">✅</div>
          <h1>Order Placed Successfully!</h1>
          <p>Your order has been confirmed and will be delivered soon.</p>
          <Link to="/" className="checkout-primary-button">
            Continue Shopping
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="checkout-page">
        <div className="checkout-header">
          <Link to="/cart" className="checkout-back">
            ← Back to Cart
          </Link>
          <h1>Checkout</h1>
        </div>

        <div className="checkout-layout">
          {/* LEFT - Order Form */}
          <div className="checkout-form">
            {error && <div className="checkout-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Delivery Address */}
              <div className="checkout-section">
                <h2>Delivery Address</h2>
                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Zip Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 555-5555"
                  />
                </div>

                <div className="form-group">
                  <label>Delivery Instructions (Optional)</label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    placeholder="Gate code, building number, etc."
                    rows="3"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-section">
                <h2>Payment Method</h2>
                <div className="payment-methods">
                  <button
                    type="button"
                    className={`payment-method ${paymentMethod === "card" ? "active" : ""}`}
                    onClick={() => handlePaymentMethodChange("card")}
                  >
                    💳 Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    className={`payment-method ${paymentMethod === "cash" ? "active" : ""}`}
                    onClick={() => handlePaymentMethodChange("cash")}
                  >
                    💵 Cash on Delivery
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="card-details">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          disabled={loading}
                        />
                      </div>
                      <div className="form-group">
                        <label>CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <p className="card-note">🔒 Secure payment processed by Stripe</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="checkout-submit"
                disabled={loading}
              >
                {loading ? "Processing..." : `Place Order • ${formatPrice(grandTotal)}`}
              </button>
            </form>
          </div>

          {/* RIGHT - Order Summary */}
          <aside className="checkout-summary">
            <div className="checkout-summary-card">
              <h2>Order Summary</h2>
              <p className="order-items-count">{totalItems} items</p>

              <div className="summary-items">
                {cart.map(item => (
                  <div key={item.id} className="summary-item">
                    <span>{item.quantity}× {item.name}</span>
                    <span>{formatPrice(item.priceCents * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-divider" />

              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(totalCents)}</span>
              </div>

              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
              </div>

              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-total">
                <span>Total</span>
                <strong>{formatPrice(grandTotal)}</strong>
              </div>

              {!isAuthenticated && (
                <div className="checkout-guest-note">
                  <p>💡 <Link to="/login">Sign in</Link> to save your address and track orders</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}