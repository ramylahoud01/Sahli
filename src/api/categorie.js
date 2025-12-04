// src/api/categorie.js
import { request } from "./client";

/**
 * GET /api/categories
 * Backend returns: { success, data: [ { _id, name, subcategories: [...] } ] }
 */
export async function listCategories() {
  const res = await request("/categories", {
    method: "GET",
  });

  // keep it simple: always return an array
  return res.data || [];
}
