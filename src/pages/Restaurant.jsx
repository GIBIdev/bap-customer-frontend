import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000/api/v1";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80";

export default function Restaurant() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchRestaurant();
    loadCart();
  }, [id]);

  async function fetchRestaurant() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/restaurants/${id}`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Restaurant request failed: ${response.status}`);
      }

      const data = await response.json();
      setRestaurant(data);
    } catch (err) {
      console.error("Restaurant error:", err);
      setError("Unable to load this restaurant.");
    } finally {
      setLoading(false);
    }
  }

  function loadCart() {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (Array.isArray(savedCart)) {
        setCart(savedCart);
      }
    } catch (err) {
      console.error("Cart error:", err);
      setCart([]);
    }
  }

  function addToCart(item) {
    try {
      const existingCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      const currentCart = Array.isArray(existingCart)
        ? existingCart
        : [];

      const existingItem = currentCart.find(
        (cartItem) => cartItem.id === item.id
      );

      let updatedCart;

      if (existingItem) {
        updatedCart = currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: (cartItem.quantity || 1) + 1,
              }
            : cartItem
        );
      } else {
        updatedCart = [
          ...currentCart,
          {
            id: item.id,
            name: item.name,
            description: item.description || "",
            priceCents: item.priceCents,
            quantity: 1,
            imageKey: item.imageKey || null,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
          },
        ];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
    } catch (err) {
      console.error("Unable to add item:", err);
    }
  }

  function getCartQuantity(itemId) {
    const item = cart.find((cartItem) => cartItem.id === itemId);
    return item?.quantity || 0;
  }

  function formatPrice(priceCents) {
    return `$${(Number(priceCents || 0) / 100).toFixed(2)}`;
  }

  function getImage(item) {
    /*
      Your API currently has imageKey:null.

      Once real image URLs are available, we can use them here.
      For now every menu item gets a professional food thumbnail.
    */

    if (item.imageUrl) {
      return item.imageUrl;
    }

    return FALLBACK_IMAGE;
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loading}>
          Loading restaurant...
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBox}>
          <h2>Restaurant unavailable</h2>
          <p>{error || "Restaurant not found."}</p>

          <Link to="/restaurants" style={styles.backButton}>
            ← Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const categories = Array.isArray(restaurant.categories)
    ? restaurant.categories
    : [];

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <Link to="/" style={styles.logo}>
          🍔 <span>BOUF</span>
          <strong>À LAPORT</strong>
        </Link>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>
            Home
          </Link>

          <Link to="/restaurants" style={styles.navLink}>
            Restaurants
          </Link>

          <Link to="/categories" style={styles.navLink}>
            Categories
          </Link>

          <Link to="/orders" style={styles.navLink}>
            Orders
          </Link>

          <Link to="/profile" style={styles.navLink}>
            👤 Profile
          </Link>

          <Link to="/cart" style={styles.cartButton}>
            🛒 Cart
            {cart.length > 0 && (
              <span style={styles.cartBadge}>
                {cart.reduce(
                  (total, item) => total + (item.quantity || 0),
                  0
                )}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* RESTAURANT HEADER */}
      <main style={styles.container}>
        <Link to="/restaurants" style={styles.backLink}>
          ← Back to restaurants
        </Link>

        <section style={styles.restaurantHeader}>
          <div style={styles.restaurantHero}>
            <img
              src={FALLBACK_IMAGE}
              alt={restaurant.name}
              style={styles.restaurantHeroImage}
            />

            <div style={styles.restaurantHeroOverlay}>
              <h1>{restaurant.name}</h1>

              <p>
                {restaurant.description ||
                  "Delicious food delivered to your door."}
              </p>
            </div>
          </div>

          <div style={styles.restaurantInfo}>
            <span>⭐ 4.8</span>
            <span>•</span>
            <span>30–45 min</span>
            <span>•</span>
            <span>Free delivery</span>
          </div>
        </section>

        {/* MENU */}
        <section style={styles.menuSection}>
          <div style={styles.menuTitle}>
            <div>
              <h2>Menu</h2>
              <p>Choose something delicious.</p>
            </div>

            <Link to="/cart" style={styles.viewCartButton}>
              View Cart
            </Link>
          </div>

          {categories.length === 0 ? (
            <div style={styles.emptyMenu}>
              <h3>No menu items yet</h3>
              <p>This restaurant hasn't added a menu yet.</p>
            </div>
          ) : (
            categories.map((category) => {
              const items = Array.isArray(category.items)
                ? category.items
                : [];

              return (
                <section
                  key={category.id || category.name}
                  style={styles.category}
                >
                  <div style={styles.categoryHeader}>
                    <h2>{category.name}</h2>

                    <span>
                      {items.length}{" "}
                      {items.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div>
                    {items.map((item) => {
                      const quantity = getCartQuantity(item.id);

                      return (
                        <article
                          key={item.id}
                          style={styles.menuItem}
                        >
                          {/* SMALL FOOD IMAGE */}
                          <img
                            src={getImage(item)}
                            alt={item.name}
                            style={styles.menuItemImage}
                            onError={(event) => {
                              event.currentTarget.src =
                                FALLBACK_IMAGE;
                            }}
                          />

                          {/* ITEM DETAILS */}
                          <div style={styles.menuItemInfo}>
                            <h3>{item.name}</h3>

                            {item.description && (
                              <p>{item.description}</p>
                            )}

                            <strong>
                              {formatPrice(item.priceCents)}
                            </strong>
                          </div>

                          {/* ADD BUTTON */}
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            style={styles.addButton}
                          >
                            {quantity > 0
                              ? `+ Add (${quantity})`
                              : "+ Add"}
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div>
          <strong>🍔 BOUF À LAPORT</strong>
          <p>Good food. Fast delivery. Your way.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#171717",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },

  navbar: {
    height: "76px",
    padding: "0 5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #eeeeee",
    background: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  logo: {
    textDecoration: "none",
    fontSize: "21px",
    fontWeight: 800,
    color: "#171717",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  logo: {
    textDecoration: "none",
    fontSize: "21px",
    fontWeight: 800,
    color: "#171717",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },

  navLink: {
    textDecoration: "none",
    color: "#4b4b4b",
    fontWeight: 600,
    fontSize: "15px",
  },

  cartButton: {
    position: "relative",
    textDecoration: "none",
    color: "#ffffff",
    background: "#ff4b0b",
    padding: "14px 20px",
    borderRadius: "12px",
    fontWeight: 700,
  },

  cartBadge: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    width: "23px",
    height: "23px",
    borderRadius: "50%",
    background: "#171717",
    color: "#ffffff",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    width: "min(1040px, 90%)",
    margin: "0 auto",
    padding: "30px 0 80px",
  },

  backLink: {
    display: "inline-block",
    color: "#666666",
    textDecoration: "none",
    fontWeight: 600,
    marginBottom: "24px",
  },

  restaurantHeader: {
    marginBottom: "45px",
  },

  restaurantHero: {
    height: "300px",
    borderRadius: "22px",
    overflow: "hidden",
    position: "relative",
    background: "#ff4b0b",
  },

  restaurantHeroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  restaurantHeroOverlay: {
    position: "absolute",
    inset: 0,
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    background:
      "linear-gradient(transparent 30%, rgba(0,0,0,.78))",
    color: "#ffffff",
  },

  "restaurantHeroOverlay h1": {
    fontSize: "42px",
    margin: 0,
    fontWeight: 800,
  },

  "restaurantHeroOverlay p": {
    margin: "8px 0 0",
    fontSize: "17px",
  },

  restaurantInfo: {
    display: "flex",
    gap: "12px",
    marginTop: "18px",
    color: "#666666",
    fontWeight: 600,
  },

  menuSection: {
    marginTop: "30px",
  },

  menuTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "30px",
  },

  "menuTitle h2": {
    fontSize: "34px",
    margin: 0,
  },

  "menuTitle p": {
    margin: "6px 0 0",
    color: "#777777",
  },

  viewCartButton: {
    textDecoration: "none",
    background: "#171717",
    color: "#ffffff",
    padding: "13px 20px",
    borderRadius: "10px",
    fontWeight: 700,
  },

  category: {
    marginBottom: "40px",
  },

  categoryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  "categoryHeader h2": {
    margin: 0,
    fontSize: "25px",
  },

  "categoryHeader span": {
    color: "#777777",
    fontSize: "14px",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "16px",
    marginBottom: "12px",
    border: "1px solid #eeeeee",
    borderRadius: "16px",
    background: "#ffffff",
    boxShadow: "0 4px 16px rgba(0,0,0,.04)",
  },

  /*
    SMALL MENU IMAGE
  */
  menuItemImage: {
    width: "92px",
    height: "92px",
    minWidth: "92px",
    objectFit: "cover",
    borderRadius: "13px",
    display: "block",
    background: "#f3f3f3",
  },

  menuItemInfo: {
    flex: 1,
    minWidth: 0,
  },

  "menuItemInfo h3": {
    margin: "0 0 7px",
    fontSize: "18px",
    fontWeight: 800,
  },

  "menuItemInfo p": {
    margin: "0 0 10px",
    color: "#777777",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  "menuItemInfo strong": {
    color: "#ff4b0b",
    fontSize: "16px",
  },

  addButton: {
    border: "none",
    background: "#ff4b0b",
    color: "#ffffff",
    padding: "12px 17px",
    borderRadius: "10px",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  emptyMenu: {
    padding: "50px",
    textAlign: "center",
    border: "1px solid #eeeeee",
    borderRadius: "16px",
    color: "#666666",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: 700,
  },

  errorBox: {
    width: "min(600px, 90%)",
    margin: "100px auto",
    textAlign: "center",
    padding: "50px",
    border: "1px solid #eeeeee",
    borderRadius: "20px",
  },

  backButton: {
    display: "inline-block",
    marginTop: "20px",
    background: "#ff4b0b",
    color: "#ffffff",
    padding: "13px 20px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: 700,
  },

  footer: {
    background: "#171717",
    color: "#ffffff",
    padding: "50px 5%",
  },
};