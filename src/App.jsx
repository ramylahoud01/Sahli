// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Home/Layout";

import LoginPage from "./pages/Auth/LoginPage.jsx";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";

import MyShopsPage from "./pages/Shop/MyShopsPage";
import CreateShopPage from "./pages/Shop/CreateShopPage";

import MyProductsPage from "./pages/Product/MyProductsPage.jsx";
import CreateProductPage from "./pages/Product/CreateProductPage";

import Home from "./components/Home/index.jsx";
import PublicShopPage from "./pages/Shop/PublicShopPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC SHOP PAGE — NO HEADER, NO LAYOUT */}
        <Route path="/shop/:shopId" element={<PublicShopPage />} />

        {/* ALL PAGES WITH HEADER + LAYOUT */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Shops */}
                <Route path="/shops" element={<MyShopsPage />} />
                <Route path="/shops/new" element={<CreateShopPage />} />

                {/* Products */}
                <Route path="/products" element={<MyProductsPage />} />
                <Route path="/products/new" element={<CreateProductPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
