/**
 * Purchase & Supplier Service
 *
 * All Purchase Order, Purchase Return & Supplier API calls are centralized here.
 */

import { apiClient } from './apiClient';
import { Purchase, PurchaseReturn, SupplierItem } from '../types';
import {
  INITIAL_PURCHASES,
  INITIAL_PURCHASE_RETURNS,
  DETAILED_SUPPLIERS,
} from '../data/mockPurchases';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';
const STORAGE_KEYS = {
  PURCHASES: 'comizely_purchases',
  PURCHASE_RETURNS: 'comizely_purchase_returns',
  SUPPLIERS: 'comizely_suppliers',
};

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

export const purchaseService = {
  /**
   * Fetch all purchases
   * Backend endpoint: GET /api/purchases
   */
  async getPurchases(): Promise<Purchase[]> {
    if (!USE_MOCK) {
      return apiClient.get<Purchase[]>('/purchases');
    }
    return getInitial<Purchase[]>(STORAGE_KEYS.PURCHASES, INITIAL_PURCHASES);
  },

  /**
   * Fetch purchase by invoice number or ID
   * Backend endpoint: GET /api/purchases/:id
   */
  async getPurchaseById(id: string): Promise<Purchase | null> {
    if (!USE_MOCK) {
      return apiClient.get<Purchase>(`/purchases/${id}`);
    }
    const purchases = await this.getPurchases();
    const cleanId = id.replace('#', '');
    return (
      purchases.find(
        (p) =>
          p.id === id ||
          p.invoiceNo === id ||
          p.invoiceNo.replace('#', '') === cleanId
      ) || null
    );
  },

  /**
   * Create a new purchase order
   * Backend endpoint: POST /api/purchases
   */
  async createPurchase(purchase: Purchase): Promise<Purchase> {
    if (!USE_MOCK) {
      return apiClient.post<Purchase>('/purchases', purchase);
    }
    const purchases = await this.getPurchases();
    const updated = [purchase, ...purchases];
    saveToStorage(STORAGE_KEYS.PURCHASES, updated);
    return purchase;
  },

  /**
   * Update purchase order
   * Backend endpoint: PUT /api/purchases/:id
   */
  async updatePurchase(id: string, updatedPurchase: Partial<Purchase>): Promise<Purchase> {
    if (!USE_MOCK) {
      return apiClient.put<Purchase>(`/purchases/${id}`, updatedPurchase);
    }
    const purchases = await this.getPurchases();
    let result: Purchase | null = null;
    const updated = purchases.map((p) => {
      if (p.id === id || p.invoiceNo === id) {
        result = { ...p, ...updatedPurchase };
        return result;
      }
      return p;
    });
    saveToStorage(STORAGE_KEYS.PURCHASES, updated);
    if (!result) throw new Error(`Purchase ${id} not found`);
    return result;
  },

  /**
   * Delete purchase order
   * Backend endpoint: DELETE /api/purchases/:id
   */
  async deletePurchase(id: string): Promise<void> {
    if (!USE_MOCK) {
      return apiClient.delete<void>(`/purchases/${id}`);
    }
    const purchases = await this.getPurchases();
    const updated = purchases.filter((p) => p.id !== id && p.invoiceNo !== id);
    saveToStorage(STORAGE_KEYS.PURCHASES, updated);
  },

  /**
   * Fetch purchase returns
   * Backend endpoint: GET /api/purchases/returns
   */
  async getReturns(): Promise<PurchaseReturn[]> {
    if (!USE_MOCK) {
      return apiClient.get<PurchaseReturn[]>('/purchases/returns');
    }
    return getInitial<PurchaseReturn[]>(
      STORAGE_KEYS.PURCHASE_RETURNS,
      INITIAL_PURCHASE_RETURNS
    );
  },

  /**
   * Fetch all suppliers
   * Backend endpoint: GET /api/suppliers
   */
  async getSuppliers(): Promise<SupplierItem[]> {
    if (!USE_MOCK) {
      return apiClient.get<SupplierItem[]>('/suppliers');
    }
    return getInitial<SupplierItem[]>(STORAGE_KEYS.SUPPLIERS, DETAILED_SUPPLIERS);
  },

  /**
   * Fetch supplier by ID
   * Backend endpoint: GET /api/suppliers/:id
   */
  async getSupplierById(id: string): Promise<SupplierItem | null> {
    if (!USE_MOCK) {
      return apiClient.get<SupplierItem>(`/suppliers/${id}`);
    }
    const suppliers = await this.getSuppliers();
    return (
      suppliers.find(
        (s) =>
          s.id === id ||
          s.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
      ) || null
    );
  },

  /**
   * Create supplier
   * Backend endpoint: POST /api/suppliers
   */
  async createSupplier(supplier: SupplierItem): Promise<SupplierItem> {
    if (!USE_MOCK) {
      return apiClient.post<SupplierItem>('/suppliers', supplier);
    }
    const suppliers = await this.getSuppliers();
    const updated = [supplier, ...suppliers];
    saveToStorage(STORAGE_KEYS.SUPPLIERS, updated);
    return supplier;
  },

  /**
   * Delete supplier
   * Backend endpoint: DELETE /api/suppliers/:id
   */
  async deleteSupplier(id: string): Promise<void> {
    if (!USE_MOCK) {
      return apiClient.delete<void>(`/suppliers/${id}`);
    }
    const suppliers = await this.getSuppliers();
    const updated = suppliers.filter((s) => s.id !== id);
    saveToStorage(STORAGE_KEYS.SUPPLIERS, updated);
  },
};

