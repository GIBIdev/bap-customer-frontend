import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Restaurant from "./pages/Restaurant.jsx";
import OrderTracking from "./pages/OrderTracking.jsx";

import AppLayout from "./components/layout/AppLayout.jsx";

export default function App() {
  return (
    <Routes>
      {/* HOME — has its own Footer */}
      <Route path="/" element={<Home />} />

      {/* SECONDARY PAGES — use AppLayout */}
      <Route
        path="/login"
        element={
          <AppLayout>
            <Login />
          </AppLayout>
        }
      />

      <Route
        path="/register"
        element={
          <AppLayout>
            <Register />
          </AppLayout>
        }
      />

      <Route
        path="/cart"
        element={
          <AppLayout>
            <Cart />
          </AppLayout>
        }
      />

      <Route
        path="/checkout"
        element={
          <AppLayout>
            <Checkout />
          </AppLayout>
        }
      />

      <Route
        path="/restaurant/:id"
        element={
          <AppLayout>
            <Restaurant />
          </AppLayout>
        }
      />

      <Route
        path="/order-tracking/:id"
        element={
          <AppLayout>
            <OrderTracking />
          </AppLayout>
        }
      />
    </Routes>
  );
}