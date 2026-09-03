import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const {
    user,
    loading,
    isAuthenticated,
    logout,
  } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        Loading your profile...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <h1>Please sign in</h1>

        <p>
          You need to be signed in to view your profile.
        </p>

        <Link to="/login">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px" }}>

      <div style={{ marginBottom: "40px" }}>
        <p style={{ marginBottom: "8px" }}>
          My Account
        </p>

        <h1>
          Welcome, {user.firstName} 👋
        </h1>

        <p>
          Manage your BOUF À LAPORT account.
        </p>
      </div>

      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: "16px",
          padding: "30px",
          background: "#fff",
        }}
      >

        <h2>
          Profile Information
        </h2>

        <div style={{ marginTop: "24px" }}>

          <p>
            <strong>First name:</strong>{" "}
            {user.firstName}
          </p>

          <p>
            <strong>Last name:</strong>{" "}
            {user.lastName}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user.email}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {user.phone || "Not provided"}
          </p>

          <p>
            <strong>Account type:</strong>{" "}
            {user.role}
          </p>

        </div>

      </div>

      <div style={{ marginTop: "30px" }}>

        <button
          type="button"
          onClick={logout}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>

      </div>

    </div>
  );
}