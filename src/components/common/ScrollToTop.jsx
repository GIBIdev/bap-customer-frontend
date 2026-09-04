import React, { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check window scroll position OR root document element scroll position
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      if (scrollTop > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Attach scroll listeners to both window and body to capture all scroll contexts
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    // Fallback for container-level scrolling environments
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 9999,
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        backgroundColor: "#191919",
        color: "#ffffff",
        border: "none",
        fontSize: "20px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease-in-out",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#ff5a1f"; // Brand accent orange
        e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(255, 90, 31, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#191919";
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.25)";
      }}
    >
      ↑
    </button>
  );
}