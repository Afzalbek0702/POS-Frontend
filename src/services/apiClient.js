import { getToken } from "./authService";

const BASE_URL = "https://pos-api-data.vercel.app/api";

export async function apiClient(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Request failed: ${res.status}`);
  }

  // 204 No Content — nothing to parse
  if (res.status === 204) return null;

  return res.json();
}

export const api = {
  get: (endpoint, options) =>
    apiClient(endpoint, { ...options, method: "GET" }),

  post: (endpoint, body, options) =>
    apiClient(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),

  put: (endpoint, body, options) =>
    apiClient(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),

  patch: (endpoint, body, options) =>
    apiClient(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) }),

  del: (endpoint, options) =>
    apiClient(endpoint, { ...options, method: "DELETE" }),
};