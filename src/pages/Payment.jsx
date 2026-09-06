import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/layout/Navbar";
import "../components/css/Payment.css";

export default function Payment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/v1/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        throw new Error("Failed to fetch order");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Could not load order details");
    }
  };

  const processPayment = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      // Call your NestJS payment endpoint
      const response = await fetch(`http://localhost:3000/api/v1/orders/${orderId}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethod: "card",
          amount: order?.total || 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment failed");
      }

      const result = await response.json();
      
      if (result.success || result.status === "paid") {
        localStorage.removeItem("cart");
        // Update order status in localStorage
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
          orders[orderIndex].status = "paid";
          localStorage.setItem("orders", JSON.stringify(orders));
        }
        
        setSuccess(true);
        setTimeout(() => {
          navigate("/order-tracking");
        }, 3000);
      } else {
        throw new Error(result.message || "Payment failed");
      }
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="payment-loading">Loading order details...</div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="payment-success">
          <div className="success-icon">✅</div>
          <h1>Payment Successful!</h1>
          <p>Your order has been confirmed. Track your delivery status.</p>
          <button
            onClick={() => navigate("/order-tracking")}
            className="payment-primary-button"
          >
            Track Order
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="payment-page">
        <div className="payment-container">
          <h1>Complete Payment</h1>

          {error && <div className="payment-error">{error}</div>}

          <div className="payment-order-summary">
            <h3>Order Summary</h3>
            <p>Order #{order.id}</p>
            <p className="payment-amount">Total: ${order.total.toFixed(2)}</p>
          </div>

          <div className="payment-card-preview">
            <div className="payment-card">
              <div className="card-header">
                <span>💳</span>
                <span>Secure Payment</span>
              </div>
              <div className="card-number">•••• •••• •••• 4242</div>
              <div className="card-details">
                <span>Expires: 12/26</span>
                <span>CVV: •••</span>
              </div>
            </div>
          </div>

          <button
            onClick={processPayment}
            className="payment-button"
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay $${order.total.toFixed(2)}`}
          </button>

          <button
            onClick={() => navigate(`/checkout`)}
            className="payment-back"
          >
            ← Back to Checkout
          </button>
        </div>
      </div>
    </>
  );
}