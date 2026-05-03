import { useApi, useMutation } from "./useApi";
import {
  getOrders,
  getOrderHistory,
  createOrder,
  updateOrderStatus,
} from "../services/orderService";

export const useOrders = () => useApi(getOrders);

export const useOrderHistory = () => useApi(getOrderHistory);

export const useCreateOrder = () => useMutation(createOrder);

export const useUpdateOrderStatus = () => useMutation(updateOrderStatus);