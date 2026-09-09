import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./css/Home.css";


/* =========================================================
   API
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000/api/v1";


/* =========================================================
   HERO SLIDES
========================================================= */

const HERO_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1800&q=90",
    label: "Premium burgers",
  },
  {
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1800&q=90",
    label: "Fresh pizza",
  },
  {
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1800&q=90",
    label: "Fresh tacos",
  },
  {
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1800&q=90",
    label: "Fresh local food",
  },
];


/* =========================================================
   CATEGORIES
========================================================= */

const FOOD_CATEGORIES = [
  { icon: "🍔", name: "Burgers" },
  { icon: "🍕", name: "Pizza" },
  { icon: "🍣", name: "Sushi" },
  { icon: "🍜", name: "Asian" },
  { icon: "🌮", name: "Tacos" },
  { icon: "🥗", name: "Healthy" },
  { icon: "🥤", name: "Drinks" },
  { icon: "🍰", name: "Desserts" },
];


/* =========================================================
   RESTAURANT IMAGES
========================================================= */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85";

const RESTAURANT_IMAGES = {
  bouf:
    "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=90",

  pizza:
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=90",

  taco:
    "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=90",
};


/* =========================================================
   HELPERS
========================================================= */

function getRestaurantImage(restaurant) {
  const name = String(restaurant?.name || "").toLowerCase();

  if (name.includes("bouf")) {
    return RESTAURANT_IMAGES.bouf;
  }

  if (name.includes("pizza")) {
    return RESTAURANT_IMAGES.pizza;
  }

  if (name.includes("taco")) {
    return RESTAURANT_IMAGES.taco;
  }

  return restaurant?.image || FALLBACK_IMAGE;
}


function getCategoryNames(restaurant) {
  if (!Array.isArray(restaurant?.categories)) {
    return [];
  }

  return restaurant.categories
    .map((category) => category?.name)
    .filter(Boolean);
}


function getMenuItems(restaurant) {
  if (
    Array.isArray(restaurant?.menuItems) &&
    restaurant.menuItems.length > 0
  ) {
    return restaurant.menuItems;
  }

  if (!Array.isArray(restaurant?.categories)) {
    return [];
  }

  return restaurant.categories.flatMap((category) => {
    if (Array.isArray(category?.items)) {
      return category.items;
    }

    if (Array.isArray(category?.menuItems)) {
      return category.menuItems;
    }

    return [];
  });
}


function getRestaurantCuisine(restaurant) {
  if (restaurant?.cuisine) {
    return restaurant.cuisine;
  }

  const categoryNames = getCategoryNames(restaurant);

  if (categoryNames.length > 0) {
    return categoryNames.slice(0, 3).join(" • ");
  }

  return "Local restaurant";
}


function formatDeliveryFee(fee) {
  const numericFee = Number(fee);

  if (!Number.isFinite(numericFee) || numericFee <= 0) {
    return "Free delivery";
  }

  return `$${numericFee.toFixed(2)} delivery`;
}


function formatRating(rating) {
  const numericRating = Number(rating);

  if (!Number.isFinite(numericRating) || numericRating <= 0) {
    return "New";
  }

  return numericRating.toFixed(1);
}


function formatReviews(reviews) {
  const count = Number(reviews);

  if (!Number.isFinite(count) || count <= 0) {
    return "0 ratings";
  }

  return `${new Intl.NumberFormat("en-US").format(count)} ${
    count === 1 ? "rating" : "ratings"
  }`;
}


function normalizePriceCents(item) {
  const priceCents = Number(item?.priceCents);

  if (Number.isFinite(priceCents) && priceCents >= 0) {
    return Math.round(priceCents);
  }

  const price = Number(item?.price);

  if (Number.isFinite(price) && price >= 0) {
    return Math.round(price * 100);
  }

  return 999;
}


function readStoredCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart = localStorage.getItem("cart");

    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart);

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
}


function getCartCount(cart) {
  return cart.reduce(
    (total, item) => total + Number(item?.quantity || 0),
    0
  );
}


function readFavorites() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem("bap-favorites");

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}


/* =========================================================
   HOME
========================================================= */

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [heroSlide, setHeroSlide] = useState(0);

  const [notification, setNotification] = useState("");

  const [cartCount, setCartCount] = useState(() =>
    getCartCount(readStoredCart())
  );

  const [favorites, setFavorites] =
    useState(readFavorites);

  const notificationTimer = useRef(null);

  const { user, isAuthenticated } = useAuth();


  /* =======================================================
     USER DISPLAY NAME
  ======================================================= */

  const displayName = useMemo(() => {
    if (!user) {
      return "";
    }

    const fullName = [
      user.firstName,
      user.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return (
      fullName ||
      user.name ||
      user.email ||
      "Account"
    );
  }, [user]);


  const firstName = useMemo(() => {
    if (user?.firstName) {
      return user.firstName;
    }

    return displayName.split(" ")[0] || "Food Lover";
  }, [user, displayName]);


  /* =======================================================
     HERO AUTO SLIDER
  ======================================================= */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroSlide((currentSlide) =>
        currentSlide === HERO_SLIDES.length - 1
          ? 0
          : currentSlide + 1
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);


  /* =======================================================
     NOTIFICATION
  ======================================================= */

  const showNotification = useCallback((message) => {
    setNotification(message);

    if (notificationTimer.current) {
      window.clearTimeout(notificationTimer.current);
    }

    notificationTimer.current = window.setTimeout(() => {
      setNotification("");
    }, 2600);
  }, []);


  useEffect(() => {
    return () => {
      if (notificationTimer.current) {
        window.clearTimeout(notificationTimer.current);
      }
    };
  }, []);


  /* =======================================================
     FETCH RESTAURANTS
  ======================================================= */

  const fetchRestaurants = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/restaurants`,
        {
          method: "GET",

          headers: {
            Accept: "application/json",
          },

          ...(signal ? { signal } : {}),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Restaurant API returned HTTP ${response.status}`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid restaurant response from API"
        );
      }

      setRestaurants(data);
    } catch (err) {
      if (err?.name === "AbortError") {
        return;
      }

      console.error(
        "Failed to load restaurants:",
        err
      );

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
    const controller =
      new AbortController();

    fetchRestaurants(controller.signal);

    return () => controller.abort();
  }, [fetchRestaurants]);


  /* =======================================================
     FILTER RESTAURANTS
  ======================================================= */

  const filteredRestaurants = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    const categoryValue =
      selectedCategory.toLowerCase();

    return restaurants.filter((restaurant) => {
      const categoryNames =
        getCategoryNames(restaurant);

      const menuItems =
        getMenuItems(restaurant);

      const searchable = [
        restaurant?.name,
        restaurant?.cuisine,
        ...categoryNames,
        ...menuItems.map((item) => item?.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue ||
        searchable.includes(searchValue);

      const matchesCategory =
        selectedCategory === "All" ||
        searchable.includes(categoryValue);

      return matchesSearch && matchesCategory;
    });
  }, [
    restaurants,
    search,
    selectedCategory,
  ]);


  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart = useCallback(
    (restaurant, item) => {
      if (!restaurant?.id || !item?.id) {
        showNotification(
          "Unable to add this item."
        );

        return;
      }

      try {
        const cart = readStoredCart();

        const existingItem = cart.find(
          (cartItem) =>
            String(cartItem.id) === String(item.id) &&
            String(cartItem.restaurantId) ===
              String(restaurant.id)
        );

        if (existingItem) {
          existingItem.quantity =
            Number(existingItem.quantity || 0) + 1;
        } else {
          cart.push({
            id: item.id,

            name:
              item.name ||
              "Menu item",

            priceCents:
              normalizePriceCents(item),

            quantity: 1,

            description:
              item.description || "",

            image:
              item.image ||
              getRestaurantImage(restaurant),

            restaurantName:
              restaurant.name ||
              "Restaurant",

            restaurantId:
              restaurant.id,
          });
        }

        localStorage.setItem(
          "cart",
          JSON.stringify(cart)
        );

        setCartCount(getCartCount(cart));

        showNotification(
          `${item.name || "Item"} added to cart`
        );
      } catch (err) {
        console.error(
          "Unable to update cart:",
          err
        );

        showNotification(
          "Unable to update your cart."
        );
      }
    },
    [showNotification]
  );


  /* =======================================================
     FAVORITES
  ======================================================= */

  const toggleFavorite = useCallback(
    (restaurantId) => {
      const id = String(restaurantId);

      setFavorites((current) => {
        const alreadyFavorite =
          current.includes(id);

        const updatedFavorites =
          alreadyFavorite
            ? current.filter(
                (favoriteId) =>
                  favoriteId !== id
              )
            : [...current, id];

        localStorage.setItem(
          "bap-favorites",
          JSON.stringify(updatedFavorites)
        );

        showNotification(
          alreadyFavorite
            ? "Removed from favorites"
            : "Added to favorites"
        );

        return updatedFavorites;
      });
    },
    [showNotification]
  );


  /* =======================================================
     SEARCH
  ======================================================= */

  function handleSearchSubmit(event) {
    event.preventDefault();

    document
      .getElementById("restaurants")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }


  function clearFilters() {
    setSearch("");
    setSelectedCategory("All");
  }


  function handleImageError(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src =
      FALLBACK_IMAGE;
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="bap-home-page">

      {/* ===================================================
          NOTIFICATION
      =================================================== */}

      {notification && (
        <div
          className="bap-toast"
          role="status"
          aria-live="polite"
        >
          <span />
          {notification}
        </div>
      )}


      {/* ===================================================
          NAVBAR
      =================================================== */}

      <header className="bap-home-header">
        <nav className="bap-home-navbar">

          <Link
            to="/"
            className="bap-home-logo"
          >
            <span className="bap-logo-burger">
              🍔
            </span>

            <strong>BOUF</strong>

            <strong className="bap-orange">
              À LAPORT
            </strong>
          </Link>


          <div className="bap-home-nav">

            <a
              href="#top"
              className="bap-home-nav-link active"
            >
              🏠 Home
            </a>

            <a
              href="#restaurants"
              className="bap-home-nav-link"
            >
              🍴 Restaurants
            </a>

            <a
              href="#categories"
              className="bap-home-nav-link"
            >
              ▦ Categories
            </a>


            <Link
              to="/cart"
              className="bap-home-cart"
            >
              🛒

              {cartCount > 0 && (
                <span className="bap-cart-count">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>


            {isAuthenticated && user ? (
              <Link
                to="/profile"
                className="bap-account-button"
              >
                👤 {displayName}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bap-signin-button"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="bap-register-button"
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </nav>
      </header>


      {/* ===================================================
          HERO — ANIMATED BACKGROUND
      =================================================== */}

      <main id="top">

        <section className="bap-hero-slider">

          <div className="bap-hero-backgrounds">

            {HERO_SLIDES.map(
              (slide, index) => (
                <div
                  key={slide.image}
                  className={`bap-hero-slide ${
                    heroSlide === index
                      ? "active"
                      : ""
                  }`}
                  style={{
                    backgroundImage:
                      `url("${slide.image}")`,
                  }}
                  aria-hidden="true"
                />
              )
            )}

          </div>


          <div className="bap-hero-overlay" />


          <div className="bap-hero-inner">

            <div className="bap-hero-content">

              <div className="bap-hero-eyebrow">
                <span>GOOD FOOD</span>
                <i>•</i>
                <span>FAST DELIVERY</span>
                <i>•</i>
                <span>ALWAYS FRESH</span>
              </div>


              <h1>

                <span className="bap-hero-shadow-title">
                  Delicious Meals,
                </span>

                <span className="bap-hero-main-title">
                  Delivered to
                  <br />
                  Your Door
                </span>

              </h1>


              <p className="bap-hero-description">

                {isAuthenticated && user
                  ? `Welcome back, ${firstName}. Discover fresh meals from your favorite local restaurants.`
                  : "From your favorite local restaurants, enjoy fresh, high-quality meals without leaving home."}

              </p>


              <form
                className="bap-hero-search"
                onSubmit={handleSearchSubmit}
              >

                <span className="bap-search-icon">
                  ⌖
                </span>

                <input
                  type="search"
                  placeholder="Search for restaurants or cuisines..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

                <button type="submit">
                  🔍 Search
                </button>

              </form>

            </div>

          </div>


          {/* HERO SLIDE CONTROLS */}

          <div className="bap-hero-dots">

            {HERO_SLIDES.map(
              (slide, index) => (
                <button
                  key={slide.label}
                  type="button"
                  className={
                    heroSlide === index
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setHeroSlide(index)
                  }
                  aria-label={`Show ${slide.label}`}
                />
              )
            )}

          </div>

        </section>


        {/* =================================================
            CATEGORIES
        ================================================= */}

        <section
          id="categories"
          className="bap-category-section"
        >

          <div className="bap-home-container">

            <div className="bap-category-row">

              <button
                type="button"
                className={`bap-category-item ${
                  selectedCategory === "All"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedCategory("All")
                }
              >
                <span className="bap-category-icon">
                  ✨
                </span>

                <strong>All</strong>
              </button>


              {FOOD_CATEGORIES.map(
                (category) => (
                  <button
                    type="button"
                    key={category.name}
                    className={`bap-category-item ${
                      selectedCategory ===
                      category.name
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedCategory(
                        category.name
                      )
                    }
                  >

                    <span className="bap-category-icon">
                      {category.icon}
                    </span>

                    <strong>
                      {category.name}
                    </strong>

                  </button>
                )
              )}

            </div>

          </div>

        </section>


        {/* =================================================
            RESTAURANTS
        ================================================= */}

        <section
          id="restaurants"
          className="bap-restaurants-section"
        >

          <div className="bap-home-container">

            <div className="bap-section-heading">

              <div>

                <span className="bap-section-eyebrow">
                  TOP PICKS FOR YOU
                </span>

                <h2>
                  Popular near you
                </h2>

              </div>


              {!loading && !error && (
                <span className="bap-restaurant-count">

                  {filteredRestaurants.length}{" "}

                  {filteredRestaurants.length === 1
                    ? "restaurant"
                    : "restaurants"}

                </span>
              )}

            </div>


            {/* LOADING */}

            {loading && (

              <div className="bap-restaurant-grid">

                {[1, 2, 3].map((item) => (

                  <div
                    key={item}
                    className="bap-skeleton-card"
                  >

                    <div className="bap-skeleton-image" />

                    <div className="bap-skeleton-body">

                      <div className="bap-skeleton-line title" />
                      <div className="bap-skeleton-line" />
                      <div className="bap-skeleton-line short" />

                    </div>

                  </div>

                ))}

              </div>

            )}


            {/* ERROR */}

            {!loading && error && (

              <div className="bap-state-card">

                <div>⚠️</div>

                <h3>
                  Unable to load restaurants
                </h3>

                <p>{error}</p>

                <button
                  type="button"
                  onClick={() =>
                    fetchRestaurants()
                  }
                >
                  Try Again
                </button>

              </div>

            )}


            {/* EMPTY */}

            {!loading &&
              !error &&
              filteredRestaurants.length ===
                0 && (

                <div className="bap-state-card">

                  <div>🔎</div>

                  <h3>
                    No restaurants found
                  </h3>

                  <p>
                    Try another search or
                    category.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>

                </div>

              )}


            {/* GRID */}

            {!loading &&
              !error &&
              filteredRestaurants.length >
                0 && (

                <div className="bap-restaurant-grid">

                  {filteredRestaurants.map(
                    (restaurant) => {

                      const menuItems =
                        getMenuItems(
                          restaurant
                        );

                      const firstItem =
                        menuItems[0];

                      const restaurantId =
                        String(
                          restaurant.id
                        );

                      const favorite =
                        favorites.includes(
                          restaurantId
                        );

                      return (

                        <article
                          key={restaurant.id}
                          className="bap-restaurant-card"
                        >

                          <div className="bap-restaurant-image-wrap">

                            <Link
                              to={`/restaurant/${restaurant.id}`}
                              className="bap-restaurant-image-link"
                            >

                              <img
                                src={getRestaurantImage(
                                  restaurant
                                )}
                                alt={
                                  restaurant.name ||
                                  "Restaurant"
                                }
                                onError={
                                  handleImageError
                                }
                              />

                            </Link>


                            <button
                              type="button"
                              className={`bap-favorite ${
                                favorite
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                toggleFavorite(
                                  restaurant.id
                                )
                              }
                            >

                              {favorite
                                ? "♥"
                                : "♡"}

                            </button>


                            <span className="bap-fast-delivery">

                              ⚡ Fast delivery

                            </span>

                          </div>


                          <div className="bap-restaurant-body">

                            <div className="bap-restaurant-title-row">

                              <div>

                                <Link
                                  to={`/restaurant/${restaurant.id}`}
                                  className="bap-restaurant-name"
                                >
                                  {restaurant.name ||
                                    "Restaurant"}
                                </Link>

                                <p>
                                  {getRestaurantCuisine(
                                    restaurant
                                  )}
                                </p>

                              </div>


                              <span className="bap-rating">

                                ★{" "}
                                {formatRating(
                                  restaurant.rating
                                )}

                              </span>

                            </div>


                            <div className="bap-restaurant-meta">

                              <span>
                                ◷{" "}
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


                            <p className="bap-review-count">

                              {formatReviews(
                                restaurant.reviews
                              )}

                            </p>


                            <div className="bap-card-actions">

                              <Link
                                to={`/restaurant/${restaurant.id}`}
                                className="bap-view-menu"
                              >
                                View Menu →
                              </Link>


                              {firstItem && (

                                <button
                                  type="button"
                                  className="bap-add-item"
                                  onClick={() =>
                                    addToCart(
                                      restaurant,
                                      firstItem
                                    )
                                  }
                                >
                                  + Add Item
                                </button>

                              )}

                            </div>

                          </div>

                        </article>

                      );
                    }
                  )}

                </div>

              )}

          </div>

        </section>


        {/* =================================================
            PROMO
        ================================================= */}

        <section className="bap-home-promo">

          <div className="bap-home-container">

            <div className="bap-promo-card">

              <div>

                <span className="bap-section-eyebrow">
                  BOUF À LAPORT
                </span>

                <h2>
                  Great food.
                  <br />
                  Delivered fast.
                </h2>

                <p>
                  Discover restaurants near you,
                  build your cart, and enjoy
                  your favorite meals at home.
                </p>

                <a
                  href="#restaurants"
                  className="bap-promo-button"
                >
                  Start Ordering →
                </a>

              </div>


              <div className="bap-promo-food">
                <span>🍕</span>
                <span>🍔</span>
                <span>🌮</span>
              </div>

            </div>

          </div>

        </section>

      </main>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="bap-home-footer">

        <div className="bap-home-container bap-footer-inner">

          <strong>
            🍔 BOUF
            <span> À LAPORT</span>
          </strong>

          <p>
            Food you love. Delivered with care.
          </p>

          <small>
            © {new Date().getFullYear()} Bouf À Laport
          </small>

        </div>

      </footer>

    </div>
  );
}