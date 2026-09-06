import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/layout/Navbar";
import "../components/css/OrderTracking.css";

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // If not authenticated, try to get orders from localStorage
      if (!token) {
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrders(savedOrders);
        setLoading(false);
        return;
      }

      // Fetch from your NestJS backend
      const response = await fetch("http://localhost:3000/api/v1/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        // Also save to localStorage for offline access
        localStorage.setItem("orders", JSON.stringify(data));
      } else if (response.status === 401) {
        // If unauthorized, check localStorage
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrders(savedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Fallback to localStorage
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(savedOrders);
    } finally {
      setLoading(false);
    }
  };

  function formatPrice(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function getStatusColor(status) {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "paid":
      case "confirmed":
        return "#28a745";
      case "preparing":
        return "#ff6b00";
      case "delivering":
        return "#17a2b8";
      case "delivered":
        return "#6c757d";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="tracking-loading">Loading your orders...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="tracking-page">
        <h1>Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="tracking-empty">
            <p>You haven't placed any orders yet.</p>
            <a href="/" className="tracking-browse">
              Browse Restaurants →
            </a>
          </div>
        ) : (
          <div className="tracking-list">
            {orders.map((order) => (
              <div key={order.id} className="tracking-card">
                <div className="tracking-header">
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p className="tracking-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div 
                    className="tracking-status"
                    style={{ background: getStatusColor(order.status) }}
                  >
                    {order.status || "pending"}
                  </div>
                </div>
                
                <div className="tracking-items">
                  {(order.items || []).map((item) => (
                    <div key={item.id} className="tracking-item">
                      <span>{item.quantity}× {item.name}</span>
                      <span>{formatPrice((item.price || 0) * 100)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="tracking-total">
                  <strong>Total: ${(order.total || 0).toFixed(2)}</strong>
                </div>
                {order.deliveryAddress && (
                  <div className="tracking-address">
                    <small>Delivering to: {order.deliveryAddress.address}, {order.deliveryAddress.city}</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}