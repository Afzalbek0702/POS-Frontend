import { api } from "./apiClient";

// ── Categories ────────────────────────────────────────────────────────────────

export const getCategories = () => api.get("/categories/");

export const createCategory = (name) => api.post("/categories/", { name });

export const updateCategory = (id, name) => api.put(`/categories/${id}/`, { name });

export const deleteCategory = (id) => api.del(`/categories/${id}/`);

// ── Products ──────────────────────────────────────────────────────────────────

export const getProducts = () => api.get("/products/");

export const createProduct = ({ name, price, image, categoryId }) =>
  api.post("/products/", { name, price, image, categoryId });

export const updateProduct = (id, { name, price, image, categoryId }) =>
  api.put(`/products/${id}/`, { name, price, image, categoryId });

export const deleteProduct = (id) => api.del(`/products/${id}/`);

// ── Variants ──────────────────────────────────────────────────────────────────

export const getVariants = (productId) =>
  api.get(`/product/${productId}/variants/`);

export const createVariant = (productId, { name, price }) =>
  api.post(`/product/${productId}/variants/`, { name, price, productId });

export const updateVariant = (id, { name, price, productId }) =>
  api.patch(`/product/variants/${id}/`, { name, price, productId });

export const deleteVariant = (id) => api.del(`/product/variants/${id}/`);