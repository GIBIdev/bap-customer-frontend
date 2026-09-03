import { useState } from "react";
import { Link } from "react-router-dom";
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

  const [profileOpen, setProfileOpen] = useState(false);

  function handleLogout() {
    setProfileOpen(false);
    logout();
  }

  return (
    <>
      <nav className="bap-navbar">

        <Link to="/" className="bap-logo">
          <span className="bap-logo-icon">
            🍔
          </span>

          BOUF

          <span className="bap-logo-accent">
            À LAPORT
          </span>
        </Link>

        <div className="bap-nav-links">

          {showRestaurants && (
            <Link to="/#restaurants">
              Restaurants
            </Link>
          )}

          {showCategories && (
            <Link to="/">
              Categories
            </Link>
          )}

          {!loading && isAuthenticated && user ? (
            <button
              type="button"
              className="bap-nav-account"
              onClick={() => setProfileOpen(true)}
            >
              <span>👤</span>

              <span>
                {user.firstName}
              </span>
            </button>
          ) : !loading ? (
            <Link to="/login">
              Sign In
            </Link>
          ) : null}

          {showCart && (
            <Link
              to="/cart"
              className="bap-nav-cart"
            >
              🛒 Cart
            </Link>
          )}

        </div>
      </nav>

      {profileOpen && user && (
        <>
          <div
            className="bap-profile-overlay"
            onClick={() => setProfileOpen(false)}
          />

          <aside className="bap-profile-drawer">

            <div className="bap-profile-header">

              <div>
                <span className="bap-profile-label">
                  MY ACCOUNT
                </span>

                <h2>
                  Welcome, {user.firstName}
                </h2>
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

            <div className="bap-profile-avatar">
              👤
            </div>

            <div className="bap-profile-name">
              {user.firstName} {user.lastName}
            </div>

            <div className="bap-profile-role">
              {user.role}
            </div>

            <div className="bap-profile-info">

              <div className="bap-profile-field">
                <span>
                  EMAIL
                </span>

                <strong>
                  {user.email}
                </strong>
              </div>

              <div className="bap-profile-field">
                <span>
                  PHONE
                </span>

                <strong>
                  {user.phone || "Not provided"}
                </strong>
              </div>

              <div className="bap-profile-field">
                <span>
                  ACCOUNT
                </span>

                <strong>
                  {user.role}
                </strong>
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