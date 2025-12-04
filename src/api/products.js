// src/api/products.js
import { secureRequest } from "./auth";

/**
 * List products by shop (seller view, authenticated)
 */
export async function listByShop(
  shopId,
  { page = 1, limit = 10, search = "" } = {}
) {
  // Build query string
  let queryString = `page=${page}&limit=${limit}`;

  // Add search parameter if it exists
  if (search && search.trim()) {
    queryString += `&search=${encodeURIComponent(search.trim())}`;
  }

  const res = await secureRequest(`/products/shop/${shopId}?${queryString}`, {
    method: "GET",
  });

  // Keep same shape as before
  return res.data || { items: [], total: 0 };
}

/**
 * Create product
 */
export async function createProduct(shopId, payload) {
  const res = await secureRequest("/products", {
    method: "POST",
    body: { ...payload, shop: shopId },
  });

  return res.data || res;
}

/**
 * Upload a product image (WEB)
 */
export async function uploadProductImage(file) {
  const form = new FormData();
  form.append("file", file);

  console.log("[uploadProductImage] POST /uploads file:", {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  const res = await secureRequest("/uploads", {
    method: "POST",
    body: form,
  });

  console.log("[uploadProductImage] response:", res);

  const data = res?.data || res || {};
  const path = data?.data?.path || data?.path || data?.data?.url;

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

  const res = await secureRequest(url, {
    method: "GET",
  });

  // ok() wraps as { success, data: { items, total, page, pageSize, hasMore } }
  return (
    res.data ||
    res || { items: [], total: 0, page, pageSize: 0, hasMore: false }
  );
}
