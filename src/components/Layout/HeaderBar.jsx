// src/components/Layout/HeaderBar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAccessToken, logout } from "../../api/auth";

export default function HeaderBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = !!getAccessToken();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header
      style={{
        height: 56,
        borderBottom: "1px solid rgba(15,23,42,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        background: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <Link
        to="/"
        style={{
          fontWeight: 700,
          fontSize: 18,
          color: "#111827",
          textDecoration: "none",
        }}
      >
        Sahli
      </Link>

      <nav style={{ display: "flex", gap: 16, fontSize: 14 }}>
        <Link
          to="/shops"
          style={{
            textDecoration: "none",
            color: isActive("/shops") ? "#2563eb" : "#6b7280",
            fontWeight: isActive("/shops") ? 600 : 500,
          }}
        >
          My Shops
        </Link>
        <Link
          to="/products"
          style={{
            textDecoration: "none",
            color: isActive("/products") ? "#2563eb" : "#6b7280",
            fontWeight: isActive("/products") ? 600 : 500,
          }}
        >
          My Products
        </Link>
        {loggedIn ? (
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{
              border: "none",
              background: "transparent",
              color: "#ef4444",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: isActive("/login") ? "#2563eb" : "#6b7280",
              fontWeight: isActive("/login") ? 600 : 500,
            }}
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
