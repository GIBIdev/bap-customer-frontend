/**
 * 
 * A class that handles our navigation bar
 * 
 */
import { Link } from "react-router-dom";
import "../css/Navbar.css";

export default function Navbar({ showCart = true, showCategories = true, showRestaurants = true }) {
  return (
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

        <Link to="/login">
          Sign In
        </Link>

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
  );
}