// src/api/shops.js
import { secureRequest } from "./auth";
import { request } from "./client";

// ---------- Authenticated (needs token + refresh) ----------
export async function getMyShops(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page);
  if (params.limit) searchParams.append("limit", params.limit);
  if (params.search && params.search.trim()) {
    searchParams.append("search", params.search.trim());
  }

  // Extra filters, just in case
  Object.entries(params).forEach(([key, value]) => {
    if (["page", "limit", "search"].includes(key)) return;
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  // ⚠️ Make sure this matches your backend route: /shops/me or /shops/my
  const url = `/shops/me${queryString ? `?${queryString}` : ""}`;

  const res = await secureRequest(url, { method: "GET" });

  // secureRequest → request → { success, data, message }
  return res.data || res || [];
}

export async function createShop(payload) {
  const res = await secureRequest("/shops", {
    method: "POST",
    body: payload,
  });

  return res.data || res;
}

export const uploadShopImage = async (file) => {
  try {
    const formData = new FormData();
    // MUST MATCH multer upload.single("file")
    formData.append("file", file);

    const response = await secureRequest("/uploads", {
      method: "POST",
      body: formData,
      // no headers here → request() handles FormData correctly
    });

    // Backend: ok(res, { path: `/uploads/${req.file.filename}` }, ...)
    return response.data || response; // { path: "/uploads/..." }
  } catch (error) {
    const message = error?.message || "Failed to upload image";
    throw new Error(message);
  }
};

// ---------- Public (no auth required) ----------
/**
 * Public: get a single shop by id
 * Backend: GET /shops/:id → ok(res, shop)
 */
export async function getShopById(shopId) {
  if (!shopId) {
    throw new Error("Shop id is required");
  }

  const res = await request(`/shops/${shopId}`, {
    method: "GET",
  });

  // ok() wraps as { success, data: shop, message? }
  return res.data || res || null;
}

export async function getShopSubcategories(shopId) {
  if (!shopId) {
    throw new Error("Shop id is required");
  }

  const res = await request(`/shops/${shopId}/subcategories`, {
    method: "GET",
  });

  return res.data?.subcategories || [];
}
