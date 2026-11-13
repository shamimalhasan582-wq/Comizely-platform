/**
 * Customer Service
 *
 * All Customer & Tag API calls are centralized here.
 */

import { apiClient } from './apiClient';
import { Customer, CustomerTag } from '../types';
import { initialCustomers, initialCustomerTags } from '../data/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';
const STORAGE_KEYS = {
  CUSTOMERS: 'comizely_customers',
  TAGS: 'comizely_customer_tags',
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

export const customerService = {
  /**
   * Fetch all customers
   * Backend endpoint: GET /api/customers
   */
  async getCustomers(): Promise<Customer[]> {
    if (!USE_MOCK) {
      return apiClient.get<Customer[]>('/customers');
    }
    return getInitial<Customer[]>(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  },

  /**
   * Fetch customer by ID
   * Backend endpoint: GET /api/customers/:id
   */
  async getCustomerById(id: string): Promise<Customer | null> {
    if (!USE_MOCK) {
      return apiClient.get<Customer>(`/customers/${id}`);
    }
    const customers = await this.getCustomers();
    return (
      customers.find(
        (c) =>
          c.id === id ||
          c.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
      ) || null
    );
  },

  /**
   * Create customer
   * Backend endpoint: POST /api/customers
   */
  async createCustomer(customer: Customer): Promise<Customer> {
    if (!USE_MOCK) {
      return apiClient.post<Customer>('/customers', customer);
    }
    const customers = await this.getCustomers();
    const updated = [customer, ...customers];
    saveToStorage(STORAGE_KEYS.CUSTOMERS, updated);
    return customer;
  },

  /**
   * Delete customer
   * Backend endpoint: DELETE /api/customers/:id
   */
  async deleteCustomer(id: string): Promise<void> {
    if (!USE_MOCK) {
      return apiClient.delete<void>(`/customers/${id}`);
    }
    const customers = await this.getCustomers();
    const updated = customers.filter((c) => c.id !== id);
    saveToStorage(STORAGE_KEYS.CUSTOMERS, updated);
  },

  /**
   * Fetch customer tags
   * Backend endpoint: GET /api/customers/tags
   */
  async getTags(): Promise<CustomerTag[]> {
    if (!USE_MOCK) {
      return apiClient.get<CustomerTag[]>('/customers/tags');
    }
    return getInitial<CustomerTag[]>(STORAGE_KEYS.TAGS, initialCustomerTags);
  },

  /**
   * Create tag
   * Backend endpoint: POST /api/customers/tags
   */
  async createTag(tag: CustomerTag): Promise<CustomerTag> {
    if (!USE_MOCK) {
      return apiClient.post<CustomerTag>('/customers/tags', tag);
    }
    const tags = await this.getTags();
    const updated = [tag, ...tags];
    saveToStorage(STORAGE_KEYS.TAGS, updated);
    return tag;
  },

  /**
   * Update tag
   * Backend endpoint: PUT /api/customers/tags/:id
   */
  async updateTag(id: string, updatedTag: Partial<CustomerTag>): Promise<CustomerTag> {
    if (!USE_MOCK) {
      return apiClient.put<CustomerTag>(`/customers/tags/${id}`, updatedTag);
    }
    const tags = await this.getTags();
    let result: CustomerTag | null = null;
    const updated = tags.map((t) => {
      if (t.id === id) {
        result = { ...t, ...updatedTag };
        return result;
      }
      return t;
    });
    saveToStorage(STORAGE_KEYS.TAGS, updated);
    if (!result) throw new Error(`Tag ${id} not found`);
    return result;
  },

  /**
   * Delete tag
   * Backend endpoint: DELETE /api/customers/tags/:id
   */
  async deleteTag(id: string): Promise<void> {
    if (!USE_MOCK) {
      return apiClient.delete<void>(`/customers/tags/${id}`);
    }
    const tags = await this.getTags();
    const updated = tags.filter((t) => t.id !== id);
    saveToStorage(STORAGE_KEYS.TAGS, updated);
  },
};

