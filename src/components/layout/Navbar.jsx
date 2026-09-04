import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "../css/Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Route state checks
  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  const firstName =
    user?.firstName ||
    user?.name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Account";

  return (
    <nav className="bap-navbar">
      <Link to="/" className="bap-logo">
        <span className="bap-logo-icon">🍔</span>
        BOUF
        <span className="bap-logo-accent"> À LAPORT</span>
      </Link>

      <div className="bap-nav-links">
        {!isHomePage && <Link to="/">Home</Link>}

        <a href="/#restaurants">Restaurants</a>
        <a href="/#categories">Categories</a>

        {isAuthenticated && user ? (
          <>
            <Link to="/profile" className="bap-nav-account">
              <span className="avatar-icon">👤</span>
              <span>{firstName}</span>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="bap-logout-btn"
              title="Sign out of your account"
            >
              <span>Logout</span>
              <span style={{ fontSize: "14px" }}>🚪</span>
            </button>
          </>
        ) : (
          <>
            {/* 
              AUTH BUTTON DISPLAY LOGIC:
              - Hide 'Sign In' button when user is on '/login'
              - Hide 'Register' button when user is on '/register'
            */}
            {!isLoginPage && <Link to="/login">Sign In</Link>}

            {!isRegisterPage && (
              <Link to="/register" className="registerButton">
                Register
              </Link>
            )}
          </>
        )}

        <Link to="/cart" className="bap-nav-cart">
          🛒 Cart
        </Link>
      </div>
    </nav>
  );
}