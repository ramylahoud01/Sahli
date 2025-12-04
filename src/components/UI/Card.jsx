// src/components/UI/Card.jsx
import React from "react";
// import "./card.css"; // optional, or inline styles

export default function Card({ children, style }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(15,23,42,0.08)",
        padding: 20,
        background: "#ffffff",
        boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
