const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  let json = {};
  try {
    json = await response.json();
  } catch {}

  // ---- ERROR HANDLING ----
  // If HTTP is not OK → throw
  if (!response.ok) {
    const err = new Error(json?.message || `HTTP ${response.status}`);
    err.status = response.status;
    err.data = json?.data;
    throw err;
  }

  // If backend returns success: false → also treat as an error
  if (json.success === false) {
    // Detect expired tokens even if backend sends 200
    if (json.errorCode === "TOKEN_EXPIRED") {
      const err = new Error("Token expired");
      err.status = 401;
      throw err;
    }

    const err = new Error(json?.message || "Request failed");
    err.status = json?.status || 400;
    err.data = json?.data;
    throw err;
  }

  return json; // { success, data, message }
}

export { BASE_URL, request };
