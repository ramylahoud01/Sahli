// src/api/auth.js
import { request } from "./client";

const TOKEN_KEY = "sahli_access";
const REFRESH_KEY = "sahli_refresh";

// ---------- Helpers for tokens ----------
export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) || null;
}

function setTokens(payload = {}) {
  const { access, refresh } = payload;
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// ---------- Auth endpoints ----------
export async function login({ email, password }) {
  const res = await request("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  // res is { success, data, message }
  const payload = res.data || res;
  setTokens(payload);

  return payload; // { user, access, refresh }
}

export async function register({ name, email, password }) {
  const res = await request("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
  return res.data || res;
}

export async function verifySignup({ pendingId, code }) {
  console.log("pendingId", pendingId);
  console.log("code", code);
  const res = await request("/auth/verify-code", {
    method: "POST",
    body: { pendingId, code },
  });
  console.log("res", res);
  return res.data || res;
}

// ---------- Refresh access token ----------
export async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await request("/auth/refresh", {
      method: "POST",
      body: { refresh },
    });

    const payload = res.data || res; // expected { access, refresh }
    setTokens(payload);

    return payload;
  } catch (err) {
    // Refresh failed → clear tokens and let caller handle redirect
    logout();
    throw err;
  }
}

// ---------- Secure request wrapper ----------
// Use this instead of request() for protected endpoints
export async function secureRequest(path, options = {}) {
  let token = getAccessToken();
  if (!token) {
    const err = new Error("Not authenticated");
    err.status = 401;
    throw err;
  }

  try {
    // First attempt with current access token
    return await request(path, { ...options, token });
  } catch (err) {
    // If not auth-related, just rethrow
    if (err?.status !== 401 && err?.status !== 403) {
      throw err;
    }

    // Try to refresh
    const refreshed = await refreshAccessToken();
    if (!refreshed || !refreshed.access) {
      // Refresh failed → user must login again
      throw err;
    }

    // Retry original request with new token
    token = refreshed.access;
    return await request(path, { ...options, token });
  }
}

// ---------- /auth/me using secureRequest ----------
export async function getMe() {
  try {
    const res = await secureRequest("/auth/me", {
      method: "GET",
    });
    return res.data || res;
  } catch (err) {
    // If user is not authenticated (no token / refresh fail), just return null
    if (err?.status === 401 || err?.status === 403) {
      return null;
    }
    throw err;
  }
}
