// src/api/categorie.js
import { request } from "./client";

/**
 * GET /categories (public)
 * Backend returns:
 * { success: true, data: [ { _id, name, subcategories: [...] } ] }
 */
export async function listCategories() {
  const res = await request("/categories", {
    method: "GET",
  });

  // Always return an array for consistency
  return res.data || res || [];
}
