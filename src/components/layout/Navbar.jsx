import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import "../css/Navbar.css";

export default function Navbar({
  showCart = true,
  showCategories = true,
  showRestaurants = true,
}) {
  const {
    user,
    isAuthenticated,
    loading,
    logout,
  } = useAuth();

  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  function handleLogout() {
    setProfileOpen(false);
    logout();
    navigate("/");
  }

  const displayName = user?.firstName || user?.name || user?.email || "Account";

  return (
    <>
      <nav className="bap-navbar">
        {/* LOGO */}
        <Link to="/" className="bap-logo">
          <span className="bap-logo-icon">🍔</span>
          BOUF
          <span className="bap-logo-accent"> À LAPORT</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="bap-nav-links">
          <Link to="/">Home</Link>

          {showRestaurants && (
            <Link to="/restaurants">Restaurants</Link>
          )}

          {showCategories && (
            <Link to="/#categories">Categories</Link>
          )}

          {isAuthenticated && (
            <Link to="/orders">Orders</Link>
          )}

          {/* AUTHENTICATION CONTROL */}
          {!loading && isAuthenticated && user ? (
            <button
              type="button"
              className="bap-nav-account"
              onClick={() => setProfileOpen(true)}
            >
              <span>👤</span>
              <span>{displayName}</span>
            </button>
          ) : !loading ? (
            <div className="bap-auth-links" style={{ display: "inline-flex", gap: "12px" }}>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Register</Link>
            </div>
          ) : null}

          {/* CART */}
          {showCart && (
            <Link to="/cart" className="bap-nav-cart">
              🛒 Cart
            </Link>
          )}
        </div>
      </nav>

      {/* PROFILE DRAWER */}
      {profileOpen && user && (
        <>
          <div
            className="bap-profile-overlay"
            onClick={() => setProfileOpen(false)}
          />

          <aside className="bap-profile-drawer">
            <div className="bap-profile-header">
              <div>
                <span className="bap-profile-label">MY ACCOUNT</span>
                <h2>Welcome, {user.firstName || displayName}</h2>
              </div>

              <button
                type="button"
                className="bap-profile-close"
                onClick={() => setProfileOpen(false)}
                aria-label="Close profile"
              >
                ×
              </button>
            </div>

            <div className="bap-profile-avatar">👤</div>

            <div className="bap-profile-name">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : displayName}
            </div>

            {user.role && (
              <div className="bap-profile-role">{user.role}</div>
            )}

            <div className="bap-profile-info">
              <div className="bap-profile-field">
                <span>EMAIL</span>
                <strong>{user.email || "Not provided"}</strong>
              </div>

              <div className="bap-profile-field">
                <span>PHONE</span>
                <strong>{user.phone || "Not provided"}</strong>
              </div>

              <div className="bap-profile-field">
                <span>ACCOUNT</span>
                <strong>{user.role || "Customer"}</strong>
              </div>
            </div>

            <div className="bap-profile-actions">
              <Link
                to="/"
                className="bap-profile-home"
                onClick={() => setProfileOpen(false)}
              >
                ← Continue Ordering
              </Link>

              <button
                type="button"
                className="bap-profile-logout"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}