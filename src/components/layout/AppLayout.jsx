import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">

      <Navbar />

      <main className="app-layout-content">
        {children}
      </main>

      <Footer />

    </div>
  );
}