import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client";
import "../components/css/Register.css";

import Button from "../components/common/Button";
import Input from "../components/common/Input";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";


export default function Register() {
  const { setAuthState } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // address: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existingItem = cart.find(cartItem => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...item,
      quantity: 1,
      priceCents: item.priceCents || item.price * 100, // Convert if needed
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  // Optional: Show a notification
}

  // Handler specifically for react-phone-number-input
  function handlePhoneChange(value) {
    setForm((current) => ({
      ...current,
      phone: value || "",
    }));
  }

  async function handleRegister(e) {
    // Prevent default native HTML form submission (prevents query params in URL)
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setError("");
    setSuccess("");

    // Front-end Validation Guard
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      // !form.address ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        // address: form.address,
        password: form.password,
      });

      const { accessToken, refreshToken, user } = data || {};

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        if (setAuthState) {
          setAuthState({ user, token: accessToken });
        }
      }

      setSuccess("Account created successfully! Redirecting to sign in page in 6 seconds...");

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        // address: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 6000);

    } catch (err) {
      console.error("Registration error:", err);
      const serverMsg = err.response?.data?.message;
      const message = Array.isArray(serverMsg) ? serverMsg.join(" • ") : serverMsg;
      setError(message || "Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        {/* LOGO */}
        <Link to="/" className="register-logo">
          <span>🍔</span>
          BOUF
          <span className="register-logo-accent"> À LAPORT</span>
        </Link>

        {/* HEADER */}
        <div className="register-header">
          <h1>Create your account</h1>
          <p>Join BAP and start ordering your favorite meals.</p>
        </div>

        {/* REGISTER CARD */}
        <div className="register-card">
          <form onSubmit={handleRegister}>
            {error && <div className="register-error">{error}</div>}
            
            {/* SUCCESS MESSAGE BANNER */}
            {success && (
              <div 
                className="register-success" 
                style={{
                  padding: "12px 16px",
                  marginBottom: "16px",
                  backgroundColor: "#d4edda",
                  color: "#155724",
                  border: "1px solid #c3e6cb",
                  borderRadius: "6px",
                  fontSize: "14px",
                  textAlign: "center"
                }}
              >
                {success}
              </div>
            )}

            {/* NAME */}
            <div className="register-row">
              <div className="register-field">
                <label htmlFor="firstName">First name</label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  autoComplete="given-name"
                  disabled={!!success}
                />
              </div>

              <div className="register-field">
                <label htmlFor="lastName">Last name</label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  autoComplete="family-name"
                  disabled={!!success}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="register-field">
              <label htmlFor="email">Email address</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={!!success}
              />
            </div>

            {/* PHONE NUMBER */}
            <div className="register-field">
              <label htmlFor="phone">Phone number*</label>
              <PhoneInput
                id="phone"
                international
                defaultCountry="US"
                value={form.phone}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                disabled={!!success}
              />
            </div>

            {/* ADDRESS (COMMENTED) */}
            {/* 
            <div className="register-field">
              <label htmlFor="address">Delivery address</label>
              <Input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Main St, Apt, City, Zip"
                autoComplete="street-address"
                disabled={!!success}
              />
            </div> 
            */}

            {/* PASSWORD */}
            <div className="register-field">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                disabled={!!success}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="register-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={!!success}
              />
            </div>

            {/* TERMS */}
            <p className="register-terms">
              By creating an account, you agree to BAP's terms of service and
              privacy policy.
            </p>

            {/* SUBMIT */}
            <Button type="submit" variant="primary" fullWidth disabled={loading || !!success}>
              {loading ? "Creating account..." : success ? "Account Created!" : "Create Account →"}
            </Button>
          </form>

          {/* LOGIN */}
          <div className="register-login">
            <span>Already have an account?</span>
            <Link to="/login">Sign in</Link>
          </div>
        </div>

        {/* BACK */}
        <Link to="/" className="register-back">
          ← Back to BAP
        </Link>
      </div>
    </div>
  );
}