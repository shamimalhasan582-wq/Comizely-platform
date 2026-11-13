/**
 * Product Service
 *
 * All Product and Inventory API calls are centralized here.
 */

import { apiClient } from './apiClient';
import { Product } from '../types';
import { initialProducts } from '../data/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';
const STORAGE_KEY = 'comizely_products';

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

export const productService = {
  /**
   * Fetch all products
   * Backend endpoint: GET /api/products
   */
  async getProducts(): Promise<Product[]> {
    if (!USE_MOCK) {
      return apiClient.get<Product[]>('/products');
    }
    return getInitial<Product[]>(STORAGE_KEY, initialProducts);
  },

  /**
   * Fetch product by ID
   * Backend endpoint: GET /api/products/:id
   */
  async getProductById(id: string): Promise<Product | null> {
    if (!USE_MOCK) {
      return apiClient.get<Product>(`/products/${id}`);
    }
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  },

  /**
   * Create a new product
   * Backend endpoint: POST /api/products
   */
  async addProduct(newProduct: Product): Promise<Product> {
    if (!USE_MOCK) {
      return apiClient.post<Product>('/products', newProduct);
    }
    const products = await this.getProducts();
    const updated = [newProduct, ...products];
    saveToStorage(STORAGE_KEY, updated);
    return newProduct;
  },

  /**
   * Update product stock level
   * Backend endpoint: PATCH /api/products/:id/stock
   */
  async updateStock(id: string, newStock: number): Promise<Product> {
    if (!USE_MOCK) {
      return apiClient.patch<Product>(`/products/${id}/stock`, { stock: newStock });
    }
    const products = await this.getProducts();
    let updatedProduct: Product | null = null;
    const updated = products.map((p) => {
      if (p.id === id) {
        updatedProduct = { ...p, stock: newStock };
        return updatedProduct;
      }
      return p;
    });
    saveToStorage(STORAGE_KEY, updated);
    if (!updatedProduct) throw new Error(`Product ${id} not found`);
    return updatedProduct;
  },

  /**
   * Delete a product
   * Backend endpoint: DELETE /api/products/:id
   */
  async deleteProduct(id: string): Promise<void> {
    if (!USE_MOCK) {
      return apiClient.delete<void>(`/products/${id}`);
    }
    const products = await this.getProducts();
    const updated = products.filter((p) => p.id !== id);
    saveToStorage(STORAGE_KEY, updated);
  },
};

