import { getToken } from "@/services/authService";

/**
 * Renders children if a token exists in localStorage,
 * otherwise renders the fallback (e.g. <LoginPage />).
 */
export default function ProtectedRoute({ children, fallback }) {
  const token = getToken();
  return token ? children : fallback;
}
