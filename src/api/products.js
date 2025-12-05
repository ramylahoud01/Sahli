// src/api/products.js
import { secureRequest } from "./auth";
import { request } from "./client";

/**
 * List products by shop (seller view, authenticated)
 * Backend: GET /products/shop/:shopId?page=&limit=&search=
 */
export async function listByShop(
  shopId,
  { page = 1, limit = 10, search = "" } = {}
) {
  if (!shopId) {
    throw new Error("Shop id is required");
  }

  const params = new URLSearchParams();
  params.set("page", page);
  params.set("limit", limit);

  if (search && search.trim()) {
    params.set("search", search.trim());
  }

  const url = `/products/shop/${shopId}?${params.toString()}`;

  const res = await secureRequest(url, {
    method: "GET",
  });

  // request/secureRequest returns { success, data, message }
  return res.data || res || { items: [], total: 0 };
}

/**
 * Create product (authenticated)
 * Backend: POST /products
 */
export async function createProduct(shopId, payload) {
  if (!shopId) {
    throw new Error("Shop id is required");
  }

  const res = await secureRequest("/products", {
    method: "POST",
    body: { ...payload, shop: shopId },
  });

  return res.data || res;
}

/**
 * Upload a product image (WEB, authenticated)
 * Backend: POST /uploads → ok(res, { path: "/uploads/..." })
 */
export async function uploadProductImage(file) {
  if (!file) {
    throw new Error("File is required");
  }

  const form = new FormData();
  form.append("file", file);

  const res = await secureRequest("/uploads", {
    method: "POST",
    body: form,
  });

  // res = { success, message, data: { path } }
  const data = res.data || res || {};
  const path = data.path || data.url;

  if (!path) {
    throw new Error("Upload succeeded but no file path returned.");
  }

  return path; // e.g. "/uploads/1764152515567-335865600.jpg"
}

/**
 * Public: list products for a shop page
 * Backend: GET /shops/:id/products
 * Returns ok(res, { items, total, page, pageSize, hasMore })
 */
export async function listPublicShopProducts(
  shopId,
  {
    page = 1,
    limit = 50,
    q = "",
    priceFrom,
    priceTo,
    categoryId,
    subcategoryId,
  } = {}
) {
  if (!shopId) {
    throw new Error("Shop id is required");
  }

  const params = new URLSearchParams();
  params.set("page", page);
  params.set("limit", limit);

  if (q && q.trim()) params.set("q", q.trim());
  if (priceFrom !== undefined && priceFrom !== null && priceFrom !== "") {
    params.set("priceFrom", priceFrom);
  }
  if (priceTo !== undefined && priceTo !== null && priceTo !== "") {
    params.set("priceTo", priceTo);
  }
  if (categoryId) {
    params.set("categoryId", categoryId);
  }
  if (subcategoryId) {
    params.set("subcategoryId", subcategoryId);
  }

  const url = `/shops/${shopId}/products?${params.toString()}`;

  const res = await request(url, {
    method: "GET",
  });

  return (
    res.data ||
    res || { items: [], total: 0, page, pageSize: 0, hasMore: false }
  );
}
