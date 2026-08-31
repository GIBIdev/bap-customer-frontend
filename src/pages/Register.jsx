import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../components/css/Register.css";
import Button from "../components/common/Button.jsx"

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleRegister(e) {
    e.preventDefault();

    setError("");

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Create the customer account.
       */
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create account."
        );
      }

      /*
       * If registration returns an access token,
       * automatically sign the customer in.
       */
      if (data.accessToken) {
        await login(form.email, form.password);
        navigate("/");
        return;
      }

      /*
       * If registration does not automatically authenticate
       * the customer, send them to Login.
       */
      navigate("/login");

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.message ||
        "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">

      <div className="register-container">

        {/* LOGO */}

        <Link
          to="/"
          className="register-logo"
        >
          <span>🍔</span>
          BOUF
          <span className="register-logo-accent">
            {" "}À LAPORT
          </span>
        </Link>


        {/* HEADER */}

        <div className="register-header">

          <h1>Create your account</h1>

          <p>
            Join BAP and start ordering your
            favorite meals.
          </p>

        </div>


        {/* REGISTER CARD */}

        <div className="register-card">

          <form onSubmit={handleRegister}>

            {error && (
              <div className="register-error">
                {error}
              </div>
            )}


            {/* NAME */}

            <div className="register-row">

              <div className="register-field">

                <label htmlFor="firstName">
                  First name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  autoComplete="given-name"
                />

              </div>


              <div className="register-field">

                <label htmlFor="lastName">
                  Last name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  autoComplete="family-name"
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="register-field">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />

            </div>


            {/* PASSWORD */}

            <div className="register-field">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="register-field">

              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />

            </div>


            {/* TERMS */}

            <p className="register-terms">
              By creating an account, you agree to
              BAP's terms of service and privacy policy.
            </p>


            {/* SUBMIT */}



        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account →"}
        </Button>

          </form>


          {/* LOGIN */}

          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>


        {/* BACK */}

        <Link
          to="/"
          className="register-back"
        >
          ← Back to BAP
        </Link>

      </div>

    </div>
  );
}