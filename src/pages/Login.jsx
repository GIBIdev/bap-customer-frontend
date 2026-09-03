import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import Button from "../components/common/Button";
import Input from "../components/common/Input";

import "../components/css/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await login(email, password);

      console.log("LOGIN RESPONSE:", data);

      // Return to the restaurant home/hero after login.
      // AuthContext now contains the authenticated user.
      navigate("/");
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        "Unable to sign in. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-header">
          <Link to="/" className="login-logo">
            <span>🍔</span>
            BOUF
            <span className="login-logo-accent">
              {" "}À LAPORT
            </span>
          </Link>

          <h1>Welcome back</h1>

          <p>
            Sign in to your BAP account and continue ordering
            your favorite meals.
          </p>
        </div>

        <div className="login-card">
          <form onSubmit={handleLogin}>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <div className="login-field">
              <label htmlFor="email">
                Email address
              </label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="login-field">
              <div className="login-password-header">
                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => {
                    setError(
                      "Password recovery will be available soon."
                    );
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </Button>
          </form>

          <div className="login-register">
            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create an account
            </Link>
          </div>
        </div>

        <Link to="/" className="login-back">
          ← Back to BAP
        </Link>

      </div>
    </div>
  );
}