import { Link } from "react-router-dom";

export default function Cart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const totalCents = cart.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">← Browse restaurants</Link>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <Link to="/">← Continue shopping</Link>

      <h1 style={{ marginTop: "20px" }}>Your Cart 🛒</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 0",
            borderBottom: "1px solid #ddd",
          }}
        >
          <div>
            <h3>{item.name}</h3>
            <p>
              ${(item.priceCents / 100).toFixed(2)} ×{" "}
              {item.quantity}
            </p>
          </div>

          <strong>
            $
            {(
              (item.priceCents * item.quantity) /
              100
            ).toFixed(2)}
          </strong>
        </div>
      ))}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
        }}
      >
        <h2>Total</h2>
        <h2>${(totalCents / 100).toFixed(2)}</h2>
      </div>

      <Link to="/checkout">
        <button
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Proceed to Checkout →
        </button>
      </Link>
    </div>
  );
}
