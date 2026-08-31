/**
 * 
 * A class that handles our Layout of the app
 * 
 */
import Footer from "./Footer.jsx";

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <main className="app-layout-content">
        {children}
      </main>

      <Footer />
    </div>
  );
}