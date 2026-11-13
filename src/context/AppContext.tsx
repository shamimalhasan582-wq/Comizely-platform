/**
 * App State Context
 *
 * Provides reactive access to application entities (orders, products, customers, purchases)
 * with zero prop-drilling. Built to easily consume the service layer.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  orderService,
  productService,
  customerService,
  purchaseService,
} from '../services';
import {
  Order,
  Product,
  Customer,
  CustomerTag,
  Purchase,
  PurchaseReturn,
  SupplierItem,
  OrderStatus,
} from '../types';

interface AppContextType {
  // Orders
  orders: Order[];
  loadingOrders: boolean;
  createOrder: (order: Order) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  bulkDeleteOrders: (ids: string[]) => Promise<void>;
  bulkUpdateOrderStatus: (ids: string[], status: OrderStatus) => Promise<void>;

  // Sub-orders (returns, incomplete, drafts)
  returns: any[];
  incompleteOrders: any[];
  draftOrders: Order[];
  approveReturn: (id: string) => void;
  rejectReturn: (id: string) => void;
  processRefund: (id: string) => void;
  convertDraftToLive: (draft: Order) => void;
  deleteDraft: (id: string) => void;

  // Products
  products: Product[];
  loadingProducts: boolean;
  addProduct: (product: Product) => Promise<Product>;
  updateProductStock: (id: string, newStock: number) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Customers
  customers: Customer[];
  customerTags: CustomerTag[];
  loadingCustomers: boolean;
  createCustomer: (customer: Customer) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
  createCustomerTag: (tag: CustomerTag) => Promise<CustomerTag>;
  updateCustomerTag: (id: string, tag: Partial<CustomerTag>) => Promise<void>;
  deleteCustomerTag: (id: string) => Promise<void>;

  // Purchases & Suppliers
  purchases: Purchase[];
  purchaseReturns: PurchaseReturn[];
  suppliers: SupplierItem[];
  loadingPurchases: boolean;
  createPurchase: (purchase: Purchase) => Promise<Purchase>;
  updatePurchase: (purchase: Purchase) => void;
  deletePurchase: (id: string) => Promise<void>;
  createSupplier: (supplier: SupplierItem) => Promise<SupplierItem>;
  deleteSupplier: (id: string) => Promise<void>;

  // Toast feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Sub-orders state
  const [returns, setReturns] = useState<any[]>([]);
  const [incompleteOrders, setIncompleteOrders] = useState<any[]>([]);
  const [draftOrders, setDraftOrders] = useState<Order[]>([]);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Customers state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerTags, setCustomerTags] = useState<CustomerTag[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // Purchases state
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchaseReturns, setPurchaseReturns] = useState<PurchaseReturn[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Initial data loading from services
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [
          fetchedOrders,
          fetchedReturns,
          fetchedIncomplete,
          fetchedDrafts,
          fetchedProducts,
          fetchedCustomers,
          fetchedTags,
          fetchedPurchases,
          fetchedPurchaseReturns,
          fetchedSuppliers,
        ] = await Promise.all([
          orderService.getOrders(),
          orderService.getReturns(),
          orderService.getIncompleteOrders(),
          orderService.getDraftOrders(),
          productService.getProducts(),
          customerService.getCustomers(),
          customerService.getTags(),
          purchaseService.getPurchases(),
          purchaseService.getReturns(),
          purchaseService.getSuppliers(),
        ]);

        if (isMounted) {
          setOrders(fetchedOrders);
          setReturns(fetchedReturns);
          setIncompleteOrders(fetchedIncomplete);
          setDraftOrders(fetchedDrafts);
          setProducts(fetchedProducts);
          setCustomers(fetchedCustomers);
          setCustomerTags(fetchedTags);
          setPurchases(fetchedPurchases);
          setPurchaseReturns(fetchedPurchaseReturns);
          setSuppliers(fetchedSuppliers);
        }
      } catch (err) {
        console.error('Error loading initial data from services:', err);
      } finally {
        if (isMounted) {
          setLoadingOrders(false);
          setLoadingProducts(false);
          setLoadingCustomers(false);
          setLoadingPurchases(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Orders Actions
  const createOrder = useCallback(
    async (newOrder: Order) => {
      const created = await orderService.createOrder(newOrder);
      setOrders((prev) => [created, ...prev]);
      showToast(`Order ${created.orderNumber} created!`);
      return created;
    },
    [showToast]
  );

  const updateOrderStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      await orderService.updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === id || o.orderNumber === id ? { ...o, status } : o))
      );
      showToast(`Order status updated to "${status}"`);
    },
    [showToast]
  );

  const deleteOrder = useCallback(
    async (id: string) => {
      await orderService.deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id && o.orderNumber !== id));
      showToast('Order deleted');
    },
    [showToast]
  );

  const bulkDeleteOrders = useCallback(
    async (ids: string[]) => {
      await orderService.bulkDelete(ids);
      const set = new Set(ids);
      setOrders((prev) => prev.filter((o) => !set.has(o.id)));
      showToast(`${ids.length} orders deleted`);
    },
    [showToast]
  );

  const bulkUpdateOrderStatus = useCallback(
    async (ids: string[], status: OrderStatus) => {
      await orderService.bulkUpdateStatus(ids, status);
      const set = new Set(ids);
      setOrders((prev) =>
        prev.map((o) => (set.has(o.id) ? { ...o, status } : o))
      );
      showToast(`${ids.length} orders updated to "${status}"`);
    },
    [showToast]
  );

  // Return actions
  const approveReturn = useCallback((id: string) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
    showToast('Return request approved');
  }, [showToast]);

  const rejectReturn = useCallback((id: string) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
    showToast('Return request rejected');
  }, [showToast]);

  const processRefund = useCallback((id: string) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Refunded' } : r))
    );
    showToast('Refund processed successfully');
  }, [showToast]);

  // Draft actions
  const convertDraftToLive = useCallback((draft: Order) => {
    const liveOrder: Order = {
      ...draft,
      id: `ord-${Date.now()}`,
      orderNumber: `#${Date.now().toString().slice(-5)}`,
      status: 'Pending',
    };
    setOrders((prev) => [liveOrder, ...prev]);
    setDraftOrders((prev) => prev.filter((d) => d.id !== draft.id));
    showToast(`Draft converted to live order ${liveOrder.orderNumber}!`);
  }, [showToast]);

  const deleteDraft = useCallback((id: string) => {
    setDraftOrders((prev) => prev.filter((d) => d.id !== id));
    showToast('Draft order discarded.');
  }, [showToast]);

  // Products Actions
  const addProduct = useCallback(
    async (newProd: Product) => {
      const created = await productService.addProduct(newProd);
      setProducts((prev) => [created, ...prev]);
      showToast(`Product "${created.name}" added`);
      return created;
    },
    [showToast]
  );

  const updateProductStock = useCallback(
    async (id: string, newStock: number) => {
      await productService.updateStock(id, newStock);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
      );
      showToast('Stock updated');
    },
    [showToast]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Product removed');
    },
    [showToast]
  );

  // Customers Actions
  const createCustomer = useCallback(
    async (customer: Customer) => {
      const created = await customerService.createCustomer(customer);
      setCustomers((prev) => [created, ...prev]);
      showToast(`Customer ${created.name} added`);
      return created;
    },
    [showToast]
  );

  const deleteCustomer = useCallback(
    async (id: string) => {
      await customerService.deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      showToast('Customer deleted');
    },
    [showToast]
  );

  const createCustomerTag = useCallback(
    async (tag: CustomerTag) => {
      const created = await customerService.createTag(tag);
      setCustomerTags((prev) => [created, ...prev]);
      showToast(`Tag "${created.name}" created`);
      return created;
    },
    [showToast]
  );

  const updateCustomerTag = useCallback(
    async (id: string, partial: Partial<CustomerTag>) => {
      const updated = await customerService.updateTag(id, partial);
      setCustomerTags((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast(`Tag "${updated.name}" updated`);
    },
    [showToast]
  );

  const deleteCustomerTag = useCallback(
    async (id: string) => {
      await customerService.deleteTag(id);
      setCustomerTags((prev) => prev.filter((t) => t.id !== id));
      showToast('Tag deleted');
    },
    [showToast]
  );

  // Purchases Actions
  const createPurchase = useCallback(
    async (purchase: Purchase) => {
      const created = await purchaseService.createPurchase(purchase);
      setPurchases((prev) => [created, ...prev]);
      showToast(`Purchase ${created.invoiceNo} created`);
      return created;
    },
    [showToast]
  );

  const updatePurchase = useCallback(
    (updated: Purchase) => {
      setPurchases((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      showToast(`Purchase ${updated.invoiceNo} updated`);
    },
    [showToast]
  );

  const deletePurchase = useCallback(
    async (id: string) => {
      await purchaseService.deletePurchase(id);
      setPurchases((prev) => prev.filter((p) => p.id !== id && p.invoiceNo !== id));
      showToast('Purchase deleted');
    },
    [showToast]
  );

  const createSupplier = useCallback(
    async (supplier: SupplierItem) => {
      const created = await purchaseService.createSupplier(supplier);
      setSuppliers((prev) => [created, ...prev]);
      showToast(`Supplier ${created.name} added`);
      return created;
    },
    [showToast]
  );

  const deleteSupplier = useCallback(
    async (id: string) => {
      await purchaseService.deleteSupplier(id);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      showToast('Supplier deleted');
    },
    [showToast]
  );

  const value: AppContextType = {
    orders,
    loadingOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    bulkDeleteOrders,
    bulkUpdateOrderStatus,

    returns,
    incompleteOrders,
    draftOrders,
    approveReturn,
    rejectReturn,
    processRefund,
    convertDraftToLive,
    deleteDraft,

    products,
    loadingProducts,
    addProduct,
    updateProductStock,
    deleteProduct,

    customers,
    customerTags,
    loadingCustomers,
    createCustomer,
    deleteCustomer,
    createCustomerTag,
    updateCustomerTag,
    deleteCustomerTag,

    purchases,
    purchaseReturns,
    suppliers,
    loadingPurchases,
    createPurchase,
    updatePurchase,
    deletePurchase,
    createSupplier,
    deleteSupplier,

    toastMessage,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
