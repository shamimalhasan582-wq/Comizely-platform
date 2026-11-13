/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
} from 'react-router-dom';
import { useApp } from './context/AppContext';
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
import {
  NotificationsDrawer,
  NotificationItem,
} from './components/notifications/NotificationsDrawer';
import { PurchasesView } from './components/purchases/PurchasesView';
import { CreatePurchasePage } from './components/purchases/CreatePurchasePage';
import { PurchaseDetailPage } from './components/purchases/PurchaseDetailPage';
import { PurchasesReturnView } from './components/purchases/PurchasesReturnView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { CreateSupplierModal } from './components/suppliers/CreateSupplierModal';
import { SupplierDetailPage } from './components/suppliers/SupplierDetailPage';
import {
  Order,
  Product,
  OrderStatus,
  Purchase,
  SupplierItem,
  Customer,
  CustomerTag,
} from './types';

/* -------------------------------------------------------------
   URL Parameter Wrappers for Detail Pages
------------------------------------------------------------- */

function OrderDetailWrapper({
  orders,
  products,
  onUpdateOrderStatus,
  onDeleteOrder,
}: {
  orders: Order[];
  products: Product[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onDeleteOrder: (id: string) => void;
}) {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const foundOrder = orders.find(
    (o) =>
      o.id === orderId ||
      o.orderNumber.replace('#', '') === orderId ||
      o.orderNumber === orderId ||
      o.orderNumber === `#${orderId}`
  );

  if (!foundOrder) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <p className="text-sm text-slate-500">
          No order matches &quot;{orderId}&quot;.
        </p>
        <button
          onClick={() => navigate('/orders')}
          className="px-4 py-2 bg-[#6355FF] text-white rounded-xl text-sm font-medium cursor-pointer"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <OrderDetailPage
      order={foundOrder}
      products={products}
      onBack={() => navigate('/orders')}
      onUpdateStatus={onUpdateOrderStatus}
      onDeleteOrder={(id) => {
        onDeleteOrder(id);
        navigate('/orders');
      }}
    />
  );
}

function PurchaseDetailWrapper({
  purchases,
  onDeletePurchase,
  onUpdatePurchase,
}: {
  purchases: Purchase[];
  onDeletePurchase: (id: string) => void;
  onUpdatePurchase: (updated: Purchase) => void;
}) {
  const { purchaseId } = useParams<{ purchaseId: string }>();
  const navigate = useNavigate();

  const found = purchases.find(
    (p) =>
      p.id === purchaseId ||
      p.invoiceNo.replace('#', '') === purchaseId ||
      p.invoiceNo === purchaseId ||
      p.invoiceNo === `#${purchaseId}`
  );

  if (!found) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Purchase Not Found</h2>
        <p className="text-sm text-slate-500">
          No purchase matches &quot;{purchaseId}&quot;.
        </p>
        <button
          onClick={() => navigate('/purchases')}
          className="px-4 py-2 bg-[#6355FF] text-white rounded-xl text-sm font-medium cursor-pointer"
        >
          Back to Purchases
        </button>
      </div>
    );
  }

  return (
    <PurchaseDetailPage
      purchase={found}
      onBack={() => navigate('/purchases')}
      onDeletePurchase={(id) => {
        onDeletePurchase(id);
        navigate('/purchases');
      }}
      onUpdatePurchase={onUpdatePurchase}
    />
  );
}

function CustomerDetailWrapper({
  customers,
}: {
  customers: Customer[];
}) {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  const found = customers.find(
    (c) =>
      c.id === customerId ||
      c.name.toLowerCase().replace(/\s+/g, '-') === customerId?.toLowerCase()
  );

  if (!found) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Customer Not Found</h2>
        <button
          onClick={() => navigate('/customers')}
          className="px-4 py-2 bg-[#6355FF] text-white rounded-xl text-sm font-medium cursor-pointer"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <CustomerDetailPage
      customer={found}
      onBack={() => navigate('/customers')}
    />
  );
}

function SupplierDetailWrapper({
  suppliers,
  onShowToast,
}: {
  suppliers: SupplierItem[];
  onShowToast: (msg: string) => void;
}) {
  const { supplierId } = useParams<{ supplierId: string }>();
  const navigate = useNavigate();

  const found = suppliers.find(
    (s) =>
      s.id === supplierId ||
      s.name.toLowerCase().replace(/\s+/g, '-') === supplierId?.toLowerCase()
  );

  if (!found) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Supplier Not Found</h2>
        <button
          onClick={() => navigate('/suppliers')}
          className="px-4 py-2 bg-[#6355FF] text-white rounded-xl text-sm font-medium cursor-pointer"
        >
          Back to Suppliers
        </button>
      </div>
    );
  }

  return (
    <SupplierDetailPage
      supplier={found}
      onBack={() => navigate('/suppliers')}
      onAdvancePayment={() => onShowToast('Advance Payment recorded')}
    />
  );
}

/* -------------------------------------------------------------
   Main App Component
------------------------------------------------------------- */

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Centralized Application State via React Context (Zero Prop-Drilling)
  const {
    orders,
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
    addProduct,
    updateProductStock,
    deleteProduct,
    customers,
    customerTags,
    createCustomer,
    deleteCustomer,
    createCustomerTag,
    updateCustomerTag,
    deleteCustomerTag,
    purchases,
    purchaseReturns,
    suppliers,
    createPurchase,
    updatePurchase,
    deletePurchase,
    createSupplier,
    deleteSupplier,
    toastMessage,
    showToast,
  } = useApp();

  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [isCreateCustomerTagOpen, setIsCreateCustomerTagOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<CustomerTag | null>(null);
  const [isCreateSupplierOpen, setIsCreateSupplierOpen] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers state
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Filters state
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('All');
  const [filterMinAmount, setFilterMinAmount] = useState('');
  const [filterMaxAmount, setFilterMaxAmount] = useState('');

  // Notification items state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'New Online Order #21547',
      description: 'Rafiqul Islam placed an order for ৳ 1,310 from Online Shop',
      time: 'Just now',
      read: false,
      type: 'order',
    },
    {
      id: 'notif-2',
      title: 'Stock Alert: Oraimo Lite 2',
      description: 'Stock dropped below threshold (4 units remaining)',
      time: '25m ago',
      read: false,
      type: 'stock',
    },
    {
      id: 'notif-3',
      title: 'Return Request #RET-901',
      description: 'Customer requested return for defective headphone',
      time: '2h ago',
      read: true,
      type: 'return',
    },
  ]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Filtered orders for table & search query
  const displayedOrders = useMemo(() => {
    return orders.filter((order) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          order.orderNumber.toLowerCase().includes(q) ||
          order.customer.name.toLowerCase().includes(q) ||
          order.customer.phone.includes(q) ||
          order.branch.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [orders, searchQuery]);

  const handleResetFilters = () => {
    setFilterBranch('All');
    setFilterPaymentStatus('All');
    setFilterMinAmount('');
    setFilterMaxAmount('');
    setSearchQuery('');
    showToast('Filters cleared');
  };

  // If viewing the standalone online-store storefront
  if (location.pathname === '/store' || location.pathname === '/online-store') {
    return (
      <OnlineStoreView
        products={products}
        onBackToAdmin={() => navigate('/orders')}
        onPlaceStorefrontOrder={(newOrder) => {
          createOrder(newOrder);
        }}
        lastOrderNumber={orders[0]?.orderNumber || '#21547'}
      />
    );
  }

  return (
    <div className="h-screen bg-white text-slate-800 flex flex-col md:flex-row antialiased selection:bg-purple-100 selection:text-purple-700 overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col min-w-0 h-screen bg-white overflow-hidden">
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSupport={() => setIsSupportOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenStorePreview={() => navigate('/store')}
          onNavigateSettings={() => navigate('/settings')}
        />

        {/* Dynamic Routed Views */}
        <main className="flex-1 bg-[#F2F2F2] rounded-tl-[36px] md:rounded-tl-[40px] overflow-y-auto overflow-x-hidden scrollbar-thin">
          <Routes>
            <Route path="/" element={<Navigate to="/orders" replace />} />
            
            <Route
              path="/dashboard"
              element={
                <DashboardView
                  orders={orders}
                  products={products}
                  onOpenCreateOrder={() => navigate('/orders/create')}
                  onNavigateToOrders={() => navigate('/orders')}
                  onSelectOrder={(ord) =>
                    navigate(`/orders/${ord.orderNumber.replace('#', '')}`)
                  }
                  onOpenStorePreview={() => navigate('/store')}
                />
              }
            />

            <Route
              path="/orders"
              element={
                <OrdersView
                  orders={displayedOrders}
                  onOpenCreateOrder={() => navigate('/orders/create')}
                  onSelectOrder={(ord) =>
                    navigate(`/orders/${ord.orderNumber.replace('#', '')}`)
                  }
                  onUpdateOrderStatus={updateOrderStatus}
                  onDeleteOrder={deleteOrder}
                  onBulkDelete={bulkDeleteOrders}
                  onBulkStatusUpdate={bulkUpdateOrderStatus}
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
              }
            />

            <Route
              path="/orders/create"
              element={
                <CreateOrderPage
                  products={products}
                  customers={customers}
                  lastOrderNumber={orders[0]?.orderNumber || '#21547'}
                  onCancel={() => navigate('/orders')}
                  onCreateOrder={(newOrder) => {
                    createOrder(newOrder);
                    navigate('/orders');
                  }}
                  onSaveDraft={(draft) => {
                    // Save draft locally or via service
                    navigate('/orders/drafts');
                    showToast(`Draft ${draft.orderNumber} saved successfully`);
                  }}
                />
              }
            />

            <Route
              path="/orders/:orderId"
              element={
                <OrderDetailWrapper
                  orders={orders}
                  products={products}
                  onUpdateOrderStatus={updateOrderStatus}
                  onDeleteOrder={deleteOrder}
                />
              }
            />

            <Route
              path="/orders/returns"
              element={
                <OrderReturnsView
                  returns={returns}
                  onApproveReturn={approveReturn}
                  onRejectReturn={rejectReturn}
                  onProcessRefund={processRefund}
                  onBackToOrders={() => navigate('/orders')}
                />
              }
            />

            <Route
              path="/orders/incomplete"
              element={
                <IncompleteOrdersView
                  incompleteOrders={incompleteOrders}
                  onSendRecovery={() => {
                    showToast('SMS & WhatsApp recovery checkout link sent to customer!');
                  }}
                  onBackToOrders={() => navigate('/orders')}
                />
              }
            />

            <Route
              path="/orders/drafts"
              element={
                <DraftOrdersView
                  draftOrders={draftOrders}
                  onConvertDraftToLive={(draft) => {
                    convertDraftToLive(draft);
                    navigate('/orders');
                  }}
                  onDeleteDraft={deleteDraft}
                  onBackToOrders={() => navigate('/orders')}
                />
              }
            />

            <Route
              path="/products"
              element={
                <ProductsView
                  products={products}
                  onAddProduct={addProduct}
                  onUpdateStock={updateProductStock}
                  onDeleteProduct={deleteProduct}
                />
              }
            />

            <Route
              path="/purchases"
              element={
                <PurchasesView
                  purchases={purchases}
                  onOpenCreatePurchase={() => navigate('/purchases/create')}
                  onSelectPurchase={(pur) =>
                    navigate(`/purchases/${pur.invoiceNo.replace('#', '')}`)
                  }
                  onDeletePurchase={deletePurchase}
                />
              }
            />

            <Route
              path="/purchases/create"
              element={
                <CreatePurchasePage
                  products={products}
                  onCancel={() => navigate('/purchases')}
                  onSavePurchase={(newPur) => {
                    createPurchase(newPur);
                    navigate('/purchases');
                  }}
                  lastInvoiceNumber={purchases[0]?.invoiceNo || '#137180'}
                />
              }
            />

            <Route
              path="/purchases/returns"
              element={
                <PurchasesReturnView
                  returns={purchaseReturns}
                  onSelectSupplier={(name) => {
                    const found =
                      suppliers.find(
                        (s) =>
                          s.name.toLowerCase().includes(name.toLowerCase()) ||
                          (s.companyName &&
                            s.companyName.toLowerCase().includes(name.toLowerCase()))
                      ) || suppliers[0];
                    if (found) {
                      navigate(`/suppliers/${found.id}`);
                    }
                  }}
                />
              }
            />

            <Route
              path="/purchases/:purchaseId"
              element={
                <PurchaseDetailWrapper
                  purchases={purchases}
                  onDeletePurchase={deletePurchase}
                  onUpdatePurchase={updatePurchase}
                />
              }
            />

            <Route
              path="/suppliers"
              element={
                <SuppliersView
                  suppliers={suppliers}
                  onOpenCreateSupplier={() => setIsCreateSupplierOpen(true)}
                  onSelectSupplier={(s) => navigate(`/suppliers/${s.id}`)}
                  onDeleteSupplier={deleteSupplier}
                />
              }
            />

            <Route
              path="/suppliers/:supplierId"
              element={
                <SupplierDetailWrapper
                  suppliers={suppliers}
                  onShowToast={showToast}
                />
              }
            />

            <Route
              path="/customers"
              element={
                <CustomersView
                  customers={customers}
                  onOpenCreateCustomer={() => setIsCreateCustomerOpen(true)}
                  onSelectCustomer={(c) => navigate(`/customers/${c.id}`)}
                  onDeleteCustomer={deleteCustomer}
                />
              }
            />

            <Route
              path="/customers/tags"
              element={
                <CustomerTagsView
                  tags={customerTags}
                  onOpenCreateTag={() => {
                    setEditingTag(null);
                    setIsCreateCustomerTagOpen(true);
                  }}
                  onDeleteTag={deleteCustomerTag}
                  onEditTag={(tag) => {
                    setEditingTag(tag);
                    setIsCreateCustomerTagOpen(true);
                  }}
                />
              }
            />

            <Route
              path="/customers/:customerId"
              element={<CustomerDetailWrapper customers={customers} />}
            />

            <Route path="/tasks" element={<TasksView />} />
            <Route path="/my-tasks" element={<Navigate to="/tasks" replace />} />

            <Route path="/accounts" element={<FinanceView orders={orders} />} />
            <Route path="/finance" element={<Navigate to="/accounts" replace />} />

            <Route
              path="/reports"
              element={
                <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Reports
                    </h1>
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
                      Exportable sales performance, sales by branch, customer lifetime
                      value, and tax audit reports.
                    </div>
                  </div>
                </div>
              }
            />

            <Route path="/settings" element={<SettingsView />} />
            <Route path="/online-store" element={<Navigate to="/store" replace />} />
            <Route path="*" element={<Navigate to="/orders" replace />} />
          </Routes>
        </main>
      </div>

      {/* Modals & Slide-overs */}
      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        products={products}
        onCreateOrder={createOrder}
        lastOrderNumber={orders[0]?.orderNumber || '#21547'}
      />

      <CreateSupplierModal
        isOpen={isCreateSupplierOpen}
        onClose={() => setIsCreateSupplierOpen(false)}
        onCreateSupplier={(newSup) => {
          createSupplier(newSup);
        }}
      />

      <CreateCustomerModal
        isOpen={isCreateCustomerOpen}
        onClose={() => setIsCreateCustomerOpen(false)}
        onCreateCustomer={(newCust) => {
          createCustomer(newCust);
        }}
      />

      <CreateCustomerTagModal
        isOpen={isCreateCustomerTagOpen}
        onClose={() => {
          setIsCreateCustomerTagOpen(false);
          setEditingTag(null);
        }}
        onCreateTag={(tag) => {
          if (editingTag) {
            updateCustomerTag(tag.id, tag);
          } else {
            createCustomerTag(tag);
          }
          setEditingTag(null);
        }}
        editingTag={editingTag}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

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

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
