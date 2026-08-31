import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const restaurants = [
  {
    id: "1",
    name: "Burger House",
    cuisine: "Burgers • American",
    rating: "4.8",
    reviews: "1,240",
    time: "20–30 min",
    fee: "$0.99 delivery",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "2",
    name: "Sushi World",
    cuisine: "Japanese • Sushi",
    rating: "4.9",
    reviews: "980",
    time: "25–35 min",
    fee: "$1.49 delivery",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "3",
    name: "Bella Pizza",
    cuisine: "Pizza • Italian",
    rating: "4.7",
    reviews: "2,130",
    time: "25–40 min",
    fee: "$0.49 delivery",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "4",
    name: "Taco Fiesta",
    cuisine: "Mexican • Tacos",
    rating: "4.8",
    reviews: "870",
    time: "15–25 min",
    fee: "$0.99 delivery",
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "5",
    name: "Green Bowl",
    cuisine: "Healthy • Salads",
    rating: "4.6",
    reviews: "640",
    time: "15–25 min",
    fee: "$0.00 delivery",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "6",
    name: "Sweet Bakery",
    cuisine: "Desserts • Bakery",
    rating: "4.9",
    reviews: "1,540",
    time: "15–20 min",
    fee: "$0.99 delivery",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85",
  },
];

const categories = [
  { icon: "🍔", name: "Burgers" },
  { icon: "🍕", name: "Pizza" },
  { icon: "🍣", name: "Sushi" },
  { icon: "🌮", name: "Mexican" },
  { icon: "🥗", name: "Healthy" },
  { icon: "🍰", name: "Desserts" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      restaurant.cuisine.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <Link to="/" style={styles.logo}>
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

          <Link to="/login" style={styles.loginButton}>
            Sign In
          </Link>

          <Link to="/cart" style={styles.cartButton}>
            🛒 Cart
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>🔥 Delicious food, delivered fast</div>

          <h1 style={styles.heroTitle}>
            Your favorite food.
            <br />
            <span style={styles.heroAccent}>Delivered to you.</span>
          </h1>

          <p style={styles.heroText}>
            Discover the best restaurants around you and get your favorite
            meals delivered right to your door.
          </p>

          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>

            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />

            <button style={styles.searchButton}>Search</button>
          </div>

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
            alt="Delicious food"
            style={styles.heroImage}
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
            <h2 style={styles.sectionTitle}>What are you craving?</h2>
          </div>
        </div>

        <div style={styles.categories}>
          <button
            onClick={() => setSelectedCategory("All")}
            style={{
              ...styles.category,
              ...(selectedCategory === "All" ? styles.categoryActive : {}),
            }}
          >
            <span style={styles.categoryIcon}>✨</span>
            <span>All</span>
          </button>

          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              style={{
                ...styles.category,
                ...(selectedCategory === category.name
                  ? styles.categoryActive
                  : {}),
              }}
            >
              <span style={styles.categoryIcon}>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* RESTAURANTS */}
      <section id="restaurants" style={styles.restaurantSection}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.smallTitle}>TOP PICKS FOR YOU</p>
            <h2 style={styles.sectionTitle}>Popular near you</h2>
          </div>

          <span style={styles.restaurantCount}>
            {filteredRestaurants.length} restaurants
          </span>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: "50px" }}>😕</div>
            <h3>No restaurants found</h3>
            <p>Try searching for something else.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                style={styles.card}
              >
                <div style={styles.imageContainer}>
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    style={styles.restaurantImage}
                  />

                  <div style={styles.favorite}>♡</div>

                  <div style={styles.deliveryBadge}>
                    ⚡ Fast delivery
                  </div>
                </div>

                <div style={styles.cardContent}>
                  <div style={styles.cardTitleRow}>
                    <h3 style={styles.restaurantName}>{restaurant.name}</h3>

                    <div style={styles.rating}>
                      ⭐ {restaurant.rating}
                    </div>
                  </div>

                  <p style={styles.cuisine}>{restaurant.cuisine}</p>

                  <div style={styles.details}>
                    <span>🕐 {restaurant.time}</span>
                    <span>•</span>
                    <span>{restaurant.fee}</span>
                  </div>

                  <p style={styles.reviews}>
                    {restaurant.reviews} ratings
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* PROMO */}
      <section style={styles.promo}>
        <div>
          <p style={styles.promoSmall}>WELCOME TO BOUF À LAPORT</p>
          <h2 style={styles.promoTitle}>
            Hungry? We've got
            <br />
            you covered.
          </h2>

          <p style={styles.promoText}>
            Order from your favorite local restaurants and enjoy delicious
            meals without leaving home.
          </p>

          <Link to="/login" style={styles.promoButton}>
            Start Ordering →
          </Link>
        </div>

        <div style={styles.promoEmoji}>🍕</div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div>
          <div style={styles.footerLogo}>🍔 BOUF À LAPORT</div>
          <p>Food you love. Delivered with care.</p>
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
    background: "#fafafa",
    color: "#191919",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  navbar: {
    height: "76px",
    padding: "0 7%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#ffffff",
    borderBottom: "1px solid #eeeeee",
    position: "sticky",
    top: 0,
    zIndex: 20,
  },

  logo: {
    textDecoration: "none",
    color: "#171717",
    fontSize: "21px",
    fontWeight: "900",
    letterSpacing: "-0.7px",
  },

  logoIcon: {
    marginRight: "8px",
  },

  logoAccent: {
    color: "#ff4f0a",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "26px",
  },

  navLink: {
    textDecoration: "none",
    color: "#555",
    fontSize: "14px",
    fontWeight: "600",
  },

  loginButton: {
    textDecoration: "none",
    color: "#222",
    fontWeight: "700",
    fontSize: "14px",
  },

  cartButton: {
    textDecoration: "none",
    background: "#ff4f0a",
    color: "white",
    padding: "11px 18px",
    borderRadius: "10px",
    fontWeight: "800",
    fontSize: "14px",
  },

  hero: {
    minHeight: "540px",
    padding: "70px 7%",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    gap: "60px",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #fff7f1 0%, #fff 55%, #fff1e9 100%)",
    boxSizing: "border-box",
  },

  heroContent: {
    maxWidth: "680px",
  },

  badge: {
    display: "inline-block",
    background: "#fff0e9",
    color: "#e54805",
    padding: "9px 15px",
    borderRadius: "30px",
    fontSize: "13px",
    fontWeight: "800",
    marginBottom: "20px",
  },

  heroTitle: {
    fontSize: "58px",
    lineHeight: "1.02",
    letterSpacing: "-3px",
    margin: "0 0 22px",
    fontWeight: "900",
  },

  heroAccent: {
    color: "#ff4f0a",
  },

  heroText: {
    color: "#666",
    fontSize: "17px",
    lineHeight: "1.7",
    maxWidth: "570px",
    marginBottom: "30px",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "white",
    border: "1px solid #e5e5e5",
    borderRadius: "14px",
    padding: "7px",
    maxWidth: "610px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
  },

  searchIcon: {
    fontSize: "19px",
    marginLeft: "13px",
  },

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "14px 12px",
    fontSize: "15px",
    background: "transparent",
  },

  searchButton: {
    border: "none",
    background: "#ff4f0a",
    color: "white",
    padding: "13px 23px",
    borderRadius: "10px",
    fontWeight: "800",
    cursor: "pointer",
  },

  heroStats: {
    display: "flex",
    gap: "38px",
    marginTop: "34px",
  },

  heroStat: {
    display: "flex",
  },

  heroImageWrapper: {
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "420px",
    objectFit: "cover",
    borderRadius: "28px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
  },

  deliveryCard: {
    position: "absolute",
    bottom: "25px",
    left: "-25px",
    background: "white",
    borderRadius: "15px",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
  },

  deliveryIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#fff0e9",
    display: "grid",
    placeItems: "center",
    fontSize: "21px",
  },

  section: {
    padding: "65px 7% 35px",
  },

  restaurantSection: {
    padding: "25px 7% 75px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "end",
    justifyContent: "space-between",
    marginBottom: "28px",
  },

  smallTitle: {
    color: "#ff4f0a",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1.5px",
    margin: "0 0 7px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "30px",
    letterSpacing: "-1px",
    fontWeight: "900",
  },

  categories: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },

  category: {
    border: "1px solid #e5e5e5",
    background: "white",
    padding: "14px 22px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },

  categoryActive: {
    background: "#ff4f0a",
    color: "white",
    borderColor: "#ff4f0a",
  },

  categoryIcon: {
    fontSize: "22px",
  },

  restaurantCount: {
    color: "#777",
    fontSize: "14px",
    fontWeight: "600",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
  },

  card: {
    background: "white",
    borderRadius: "18px",
    overflow: "hidden",
    textDecoration: "none",
    color: "inherit",
    border: "1px solid #eeeeee",
    transition: "transform 0.2s, box-shadow 0.2s",
  },

  imageContainer: {
    height: "220px",
    position: "relative",
    overflow: "hidden",
  },

  restaurantImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  favorite: {
    position: "absolute",
    top: "13px",
    right: "13px",
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.95)",
    display: "grid",
    placeItems: "center",
    fontSize: "23px",
  },

  deliveryBadge: {
    position: "absolute",
    bottom: "12px",
    left: "12px",
    background: "white",
    padding: "7px 10px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "800",
  },

  cardContent: {
    padding: "18px",
  },

  cardTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  restaurantName: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "850",
  },

  rating: {
    background: "#fff6df",
    padding: "6px 8px",
    borderRadius: "7px",
    fontSize: "12px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  cuisine: {
    color: "#777",
    fontSize: "13px",
    margin: "7px 0 14px",
  },

  details: {
    display: "flex",
    gap: "8px",
    color: "#555",
    fontSize: "12px",
    fontWeight: "600",
  },

  reviews: {
    color: "#999",
    fontSize: "11px",
    margin: "9px 0 0",
  },

  empty: {
    textAlign: "center",
    padding: "70px 20px",
    background: "white",
    borderRadius: "20px",
    border: "1px solid #eee",
  },

  promo: {
    margin: "0 7% 70px",
    padding: "55px 65px",
    borderRadius: "25px",
    background: "#191919",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },

  promoSmall: {
    color: "#ff7040",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1.5px",
  },

  promoTitle: {
    fontSize: "38px",
    lineHeight: "1.1",
    margin: "10px 0 15px",
    letterSpacing: "-1.5px",
  },

  promoText: {
    color: "#aaa",
    maxWidth: "500px",
    lineHeight: "1.6",
  },

  promoButton: {
    display: "inline-block",
    marginTop: "15px",
    padding: "13px 20px",
    background: "#ff4f0a",
    color: "white",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "800",
  },

  promoEmoji: {
    fontSize: "150px",
    transform: "rotate(-10deg)",
  },

  footer: {
    borderTop: "1px solid #e8e8e8",
    padding: "35px 7%",
    display: "flex",
    justifyContent: "space-between",
    color: "#777",
    fontSize: "13px",
  },

  footerLogo: {
    color: "#191919",
    fontWeight: "900",
    fontSize: "16px",
  },

  footerRight: {
    display: "flex",
    gap: "25px",
    alignItems: "center",
  },
};