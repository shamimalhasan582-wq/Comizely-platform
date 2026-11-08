/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OrdersView } from './components/orders/OrdersView';
import { CreateOrderModal } from './components/orders/CreateOrderModal';
import { CreateOrderPage } from './components/orders/CreateOrderPage';
import { OrderDetailPage } from './components/orders/OrderDetailPage';
import { OrderReturnsView } from './components/orders/OrderReturnsView';
import { IncompleteOrdersView } from './components/orders/IncompleteOrdersView';
import { DraftOrdersView } from './components/orders/DraftOrdersView';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProductsView } from './components/products/ProductsView';
import { CustomersView } from './components/customers/CustomersView';
import { CreateCustomerModal } from './components/customers/CreateCustomerModal';
import { CustomerDetailPage } from './components/customers/CustomerDetailPage';
import { CustomerTagsView } from './components/customers/CustomerTagsView';
import { CreateCustomerTagModal } from './components/customers/CreateCustomerTagModal';
import { FinanceView } from './components/finance/FinanceView';
import { TasksView } from './components/tasks/TasksView';
import { SettingsView } from './components/settings/SettingsView';
import { OnlineStoreView } from './components/store/OnlineStoreView';
import { SupportModal } from './components/support/SupportModal';
import { NotificationsDrawer, NotificationItem } from './components/notifications/NotificationsDrawer';
import { PurchasesView } from './components/purchases/PurchasesView';
import { CreatePurchasePage } from './components/purchases/CreatePurchasePage';
import { PurchaseDetailPage } from './components/purchases/PurchaseDetailPage';
import { PurchasesReturnView } from './components/purchases/PurchasesReturnView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { CreateSupplierModal } from './components/suppliers/CreateSupplierModal';
import { SupplierDetailPage } from './components/suppliers/SupplierDetailPage';
import {
  INITIAL_PURCHASES,
  SUPPLIERS_LIST,
  INITIAL_PURCHASE_RETURNS,
  DETAILED_SUPPLIERS,
} from './data/mockPurchases';

import {
  initialOrders,
  initialProducts,
  initialCustomers,
  initialReturns,
  initialIncompleteOrders,
  initialDraftOrders,
  initialCustomerTags,
} from './data/mockData';
import { Order, Product, OrderStatus, ActiveNav, Purchase, PurchaseReturn, SupplierItem, Customer, CustomerTag } from './types';

export default function App() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [customerTags, setCustomerTags] = useState<CustomerTag[]>(initialCustomerTags);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [isCreateCustomerTagOpen, setIsCreateCustomerTagOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<CustomerTag | null>(null);
  const [returns, setReturns] = useState(initialReturns);
  const [incompleteOrders, setIncompleteOrders] = useState(initialIncompleteOrders);
  const [draftOrders, setDraftOrders] = useState(initialDraftOrders);
  const [purchases, setPurchases] = useState<Purchase[]>(INITIAL_PURCHASES);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [purchaseReturns, setPurchaseReturns] = useState<PurchaseReturn[]>(INITIAL_PURCHASE_RETURNS);
  const [suppliersList, setSuppliersList] = useState<SupplierItem[]>(DETAILED_SUPPLIERS);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(null);
  const [isCreateSupplierOpen, setIsCreateSupplierOpen] = useState(false);

  const [activeNav, setActiveNav] = useState<ActiveNav>('orders');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers state
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Filters state
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('All');
  const [filterMinAmount, setFilterMinAmount] = useState('');
  const [filterMaxAmount, setFilterMaxAmount] = useState('');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'New Online Order Placed',
      description: 'Order #21547 received via Biponil.com checkout.',
      time: '15m ago',
      read: false,
      type: 'order',
    },
    {
      id: 'n-2',
      title: 'Low Stock Alert',
      description: 'Genuine Leather Minimalist Wallet is down to 5 units.',
      time: '1h ago',
      read: false,
      type: 'stock',
    },
    {
      id: 'n-3',
      title: 'Courier Dispatch Confirmed',
      description: 'Steadfast Courier picked up 4 ready shipments.',
      time: '3h ago',
      read: true,
      type: 'courier',
    },
  ]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Filtered orders taking into account header search and filter modal
  const displayedOrders = useMemo(() => {
    let result = [...orders];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.includes(q) ||
          o.branch.toLowerCase().includes(q)
      );
    }

    if (filterBranch !== 'All') {
      result = result.filter((o) => o.branch === filterBranch);
    }

    if (filterPaymentStatus !== 'All') {
      result = result.filter((o) => o.paymentStatus === filterPaymentStatus);
    }

    if (filterMinAmount) {
      const min = parseFloat(filterMinAmount);
      if (!isNaN(min)) {
        result = result.filter((o) => o.totalAmount >= min);
      }
    }

    if (filterMaxAmount) {
      const max = parseFloat(filterMaxAmount);
      if (!isNaN(max)) {
        result = result.filter((o) => o.totalAmount <= max);
      }
    }

    return result;
  }, [orders, searchQuery, filterBranch, filterPaymentStatus, filterMinAmount, filterMaxAmount]);

  const handleResetFilters = () => {
    setFilterBranch('All');
    setFilterPaymentStatus('All');
    setFilterMinAmount('');
    setFilterMaxAmount('');
    showToast('Filters reset to default');
  };

  // Actions on orders
  const handleCreateOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    showToast(`Order ${newOrder.orderNumber} created successfully!`);
    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Order ${newOrder.orderNumber} Created`,
        description: `Customer ${newOrder.customer.name} • ${newOrder.totalAmount} BDT`,
        time: 'Just now',
        read: false,
        type: 'order',
      },
      ...prev,
    ]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Order status updated to ${newStatus}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(null);
    }
    showToast(`Order ${target?.orderNumber || ''} removed.`);
  };

  const handleBulkDelete = (orderIds: string[]) => {
    setOrders((prev) => prev.filter((o) => !orderIds.includes(o.id)));
    showToast(`Deleted ${orderIds.length} orders`);
  };

  const handleBulkStatusUpdate = (orderIds: string[], status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (orderIds.includes(o.id) ? { ...o, status } : o))
    );
    showToast(`Updated ${orderIds.length} orders to ${status}`);
  };

  // Product actions
  const handleAddProduct = (newProd: Product) => {
    setProducts([newProd, ...products]);
    showToast(`Product "${newProd.name}" added to catalog.`);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock: newStock,
              status: newStock > 10 ? 'In Stock' : newStock > 0 ? 'Low Stock' : 'Out of Stock',
            }
          : p
      )
    );
    showToast('Inventory stock updated.');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from catalog.');
  };

  // Returns actions
  const handleApproveReturn = (id: string) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
    showToast('Return request approved. Ready for refund.');
  };

  const handleRejectReturn = (id: string) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
    showToast('Return request rejected.');
  };

  const handleProcessRefund = (id: string) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Refunded' } : r))
    );
    showToast('Refund processed successfully to customer bKash/wallet.');
  };

  // Incomplete orders
  const handleSendRecovery = (id: string) => {
    setIncompleteOrders((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, recoverySent: true } : inc))
    );
    showToast('Recovery SMS with 5% discount link dispatched to customer!');
  };

  // Draft orders
  const handleConvertDraftToLive = (draft: Order) => {
    const liveOrder: Order = {
      ...draft,
      id: `ord-${Date.now()}`,
      orderNumber: `#${parseInt(orders[0]?.orderNumber.replace(/\D/g, '') || '21547', 10) + 1}`,
      status: 'Pending',
    };
    setOrders([liveOrder, ...orders]);
    setDraftOrders((prev) => prev.filter((d) => d.id !== draft.id));
    setActiveNav('orders');
    showToast(`Draft converted to live order ${liveOrder.orderNumber}!`);
  };

  const handleDeleteDraft = (id: string) => {
    setDraftOrders((prev) => prev.filter((d) => d.id !== id));
    showToast('Draft order discarded.');
  };

  // If in online-store view, render full storefront
  if (activeNav === 'online-store') {
    return (
      <OnlineStoreView
        products={products}
        onBackToAdmin={() => setActiveNav('orders')}
        onPlaceStorefrontOrder={handleCreateOrder}
        lastOrderNumber={orders[0]?.orderNumber || '#21547'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col md:flex-row antialiased selection:bg-purple-100 selection:text-purple-700">
      {/* Left Sidebar (pixel-accurate to screenshot) */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={(nav) => {
          setSelectedOrder(null);
          setSelectedPurchase(null);
          setSelectedSupplier(null);
          setActiveNav(nav);
        }}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onOpenStorePreview={() => setActiveNav('online-store')}
        orderCounts={{
          all: orders.length,
          pending: orders.filter((o) => o.status === 'Pending').length,
          followUp: orders.filter((o) => o.status === 'Follow Up').length,
          approved: orders.filter((o) => o.status === 'Approved').length,
          processing: orders.filter((o) => o.status === 'Processing').length,
        }}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSupport={() => setIsSupportOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenStorePreview={() => setActiveNav('online-store')}
          onNavigateSettings={() => setActiveNav('settings')}
        />

        {/* Dynamic Views */}
        <main className="flex-1 bg-[#F2F2F2] rounded-tl-[36px] md:rounded-tl-[40px] overflow-hidden min-h-[calc(100vh-4.5rem)] pb-16">
          {selectedOrder ? (
            <OrderDetailPage
              order={selectedOrder}
              products={products}
              onBack={() => setSelectedOrder(null)}
              onUpdateStatus={handleUpdateOrderStatus}
              onDeleteOrder={(id) => {
                handleDeleteOrder(id);
                setSelectedOrder(null);
              }}
            />
          ) : selectedPurchase ? (
            <PurchaseDetailPage
              purchase={selectedPurchase}
              onBack={() => setSelectedPurchase(null)}
              onDeletePurchase={(id) => {
                setPurchases((prev) => prev.filter((p) => p.id !== id));
                setSelectedPurchase(null);
                showToast('Purchase deleted');
              }}
              onUpdatePurchase={(updated) => {
                setPurchases((prev) =>
                  prev.map((p) => (p.id === updated.id ? updated : p))
                );
                setSelectedPurchase(updated);
                showToast(`Purchase ${updated.invoiceNo} updated`);
              }}
            />
          ) : selectedSupplier ? (
            <SupplierDetailPage
              supplier={selectedSupplier}
              onBack={() => setSelectedSupplier(null)}
              onAdvancePayment={() => showToast('Advance Payment recorded')}
            />
          ) : (
            <>
              {activeNav === 'orders' && (
            <OrdersView
              orders={displayedOrders}
              onOpenCreateOrder={() => setActiveNav('create-order')}
              onSelectOrder={(ord) => setSelectedOrder(ord)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onDeleteOrder={handleDeleteOrder}
              onBulkDelete={handleBulkDelete}
              onBulkStatusUpdate={handleBulkStatusUpdate}
              filterBranch={filterBranch}
              setFilterBranch={setFilterBranch}
              filterPaymentStatus={filterPaymentStatus}
              setFilterPaymentStatus={setFilterPaymentStatus}
              filterMinAmount={filterMinAmount}
              setFilterMinAmount={setFilterMinAmount}
              filterMaxAmount={filterMaxAmount}
              setFilterMaxAmount={setFilterMaxAmount}
              onResetFilters={handleResetFilters}
            />
          )}

          {activeNav === 'create-order' && (
            <CreateOrderPage
              products={products}
              customers={customers}
              lastOrderNumber={orders[0]?.orderNumber || '#21547'}
              onCancel={() => setActiveNav('orders')}
              onCreateOrder={(newOrder) => {
                handleCreateOrder(newOrder);
                setActiveNav('orders');
              }}
              onSaveDraft={(draft) => {
                setDraftOrders([draft, ...draftOrders]);
                setActiveNav('orders');
                showToast(`Draft ${draft.orderNumber} saved successfully`);
              }}
            />
          )}

          {activeNav === 'order-return' && (
            <OrderReturnsView
              returns={returns}
              onApproveReturn={handleApproveReturn}
              onRejectReturn={handleRejectReturn}
              onProcessRefund={handleProcessRefund}
              onBackToOrders={() => setActiveNav('orders')}
            />
          )}

          {activeNav === 'incomplete-orders' && (
            <IncompleteOrdersView
              incompleteOrders={incompleteOrders}
              onSendRecovery={handleSendRecovery}
              onBackToOrders={() => setActiveNav('orders')}
            />
          )}

          {activeNav === 'draft-orders' && (
            <DraftOrdersView
              draftOrders={draftOrders}
              onConvertDraftToLive={handleConvertDraftToLive}
              onDeleteDraft={handleDeleteDraft}
              onBackToOrders={() => setActiveNav('orders')}
            />
          )}

          {activeNav === 'dashboard' && (
            <DashboardView
              orders={orders}
              products={products}
              onOpenCreateOrder={() => setActiveNav('create-order')}
              onNavigateToOrders={() => setActiveNav('orders')}
              onSelectOrder={(ord) => setSelectedOrder(ord)}
              onOpenStorePreview={() => setActiveNav('online-store')}
            />
          )}

          {activeNav === 'products' && (
            <ProductsView
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateStock={handleUpdateStock}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeNav === 'purchases' && (
            <PurchasesView
              purchases={purchases}
              onOpenCreatePurchase={() => setActiveNav('create-purchase')}
              onSelectPurchase={(pur) => setSelectedPurchase(pur)}
              onDeletePurchase={(id) => {
                setPurchases((prev) => prev.filter((p) => p.id !== id));
                showToast('Purchase deleted');
              }}
            />
          )}

          {activeNav === 'create-purchase' && (
            <CreatePurchasePage
              products={products}
              onCancel={() => setActiveNav('purchases')}
              onSavePurchase={(newPur) => {
                setPurchases([newPur, ...purchases]);
                setActiveNav('purchases');
                showToast(`Purchase ${newPur.invoiceNo} created successfully`);
              }}
              lastInvoiceNumber={purchases[0]?.invoiceNo || '#137180'}
            />
          )}

          {activeNav === 'purchase-returns' && (
            <PurchasesReturnView
              returns={purchaseReturns}
              onSelectSupplier={(name) => {
                const found =
                  suppliersList.find(
                    (s) =>
                      s.name.toLowerCase().includes(name.toLowerCase()) ||
                      (s.companyName &&
                        s.companyName.toLowerCase().includes(name.toLowerCase()))
                  ) || suppliersList[0];
                setSelectedSupplier(found);
              }}
            />
          )}

          {activeNav === 'suppliers' && (
            <SuppliersView
              suppliers={suppliersList}
              onOpenCreateSupplier={() => setIsCreateSupplierOpen(true)}
              onSelectSupplier={(s) => setSelectedSupplier(s)}
              onDeleteSupplier={(id) => {
                setSuppliersList((prev) => prev.filter((s) => s.id !== id));
                showToast('Supplier deleted');
              }}
            />
          )}

          {activeNav === 'customers' && (
            selectedCustomer ? (
              <CustomerDetailPage
                customer={selectedCustomer}
                onBack={() => setSelectedCustomer(null)}
              />
            ) : (
              <CustomersView
                customers={customers}
                onOpenCreateCustomer={() => setIsCreateCustomerOpen(true)}
                onSelectCustomer={(c) => setSelectedCustomer(c)}
                onDeleteCustomer={(id) => {
                  setCustomers((prev) => prev.filter((c) => c.id !== id));
                  showToast('Customer deleted');
                }}
              />
            )
          )}

          {activeNav === 'customer-tags' && (
            <CustomerTagsView
              tags={customerTags}
              onOpenCreateTag={() => {
                setEditingTag(null);
                setIsCreateCustomerTagOpen(true);
              }}
              onDeleteTag={(id) => {
                setCustomerTags((prev) => prev.filter((t) => t.id !== id));
                showToast('Tag deleted');
              }}
              onEditTag={(tag) => {
                setEditingTag(tag);
                setIsCreateCustomerTagOpen(true);
              }}
            />
          )}

          {activeNav === 'my-tasks' && <TasksView />}

          {activeNav === 'accounts' && <FinanceView orders={orders} />}

          {activeNav === 'reports' && (
            <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports</h1>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-xl border border-slate-200/90 shadow-2xs cursor-pointer">
                    <span>Filter Date</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-xl border border-slate-200/90 shadow-2xs cursor-pointer">
                    <span>More Actions</span>
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-2xl shadow-sm shadow-[#8075FF]/25 cursor-pointer hover:shadow-md transition-all active:scale-98">
                    <span>Export Analytics</span>
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm font-bold text-slate-900 border-b-2 border-purple-600 pb-1">
                    Sales Overview & Tax Audit
                  </div>
                </div>
                <div className="p-8 text-center text-xs text-slate-400">
                  Exportable sales performance, sales by branch, customer lifetime value, and tax audit reports.
                </div>
              </div>
            </div>
          )}

          {activeNav === 'settings' && <SettingsView />}
            </>
          )}
        </main>
      </div>

      {/* Modals & Slide-overs */}
      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        products={products}
        onCreateOrder={handleCreateOrder}
        lastOrderNumber={orders[0]?.orderNumber || '#21547'}
      />

      <CreateSupplierModal
        isOpen={isCreateSupplierOpen}
        onClose={() => setIsCreateSupplierOpen(false)}
        onCreateSupplier={(newSup) => {
          setSuppliersList([newSup, ...suppliersList]);
          showToast(`Supplier ${newSup.name} created successfully`);
        }}
      />



      <CreateCustomerModal
        isOpen={isCreateCustomerOpen}
        onClose={() => setIsCreateCustomerOpen(false)}
        onCreateCustomer={(newCust) => {
          setCustomers([newCust, ...customers]);
          showToast(`Customer ${newCust.name} created successfully`);
        }}
      />

      <CreateCustomerTagModal
        isOpen={isCreateCustomerTagOpen}
        onClose={() => { setIsCreateCustomerTagOpen(false); setEditingTag(null); }}
        onCreateTag={(tag) => {
          if (editingTag) {
            setCustomerTags((prev) => prev.map((t) => t.id === tag.id ? tag : t));
            showToast('Tag updated successfully');
          } else {
            setCustomerTags((prev) => [tag, ...prev]);
            showToast('Tag created successfully');
          }
          setEditingTag(null);
        }}
        editingTag={editingTag}
      />

      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onDismiss={(id) =>
          setNotifications((prev) => prev.filter((n) => n.id !== id))
        }
      />

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700/80 animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
