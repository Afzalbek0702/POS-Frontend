// Auth is handled separately since login doesn't need a token attached

const BASE_URL = "https://pos-api-data.vercel.app/api";

export async function loginApi({ email, password }) {
  const res = await fetch(`${BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Login failed. Please check your credentials.");
  }

  return res.json();
}

export async function registerApi({ name, email, password, role }) {
  const res = await fetch(`${BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Registration failed.");
  }

  return res.json();
}

export function saveToken(token) {
  localStorage.setItem("pos_token", token);
}

export function getToken() {
  return localStorage.getItem("pos_token");
}

export function clearToken() {
  localStorage.removeItem("pos_token");
}