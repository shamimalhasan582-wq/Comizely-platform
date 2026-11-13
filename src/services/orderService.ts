/**
 * Order Service
 *
 * All Order API calls are centralized here.
 * When connecting to your backend API:
 * 1. Set VITE_USE_MOCK_API=false in your .env file (or set VITE_API_BASE_URL).
 * 2. The functions below will automatically route to your backend endpoints.
 */

import { apiClient } from './apiClient';
import { Order, OrderStatus } from '../types';
import {
  initialOrders,
  initialReturns,
  initialIncompleteOrders,
  initialDraftOrders,
} from '../data/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Local storage keys for persistent offline development
const STORAGE_KEYS = {
  ORDERS: 'comizely_orders',
  RETURNS: 'comizely_returns',
  INCOMPLETE: 'comizely_incomplete_orders',
  DRAFTS: 'comizely_draft_orders',
};

// Helper to initialize local persistence from mock data
const getInitial = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed to save ${key} to localStorage:`, err);
  }
};

export const orderService = {
  /**
   * Fetch all orders
   * Backend endpoint: GET /api/orders
   */
  async getOrders(): Promise<Order[]> {
    if (!USE_MOCK) {
      return apiClient.get<Order[]>('/orders');
    }
    return getInitial<Order[]>(STORAGE_KEYS.ORDERS, initialOrders);
  },

  /**
   * Fetch order by ID or order number (e.g., "#21529" or "21529")
   * Backend endpoint: GET /api/orders/:id
   */
  async getOrderById(id: string): Promise<Order | null> {
    if (!USE_MOCK) {
      return apiClient.get<Order>(`/orders/${id}`);
    }
    const orders = await this.getOrders();
    const cleanId = id.replace('#', '');
    return (
      orders.find(
        (o) =>
          o.id === id ||
          o.orderNumber === id ||
          o.orderNumber.replace('#', '') === cleanId
      ) || null
    );
  },

  /**
   * Create a new order
   * Backend endpoint: POST /api/orders
   */
  async createOrder(newOrder: Order): Promise<Order> {
    if (!USE_MOCK) {
      return apiClient.post<Order>('/orders', newOrder);
    }
    const orders = await this.getOrders();
    const updated = [newOrder, ...orders];
    saveToStorage(STORAGE_KEYS.ORDERS, updated);
    return newOrder;
  },

  /**
   * Update order status
   * Backend endpoint: PATCH /api/orders/:id/status
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    if (!USE_MOCK) {
      return apiClient.patch<Order>(`/orders/${id}/status`, { status });
    }
    const orders = await this.getOrders();
    let updatedOrder: Order | null = null;
    const updated = orders.map((o) => {
      if (o.id === id || o.orderNumber === id) {
        updatedOrder = { ...o, status };
        return updatedOrder;
      }
      return o;
    });
    saveToStorage(STORAGE_KEYS.ORDERS, updated);
    if (!updatedOrder) throw new Error(`Order ${id} not found`);
    return updatedOrder;
  },

  /**
   * Delete an order
   * Backend endpoint: DELETE /api/orders/:id
   */
  async deleteOrder(id: string): Promise<void> {
    if (!USE_MOCK) {
      return apiClient.delete<void>(`/orders/${id}`);
    }
    const orders = await this.getOrders();
    const updated = orders.filter((o) => o.id !== id && o.orderNumber !== id);
    saveToStorage(STORAGE_KEYS.ORDERS, updated);
  },

  /**
   * Bulk delete orders
   * Backend endpoint: POST /api/orders/bulk-delete
   */
  async bulkDelete(ids: string[]): Promise<void> {
    if (!USE_MOCK) {
      return apiClient.post<void>('/orders/bulk-delete', { ids });
    }
    const orders = await this.getOrders();
    const idSet = new Set(ids);
    const updated = orders.filter((o) => !idSet.has(o.id));
    saveToStorage(STORAGE_KEYS.ORDERS, updated);
  },

  /**
   * Bulk update status
   * Backend endpoint: POST /api/orders/bulk-status
   */
  async bulkUpdateStatus(ids: string[], status: OrderStatus): Promise<void> {
    if (!USE_MOCK) {
      return apiClient.post<void>('/orders/bulk-status', { ids, status });
    }
    const orders = await this.getOrders();
    const idSet = new Set(ids);
    const updated = orders.map((o) => (idSet.has(o.id) ? { ...o, status } : o));
    saveToStorage(STORAGE_KEYS.ORDERS, updated);
  },

  /**
   * Fetch returns
   * Backend endpoint: GET /api/orders/returns
   */
  async getReturns(): Promise<typeof initialReturns> {
    if (!USE_MOCK) {
      return apiClient.get('/orders/returns');
    }
    return getInitial(STORAGE_KEYS.RETURNS, initialReturns);
  },

  /**
   * Fetch incomplete checkout orders
   * Backend endpoint: GET /api/orders/incomplete
   */
  async getIncompleteOrders(): Promise<typeof initialIncompleteOrders> {
    if (!USE_MOCK) {
      return apiClient.get('/orders/incomplete');
    }
    return getInitial(STORAGE_KEYS.INCOMPLETE, initialIncompleteOrders);
  },

  /**
   * Fetch draft orders
   * Backend endpoint: GET /api/orders/drafts
   */
  async getDraftOrders(): Promise<typeof initialDraftOrders> {
    if (!USE_MOCK) {
      return apiClient.get('/orders/drafts');
    }
    return getInitial(STORAGE_KEYS.DRAFTS, initialDraftOrders);
  },

  /**
   * Save a draft order
   * Backend endpoint: POST /api/orders/drafts
   */
  async saveDraft(draft: Order): Promise<Order> {
    if (!USE_MOCK) {
      return apiClient.post<Order>('/orders/drafts', draft);
    }
    const drafts = await this.getDraftOrders();
    const updated = [draft, ...drafts];
    saveToStorage(STORAGE_KEYS.DRAFTS, updated);
    return draft;
  },
};

