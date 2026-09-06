import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000/api/v1";

const categories = [
  { icon: "🍔", name: "Burgers" },
  { icon: "🍕", name: "Pizza" },
  { icon: "🍣", name: "Sushi" },
  { icon: "🌮", name: "Mexican" },
  { icon: "🥗", name: "Healthy" },
  { icon: "🍰", name: "Desserts" },
];

const FALLBACK_IMAGE =
  "https://placehold.co/900x600/ff4f0a/ffffff?text=BOUF+A+LAPORT";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notification, setNotification] = useState(null);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /**
   * Fetch restaurants from the production API.
   *
   * VITE_API_URL should be configured per environment:
   *
   * Development:
   * VITE_API_URL=http://localhost:3000/api/v1
   *
   * Production:
   * VITE_API_URL=https://api.yourdomain.com/api/v1
   */
  const fetchRestaurants = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/restaurants`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal,
      });

      if (!response.ok) {
        throw new Error(
          `Restaurant API returned HTTP ${response.status}`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid restaurant response from API");
      }

      setRestaurants(data);
    } catch (err) {
      // Ignore intentional AbortController cancellation.
      if (err.name === "AbortError") {
        return;
      }

      console.error("Failed to load restaurants:", err);

      setRestaurants([]);
      setError(
        "We couldn't load restaurants right now. Please try again."
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchRestaurants(controller.signal);

    return () => controller.abort();
  }, [fetchRestaurants]);

  /**
   * Safely display a notification and automatically remove it.
   */
  const showNotification = useCallback((message) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification(null);
    }, 2500);
  }, []);

  /**
   * Add a menu item to the local cart.
   */
  const addToCart = useCallback(
    (restaurant, item) => {
      if (!restaurant?.id || !item?.id) {
        showNotification("Unable to add this item to your cart.");
        return;
      }

      try {
        const storedCart = localStorage.getItem("cart");

        let cart = [];

        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);

          if (Array.isArray(parsedCart)) {
            cart = parsedCart;
          }
        }

        const existingItem = cart.find(
          (cartItem) =>
            cartItem.id === item.id &&
            cartItem.restaurantId === restaurant.id
        );

        if (existingItem) {
          existingItem.quantity =
            Number(existingItem.quantity || 0) + 1;
        } else {
          const price =
            Number(item.price) > 0 ? Number(item.price) : 9.99;

          cart.push({
            id: item.id,
            name: item.name || "Menu item",
            priceCents: Math.round(price * 100),
            quantity: 1,
            description: item.description || "",
            image: restaurant.image || FALLBACK_IMAGE,
            restaurantName: restaurant.name || "Restaurant",
            restaurantId: restaurant.id,
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        showNotification(`✅ ${item.name || "Item"} added to cart!`);
      } catch (err) {
        console.error("Cart update failed:", err);
        showNotification(
          "Unable to update your cart. Please try again."
        );
      }
    },
    [showNotification]
  );

  const handleRestaurantClick = useCallback(
    (restaurantId) => {
      if (!restaurantId) return;

      navigate(`/restaurant/${restaurantId}`);
    },
    [navigate]
  );

  /**
   * Filter restaurants safely.
   */
  const filteredRestaurants = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedCategory = selectedCategory.toLowerCase();

    return restaurants.filter((restaurant) => {
      const name = String(restaurant?.name || "").toLowerCase();
      const cuisine = String(restaurant?.cuisine || "").toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        cuisine.includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "All" ||
        cuisine.includes(normalizedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [restaurants, search, selectedCategory]);

  /**
   * Get the first available menu item.
   */
  const getFirstMenuItem = useCallback((restaurant) => {
    if (
      Array.isArray(restaurant?.menuItems) &&
      restaurant.menuItems.length > 0
    ) {
      return restaurant.menuItems[0];
    }

    return null;
  }, []);

  /**
   * Format delivery fee safely.
   */
  const formatDeliveryFee = (fee) => {
    const numericFee = Number(fee);

    if (!Number.isFinite(numericFee) || numericFee === 0) {
      return "Free delivery";
    }

    return `$${numericFee.toFixed(2)} delivery`;
  };

  /**
   * Format restaurant rating safely.
   */
  const formatRating = (rating) => {
    const numericRating = Number(rating);

    if (!Number.isFinite(numericRating)) {
      return "New";
    }

    return numericRating.toFixed(1);
  };

  /**
   * Handle restaurant image failures.
   */
  const handleImageError = (event) => {
    if (event.currentTarget.src !== FALLBACK_IMAGE) {
      event.currentTarget.src = FALLBACK_IMAGE;
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loading}>
          Loading restaurants...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Notification */}
      {notification && (
        <div
          style={styles.notification}
          role="status"
          aria-live="polite"
        >
          {notification}
        </div>
      )}

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <Link to="/" style={styles.logo} aria-label="BOUF À LAPORT home">
          <span style={styles.logoIcon}>🍔</span>
          BOUF<span style={styles.logoAccent}> À LAPORT</span>
        </Link>

        <div style={styles.navLinks}>
          <a href="#restaurants" style={styles.navLink}>
            Restaurants
          </a>

          <a href="#categories" style={styles.navLink}>
            Categories
          </a>

          {isAuthenticated && user ? (
            <>
              <Link to="/profile" style={styles.profileButton}>
                👤 {user.name || user.email}
              </Link>

              <Link to="/cart" style={styles.cartButton}>
                🛒 Cart
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.loginButton}>
                Sign In
              </Link>

              <Link to="/register" style={styles.registerButton}>
                Register
              </Link>

              <Link to="/cart" style={styles.cartButton}>
                🛒 Cart
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>
            {isAuthenticated && user
              ? `👋 Welcome back, ${user.name || user.email}!`
              : "🔥 Delicious food, delivered fast"}
          </div>

          <h1 style={styles.heroTitle}>
            {isAuthenticated && user ? (
              <>
                Hello,{" "}
                {user.name?.split(" ")[0] || "Food Lover"}!
                <br />
                <span style={styles.heroAccent}>
                  Ready to order?
                </span>
              </>
            ) : (
              <>
                Your favorite food.
                <br />
                <span style={styles.heroAccent}>
                  Delivered to you.
                </span>
              </>
            )}
          </h1>

          <p style={styles.heroText}>
            {isAuthenticated && user
              ? "Welcome back! Discover new restaurants and get your favorite meals delivered right to your door."
              : "Discover the best restaurants around you and get your favorite meals delivered right to your door."}
          </p>

          <form
            style={styles.searchBox}
            onSubmit={(event) => event.preventDefault()}
            role="search"
          >
            <span style={styles.searchIcon}>🔍</span>

            <input
              type="search"
              placeholder="Search restaurants or cuisines..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={styles.searchInput}
              aria-label="Search restaurants or cuisines"
            />

            <button
              type="submit"
              style={styles.searchButton}
            >
              Search
            </button>
          </form>

          <div style={styles.heroStats}>
            <div>
              <strong>500+</strong>
              <span>Restaurants</span>
            </div>

            <div>
              <strong>30 min</strong>
              <span>Average delivery</span>
            </div>

            <div>
              <strong>4.8 ⭐</strong>
              <span>Average rating</span>
            </div>
          </div>
        </div>

        <div style={styles.heroImageWrapper}>
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85"
            alt="Selection of delicious food"
            style={styles.heroImage}
            loading="eager"
            fetchPriority="high"
            onError={handleImageError}
          />

          <div style={styles.deliveryCard}>
            <div style={styles.deliveryIcon}>🚴</div>

            <div>
              <strong>Fast delivery</strong>
              <p>Your food is on the way!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.smallTitle}>EXPLORE</p>
            <h2 style={styles.sectionTitle}>
              What are you craving?
            </h2>
          </div>
        </div>

        <div style={styles.categories}>
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            style={{
              ...styles.category,
              ...(selectedCategory === "All"
                ? styles.categoryActive
                : {}),
            }}
            aria-pressed={selectedCategory === "All"}
          >
            <span style={styles.categoryIcon}>✨</span>
            <span>All</span>
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category.name}
              onClick={() =>
                setSelectedCategory(category.name)
              }
              style={{
                ...styles.category,
                ...(selectedCategory === category.name
                  ? styles.categoryActive
                  : {}),
              }}
              aria-pressed={
                selectedCategory === category.name
              }
            >
              <span style={styles.categoryIcon}>
                {category.icon}
              </span>

              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* RESTAURANTS */}
      <section
        id="restaurants"
        style={styles.restaurantSection}
      >
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.smallTitle}>
              TOP PICKS FOR YOU
            </p>

            <h2 style={styles.sectionTitle}>
              Popular near you
            </h2>
          </div>

          <span style={styles.restaurantCount}>
            {filteredRestaurants.length} restaurants
          </span>
        </div>

        {error && (
          <div style={styles.errorBox} role="alert">
            <strong>Something went wrong.</strong>
            <p>{error}</p>

            <button
              type="button"
              style={styles.retryButton}
              onClick={() => {
                const controller = new AbortController();
                fetchRestaurants(controller.signal);
              }}
            >
              Try again
            </button>
          </div>
        )}

        {!error && filteredRestaurants.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: "50px" }}>😕</div>

            <h3>No restaurants found</h3>

            <p>
              Try searching for another restaurant or cuisine.
            </p>

            {(search || selectedCategory !== "All") && (
              <button
                type="button"
                style={styles.retryButton}
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredRestaurants.map((restaurant) => {
              const firstItem =
                getFirstMenuItem(restaurant);

              return (
                <div
                  key={restaurant.id}
                  style={styles.cardWrapper}
                >
                  <div
                    style={styles.card}
                    onClick={() =>
                      handleRestaurantClick(
                        restaurant.id
                      )
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();

                        handleRestaurantClick(
                          restaurant.id
                        );
                      }
                    }}
                  >
<div style={styles.imageContainer}>
  <img
    src={
      restaurant.name === "BouF À LaPort"
        ? "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=85"
        : restaurant.name === "Pizza Palace"
        ? "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85"
        : restaurant.name === "Taco House"
        ? "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=900&q=85"
        : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85"
    }
    alt={`${restaurant.name || "Restaurant"} food`}
    style={styles.restaurantImage}
    loading="lazy"
    onError={(event) => {
      event.currentTarget.src =
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85";
    }}
  />

  <div style={styles.favorite}>♡</div>

  <div style={styles.deliveryBadge}>
    ⚡ Fast delivery
  </div>
</div>

                    <div style={styles.cardContent}>
                      <div style={styles.cardTitleRow}>
                        <h3
                          style={styles.restaurantName}
                        >
                          {restaurant.name ||
                            "Restaurant"}
                        </h3>

                        <div style={styles.rating}>
                          ⭐{" "}
                          {formatRating(
                            restaurant.rating
                          )}
                        </div>
                      </div>

                      <p style={styles.cuisine}>
                        {restaurant.cuisine ||
                          "Local restaurant"}
                      </p>

                      <div style={styles.details}>
                        <span>
                          🕐{" "}
                          {restaurant.deliveryTime ||
                            "30–45 min"}
                        </span>

                        <span>•</span>

                        <span>
                          {formatDeliveryFee(
                            restaurant.deliveryFee
                          )}
                        </span>
                      </div>

                      <p style={styles.reviews}>
                        {Number(
                          restaurant.reviews
                        ) || 0}{" "}
                        ratings
                      </p>

                      {firstItem && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();

                            addToCart(
                              restaurant,
                              firstItem
                            );
                          }}
                          style={styles.addToCartButton}
                        >
                          🛒 Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* PROMO */}
      <section style={styles.promo}>
        <div>
          <p style={styles.promoSmall}>
            WELCOME TO BOUF À LAPORT
          </p>

          <h2 style={styles.promoTitle}>
            Hungry? We've got
            <br />
            you covered.
          </h2>

          <p style={styles.promoText}>
            Order from your favorite local restaurants and
            enjoy delicious meals without leaving home.
          </p>

          <Link
            to={
              isAuthenticated
                ? "/restaurants"
                : "/login"
            }
            style={styles.promoButton}
          >
            Start Ordering →
          </Link>
        </div>

        <div style={styles.promoEmoji}>🍕</div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div>
          <div style={styles.footerLogo}>
            🍔 BOUF À LAPORT
          </div>

          <p>
            Food you love. Delivered with care.
          </p>
        </div>

        <div style={styles.footerRight}>
          <span>© 2026 Bouf À Laport</span>
          <span>Made for food lovers ❤️</span>
        </div>
      </footer>
    </div>
  );
}
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#fff",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },

  loading: {
    textAlign: "center",
    padding: "80px 20px",
    fontSize: "18px",
    color: "#666",
  },

  notification: {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#28a745",
    color: "white",
    padding: "16px 24px",
    borderRadius: "10px",
    fontWeight: "600",
    zIndex: 1000,
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 48px",
    borderBottom: "1px solid #f0f0f0",
    position: "sticky",
    top: 0,
    backgroundColor: "white",
    zIndex: 100,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "900",
    color: "#222",
  },

  logoIcon: {
    fontSize: "28px",
    marginRight: "8px",
  },

  logoAccent: {
    color: "#ff4f0a",
  },

  navLinks: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
  },

  navLink: {
    textDecoration: "none",
    color: "#666",
    fontWeight: "600",
    fontSize: "14px",
  },

  profileButton: {
    textDecoration: "none",
    color: "#222",
    fontWeight: "700",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  loginButton: {
    textDecoration: "none",
    color: "#222",
    fontWeight: "700",
    fontSize: "14px",
    border: "2px solid #222",
    padding: "8px 18px",
    borderRadius: "8px",
  },

  registerButton: {
    textDecoration: "none",
    background: "#191919",
    color: "white",
    padding: "8px 18px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "14px",
  },

  cartButton: {
    textDecoration: "none",
    color: "#222",
    fontWeight: "700",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  hero: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "48px",
    padding: "80px 48px",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },

  heroContent: {
    maxWidth: "600px",
  },

  badge: {
    display: "inline-block",
    backgroundColor: "#fff3e0",
    color: "#ff4f0a",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "24px",
  },

  heroTitle: {
    fontSize: "48px",
    lineHeight: "1.2",
    fontWeight: "900",
    marginBottom: "24px",
    color: "#222",
  },

  heroAccent: {
    color: "#ff4f0a",
  },

  heroText: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "32px",
    lineHeight: "1.6",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    padding: "8px",
    borderRadius: "50px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    marginBottom: "48px",
  },

  searchIcon: {
    fontSize: "18px",
    padding: "0 12px",
  },

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "16px",
    padding: "8px",
  },

  searchButton: {
    backgroundColor: "#ff4f0a",
    color: "white",
    border: "none",
    padding: "12px 32px",
    borderRadius: "50px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },

  heroStats: {
    display: "flex",
    gap: "48px",
  },

  heroImageWrapper: {
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "500px",
    objectFit: "cover",
    borderRadius: "24px",
    display: "block",
  },

  deliveryCard: {
    position: "absolute",
    bottom: "24px",
    left: "24px",
    backgroundColor: "white",
    padding: "16px 20px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
  },

  deliveryIcon: {
    fontSize: "30px",
  },

  section: {
    padding: "80px 48px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "48px",
  },

  smallTitle: {
    color: "#ff4f0a",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
    marginBottom: "8px",
  },

  sectionTitle: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#222",
  },

  categories: {
    display: "flex",
    gap: "16px",
    overflowX: "auto",
    paddingBottom: "16px",
  },

  category: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100px",
    padding: "16px",
    backgroundColor: "white",
    border: "1px solid #eee",
    borderRadius: "16px",
    cursor: "pointer",
  },

  categoryActive: {
    border: "2px solid #ff4f0a",
    backgroundColor: "#fff3e0",
  },

  categoryIcon: {
    fontSize: "32px",
    marginBottom: "8px",
  },

  restaurantSection: {
    padding: "0 48px 80px",
  },

  restaurantCount: {
    color: "#666",
    fontWeight: "600",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "32px",
  },

  cardWrapper: {
    cursor: "pointer",
  },

  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },

  /* RESTAURANT IMAGE */
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "220px",
    overflow: "hidden",
    backgroundColor: "#f3f3f3",
  },

  restaurantImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  favorite: {
    position: "absolute",
    top: "16px",
    right: "16px",
    backgroundColor: "white",
    borderRadius: "50%",
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
  },

  deliveryBadge: {
    position: "absolute",
    bottom: "16px",
    left: "16px",
    backgroundColor: "white",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#222",
    boxShadow: "0 3px 10px rgba(0,0,0,0.10)",
  },

  cardContent: {
    padding: "20px",
  },

  cardTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },

  restaurantName: {
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
  },

  rating: {
    backgroundColor: "#fff3e0",
    color: "#ff4f0a",
    padding: "4px 8px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
  },

  cuisine: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "8px",
  },

  details: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#888",
    fontSize: "14px",
    marginBottom: "8px",
  },

  reviews: {
    color: "#888",
    fontSize: "14px",
    marginBottom: "16px",
  },

  addToCartButton: {
    width: "100%",
    padding: "10px",
    background: "#ff4f0a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "12px",
  },

  empty: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#666",
  },

  errorBox: {
    textAlign: "center",
    padding: "40px 20px",
    marginBottom: "30px",
    borderRadius: "16px",
    backgroundColor: "#fff3f0",
    color: "#444",
  },

  retryButton: {
    marginTop: "12px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#ff4f0a",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },

  promo: {
    backgroundColor: "#191919",
    color: "white",
    padding: "80px 48px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  promoSmall: {
    color: "#ff4f0a",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
    marginBottom: "8px",
  },

  promoTitle: {
    fontSize: "36px",
    fontWeight: "900",
    marginBottom: "16px",
  },

  promoText: {
    fontSize: "16px",
    color: "#aaa",
    marginBottom: "32px",
  },

  promoButton: {
    backgroundColor: "#ff4f0a",
    color: "white",
    padding: "16px 32px",
    borderRadius: "50px",
    textDecoration: "none",
    fontWeight: "700",
  },

  promoEmoji: {
    fontSize: "120px",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "32px 48px",
    backgroundColor: "#111",
    color: "#888",
    fontSize: "14px",
  },

  footerLogo: {
    fontSize: "18px",
    fontWeight: "900",
    color: "white",
    marginBottom: "8px",
  },

  footerRight: {
    display: "flex",
    gap: "16px",
  },
};