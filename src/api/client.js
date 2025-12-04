// src/api/client.js
const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://10.5.50.243:4000/api"
).replace(/\/+$/, "");

async function request(
  path,
  { method = "GET", body, token, headers: extraHeaders } = {}
) {
  const isFormData = body instanceof FormData;

  const headers = { ...(extraHeaders || {}) };

  // Only set JSON content-type if NOT FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body
      ? isFormData
        ? body // send FormData as-is
        : JSON.stringify(body)
      : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    const msg = json?.message || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = json?.data;
    throw err;
  }

  return json; // { success, data, message }
}

export { BASE_URL, request };
