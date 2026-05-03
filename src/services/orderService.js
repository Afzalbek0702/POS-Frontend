import { api } from "./apiClient";

export const getOrders = () => api.get("/orders/");

export const getOrderHistory = () => api.get("/orders/history/");

export const createOrder = (items) =>
  api.post("/orders/", { items });
  // items: [{ productId, variantId, quantity }]

export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status/`, { status });
  // status: "DONE" | "PENDING" | "COOKING"