// src/api/shops.js
import { secureRequest } from "./auth";

export async function getMyShops(params = {}) {
  // Build query string from params
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page);
  if (params.limit) searchParams.append("limit", params.limit);
  if (params.search && params.search.trim()) {
    searchParams.append("search", params.search.trim());
  }

  // In case you later pass extra filters, include them generically
  Object.entries(params).forEach(([key, value]) => {
    if (["page", "limit", "search"].includes(key)) return;
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  const url = `/shops/me${queryString ? `?${queryString}` : ""}`;

  const res = await secureRequest(url, { method: "GET" });
  // keep same shape as before
  return res.data || res || [];
}

export async function createShop(payload) {
  console.log("payload", payload);

  const res = await secureRequest("/shops", {
    method: "POST",
    body: payload,
  });

  // keep same shape as before
  return res.data || res;
}

export const uploadShopImage = async (file) => {
  try {
    const formData = new FormData();
    // 👇 MUST MATCH multer upload.single("file")
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

/**
 * Public: get a single shop by id
 * Backend: GET /shops/:id → ok(res, shop)
 */
export async function getShopById(shopId) {
  if (!shopId) {
    throw new Error("Shop id is required");
  }

  const res = await secureRequest(`/shops/${shopId}`, {
    method: "GET",
  });

  // ok() wraps as { success, data: shop, message? }
  return res.data || res || null;
}

export async function getShopSubcategories(shopId) {
  const res = await secureRequest(`/shops/${shopId}/subcategories`, {
    method: "GET",
  });

  return res.data?.subcategories || [];
}
