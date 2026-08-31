/**
 * 
 * A class that handles our Authentications/Authorization process
 * 
 */
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(token);

  /*
   * Load the current user when the application starts.
   */
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");

        setUser(res.data);
      } catch (error) {
        console.error("Unable to load authenticated user:", error);

        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  /*
   * Login
   */
  async function login(email, password) {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    const accessToken = res.data.accessToken;

    localStorage.setItem("token", accessToken);

    setToken(accessToken);

    /*
     * Some backends return the user directly from login.
     * If yours does, we'll use it.
     */
    if (res.data.user) {
      setUser(res.data.user);
    }

    return res.data;
  }

  /*
   * Logout
   */
  function logout() {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


/*
 * Convenient hook for components that need authentication.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}


