const BASE_URL = "https://pos-api-data.vercel.app/api";

export async function loginApi(payload) {
  const res = await fetch(`${BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Login failed. Please check your credentials.");
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
