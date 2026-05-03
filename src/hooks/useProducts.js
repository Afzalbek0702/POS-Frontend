import { useApi, useMutation } from "./useApi";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant,
} from "../services/productService";

// ── Products ──────────────────────────────────────────────────────────────────

export const useProducts = () => useApi(getProducts);

export const useCreateProduct = () => useMutation(createProduct);
export const useUpdateProduct = () => useMutation((id, data) => updateProduct(id, data));
export const useDeleteProduct = () => useMutation(deleteProduct);

// ── Categories ────────────────────────────────────────────────────────────────

export const useCategories = () => useApi(getCategories);

export const useCreateCategory = () => useMutation(createCategory);
export const useUpdateCategory = () => useMutation((id, name) => updateCategory(id, name));
export const useDeleteCategory = () => useMutation(deleteCategory);

// ── Variants ──────────────────────────────────────────────────────────────────

export const useVariants = (productId) =>
  useApi(() => getVariants(productId), [productId]);

export const useCreateVariant = () => useMutation(createVariant);
export const useUpdateVariant = () => useMutation((id, data) => updateVariant(id, data));
export const useDeleteVariant = () => useMutation(deleteVariant);