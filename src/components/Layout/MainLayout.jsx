// src/components/Layout/MainLayout.jsx
import React from "react";
import HeaderBar from "./HeaderBar";

export default function MainLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        color: "#0f172a",
      }}
    >
      <HeaderBar />
      <main
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "20px 16px 40px",
        }}
      >
        {children}
      </main>
    </div>
  );
}
