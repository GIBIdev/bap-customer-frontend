import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/layout/Navbar";

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

  const { user, isAuthenticated } = useAuth();

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      restaurant.cuisine
        .toLowerCase()
        .includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const firstName =
    user?.firstName ||
    user?.name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Food Lover";

  return (
    <div style={styles.page}>
      {/* SHARED NAVBAR COMPONENT (Uses Navbar.css & index.css) */}
      <Navbar />

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>
            {isAuthenticated && user
              ? `👋 Welcome back, ${firstName}!`
              : "🔥 Delicious food, delivered fast"}
          </div>

          <h1 style={styles.heroTitle}>
            {isAuthenticated && user ? (
              <>
                Hello, {firstName}!
                <br />
                <span style={styles.heroAccent}>Ready to order?</span>
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

          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>

            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />

            <button
              type="button"
              style={styles.searchButton}
              onClick={() =>
                document
                  .getElementById("restaurants")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Search
            </button>
          </div>

          <div style={styles.heroStats}>
            <div style={styles.stat}>
              <strong>500+</strong>
              <span>Restaurants</span>
            </div>

            <div style={styles.stat}>
              <strong>30 min</strong>
              <span>Average delivery</span>
            </div>

            <div style={styles.stat}>
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
          >
            <span style={styles.categoryIcon}>✨</span>
            <span>All</span>
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              style={{
                ...styles.category,
                ...(selectedCategory === category.name
                  ? styles.categoryActive
                  : {}),
              }}
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
      <section id="restaurants" style={styles.restaurantSection}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.smallTitle}>TOP PICKS FOR YOU</p>
            <h2 style={styles.sectionTitle}>
              Popular near you
            </h2>
          </div>

          <span style={styles.restaurantCount}>
            {filteredRestaurants.length} restaurants
          </span>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyEmoji}>😕</div>
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
                    <h3 style={styles.restaurantName}>
                      {restaurant.name}
                    </h3>

                    <div style={styles.rating}>
                      ⭐ {restaurant.rating}
                    </div>
                  </div>

                  <p style={styles.cuisine}>
                    {restaurant.cuisine}
                  </p>

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

          <Link to="/login" style={styles.promoButton}>
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
    background: "#faf9f7",
    color: "#191919",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  hero: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "80px 6% 70px",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    gap: "55px",
    alignItems: "center",
  },

  heroContent: {
    maxWidth: "650px",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "9px 15px",
    borderRadius: "999px",
    background: "#fff0e8",
    color: "#e84d16",
    fontSize: "13px",
    fontWeight: "800",
    marginBottom: "22px",
  },

  heroTitle: {
    fontSize: "clamp(46px, 6vw, 76px)",
    lineHeight: "0.98",
    letterSpacing: "-4px",
    margin: "0 0 25px",
    fontWeight: "900",
  },

  heroAccent: {
    color: "#ff5a1f",
  },

  heroText: {
    fontSize: "18px",
    lineHeight: "1.65",
    color: "#666",
    maxWidth: "570px",
    margin: "0 0 30px",
  },

  searchBox: {
    height: "62px",
    display: "flex",
    alignItems: "center",
    background: "#fff",
    border: "1px solid #e6e2de",
    borderRadius: "15px",
    padding: "6px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.07)",
    maxWidth: "620px",
  },

  searchIcon: {
    fontSize: "19px",
    marginLeft: "15px",
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    border: "none",
    outline: "none",
    fontSize: "15px",
    padding: "0 14px",
    color: "#222",
    background: "transparent",
  },

  searchButton: {
    border: "none",
    background: "#ff5a1f",
    color: "#fff",
    height: "50px",
    padding: "0 23px",
    borderRadius: "11px",
    fontWeight: "800",
    cursor: "pointer",
  },

  heroStats: {
    display: "flex",
    gap: "38px",
    marginTop: "38px",
  },

  stat: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  heroImageWrapper: {
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "540px",
    objectFit: "cover",
    borderRadius: "30px",
    display: "block",
    boxShadow: "0 25px 70px rgba(0,0,0,0.14)",
  },

  deliveryCard: {
    position: "absolute",
    left: "-25px",
    bottom: "30px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "16px 20px",
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.14)",
  },

  deliveryIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "#fff0e8",
    display: "grid",
    placeItems: "center",
    fontSize: "22px",
  },

  section: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "65px 6% 30px",
  },

  restaurantSection: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "45px 6% 80px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    marginBottom: "25px",
  },

  smallTitle: {
    margin: "0 0 7px",
    color: "#ff5a1f",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "1.5px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "32px",
    letterSpacing: "-1.3px",
    fontWeight: "900",
  },

  categories: {
    display: "flex",
    gap: "13px",
    flexWrap: "wrap",
  },

  category: {
    border: "1px solid #e7e2dd",
    background: "#fff",
    color: "#333",
    padding: "13px 18px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "700",
    cursor: "pointer",
  },

  categoryActive: {
    background: "#191919",
    color: "#fff",
    borderColor: "#191919",
  },

  categoryIcon: {
    fontSize: "20px",
  },

  restaurantCount: {
    color: "#888",
    fontSize: "14px",
    fontWeight: "700",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },

  card: {
    background: "#fff",
    borderRadius: "18px",
    overflow: "hidden",
    textDecoration: "none",
    color: "#191919",
    border: "1px solid #eee",
    transition: "transform 0.2s ease",
  },

  imageContainer: {
    position: "relative",
    height: "220px",
    overflow: "hidden",
  },

  restaurantImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  favorite: {
    position: "absolute",
    right: "14px",
    top: "14px",
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
    left: "13px",
    bottom: "13px",
    background: "#fff",
    padding: "7px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "800",
  },

  cardContent: {
    padding: "18px",
  },

  cardTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    alignItems: "center",
  },

  restaurantName: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "900",
  },

  rating: {
    fontSize: "13px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  cuisine: {
    margin: "7px 0",
    color: "#777",
    fontSize: "14px",
  },

  details: {
    display: "flex",
    gap: "7px",
    color: "#555",
    fontSize: "13px",
  },

  reviews: {
    margin: "10px 0 0",
    color: "#999",
    fontSize: "12px",
  },

  empty: {
    textAlign: "center",
    padding: "70px 20px",
    background: "#fff",
    borderRadius: "18px",
    border: "1px solid #eee",
  },

  emptyEmoji: {
    fontSize: "50px",
  },

  promo: {
    maxWidth: "1130px",
    margin: "20px auto 80px",
    padding: "55px",
    borderRadius: "28px",
    background: "#191919",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "30px",
  },

  promoSmall: {
    color: "#ff7a47",
    fontWeight: "900",
    fontSize: "12px",
    letterSpacing: "1.5px",
  },

  promoTitle: {
    fontSize: "42px",
    lineHeight: "1.05",
    letterSpacing: "-1.8px",
    margin: "12px 0",
  },

  promoText: {
    maxWidth: "560px",
    color: "#bbb",
    lineHeight: "1.6",
  },

  promoButton: {
    display: "inline-block",
    marginTop: "10px",
    padding: "13px 20px",
    borderRadius: "10px",
    background: "#ff5a1f",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "800",
  },

  promoEmoji: {
    fontSize: "100px",
  },

  footer: {
    padding: "35px 6%",
    borderTop: "1px solid #e8e4df",
    display: "flex",
    justifyContent: "space-between",
    gap: "30px",
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