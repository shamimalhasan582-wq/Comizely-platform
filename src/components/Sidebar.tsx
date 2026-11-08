import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  ShoppingCart,
  Users,
  CheckSquare,
  Landmark,
  BarChart3,
  Store,
  Settings,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
} from 'lucide-react';
import { ActiveNav } from '../types';

interface SidebarProps {
  activeNav: ActiveNav;
  setActiveNav: (nav: ActiveNav) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onOpenStorePreview: () => void;
  orderCounts: {
    all: number;
    pending: number;
    followUp: number;
    approved: number;
    processing: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  setActiveNav,
  collapsed,
  setCollapsed,
  onOpenStorePreview,
}) => {
  const [ordersExpanded, setOrdersExpanded] = useState(true);
  const [purchasesExpanded, setPurchasesExpanded] = useState(true);
  const [customersExpanded, setCustomersExpanded] = useState(true);

  const isOrderSubItem =
    activeNav === 'orders' ||
    activeNav === 'create-order' ||
    activeNav === 'order-return' ||
    activeNav === 'incomplete-orders' ||
    activeNav === 'draft-orders';

  const isPurchaseSubItem =
    activeNav === 'purchases' ||
    activeNav === 'create-purchase' ||
    activeNav === 'purchase-returns' ||
    activeNav === 'suppliers';

  const isCustomerSubItem =
    activeNav === 'customers' ||
    activeNav === 'customer-tags';

  return (
    <aside
      className={`relative bg-white flex flex-col justify-between transition-all duration-300 ease-in-out select-none z-20 ${
        collapsed ? 'w-20' : 'w-64'
      } h-screen sticky top-0`}
    >
      {/* Top Header / Brand */}
      <div>
        <div className="h-18 px-5 flex items-center justify-between">
          <div
            onClick={() => setActiveNav('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Comizely Logo Ribbon / Folded Icon */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-500 flex items-center justify-center shadow-md shadow-purple-500/20 text-white font-bold text-xl group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
              >
                <path
                  d="M4 14.5L12 3L20 14.5L12 21L4 14.5Z"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 3V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />
              </svg>
            </div>
            {!collapsed && (
              <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-purple-600 transition-colors">
                Comizely
              </span>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)] scrollbar-thin">
          {/* Dashboard */}
          <div>
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                activeNav === 'dashboard'
                  ? 'bg-purple-50 text-purple-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 ${activeNav === 'dashboard' ? 'text-purple-600' : 'text-slate-400'}`} />
              {!collapsed && <span>Dashboard</span>}
            </button>
          </div>

          {/* Group: Management */}
          <div>
            {!collapsed && (
              <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 tracking-wider">
                Management
              </div>
            )}

            <div className="space-y-1">
              {/* Orders Parent */}
              <div>
                <button
                  onClick={() => {
                    if (collapsed) {
                      setCollapsed(false);
                      setActiveNav('orders');
                      setOrdersExpanded(true);
                    } else {
                      setOrdersExpanded(!ordersExpanded);
                      if (!isOrderSubItem) setActiveNav('orders');
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                    isOrderSubItem
                      ? 'bg-purple-50/80 text-purple-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FolderKanban
                      className={`w-5 h-5 ${isOrderSubItem ? 'text-purple-600' : 'text-slate-400'}`}
                    />
                    {!collapsed && <span>Orders</span>}
                  </div>
                  {!collapsed && (
                    <div className="text-slate-400">
                      {ordersExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  )}
                </button>

                {/* Orders Nested Tree (matches screenshot connected dots) */}
                {!collapsed && ordersExpanded && (
                  <div className="ml-5 pl-3 border-l-2 border-slate-100 my-1 space-y-1 relative">
                    {/* All Orders */}
                    <button
                      onClick={() => setActiveNav('orders')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left relative ${
                        activeNav === 'orders'
                          ? 'text-purple-700 font-bold bg-purple-50/50'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-transform ${
                          activeNav === 'orders' ? 'bg-purple-600 scale-125' : 'bg-slate-300'
                        }`}
                      />
                      <span>All Orders</span>
                    </button>

                    {/* Order Return */}
                    <button
                      onClick={() => setActiveNav('order-return')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left relative ${
                        activeNav === 'order-return'
                          ? 'text-purple-700 font-bold bg-purple-50/50'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-transform ${
                          activeNav === 'order-return' ? 'bg-purple-600 scale-125' : 'bg-slate-300'
                        }`}
                      />
                      <span>Order Return</span>
                    </button>

                    {/* Incomplete Orders */}
                    <button
                      onClick={() => setActiveNav('incomplete-orders')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left relative ${
                        activeNav === 'incomplete-orders'
                          ? 'text-purple-700 font-bold bg-purple-50/50'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-transform ${
                          activeNav === 'incomplete-orders' ? 'bg-purple-600 scale-125' : 'bg-slate-300'
                        }`}
                      />
                      <span>Incomplete Orders</span>
                    </button>

                    {/* Draft Orders */}
                    <button
                      onClick={() => setActiveNav('draft-orders')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left relative ${
                        activeNav === 'draft-orders'
                          ? 'text-purple-700 font-bold bg-purple-50/50'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-transform ${
                          activeNav === 'draft-orders' ? 'bg-purple-600 scale-125' : 'bg-slate-300'
                        }`}
                      />
                      <span>Draft Orders</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Products */}
              <button
                onClick={() => setActiveNav('products')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  activeNav === 'products'
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className={`w-5 h-5 ${activeNav === 'products' ? 'text-purple-600' : 'text-slate-400'}`} />
                  {!collapsed && <span>Products</span>}
                </div>
                {!collapsed && <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>

              {/* Purchases Expandable Group */}
              <div>
                <button
                  onClick={() => {
                    if (!isPurchaseSubItem) {
                      setActiveNav('purchases');
                      setPurchasesExpanded(true);
                    } else {
                      setPurchasesExpanded(!purchasesExpanded);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                    isPurchaseSubItem
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart
                      className={`w-5 h-5 ${
                        isPurchaseSubItem ? 'text-purple-600' : 'text-slate-400'
                      }`}
                    />
                    {!collapsed && <span>Purchases</span>}
                  </div>
                  {!collapsed && (
                    <div className="text-slate-400">
                      {purchasesExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </button>

                {/* Purchases Nested Tree (matches screenshot connected dots) */}
                {!collapsed && purchasesExpanded && (
                  <div className="ml-5 pl-3 border-l-2 border-slate-100 my-1 space-y-1 relative">
                    {/* Purchases */}
                    <button
                      onClick={() => setActiveNav('purchases')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left relative ${
                        activeNav === 'purchases' || activeNav === 'create-purchase'
                          ? 'text-purple-700 font-bold bg-purple-50/50'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-transform ${
                          activeNav === 'purchases' || activeNav === 'create-purchase'
                            ? 'bg-purple-600 scale-125'
                            : 'bg-slate-300'
                        }`}
                      />
                      <span>Purchases</span>
                    </button>

                    {/* Purchase Returns */}
                    <button
                      onClick={() => setActiveNav('purchase-returns')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left relative ${
                        activeNav === 'purchase-returns'
                          ? 'text-purple-700 font-bold bg-purple-50/50'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-transform ${
                          activeNav === 'purchase-returns'
                            ? 'bg-purple-600 scale-125'
                            : 'bg-slate-300'
                        }`}
                      />
                      <span>Purchase Returns</span>
                    </button>

                    {/* Suppliers */}
                    <button
                      onClick={() => setActiveNav('suppliers')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left relative ${
                        activeNav === 'suppliers'
                          ? 'text-purple-700 font-bold bg-purple-50/50'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-transform ${
                          activeNav === 'suppliers'
                            ? 'bg-purple-600 scale-125'
                            : 'bg-slate-300'
                        }`}
                      />
                      <span>Suppliers</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Customers Expandable Group */}
              <div>
                <button
                  onClick={() => {
                    if (!isCustomerSubItem) {
                      setActiveNav('customers');
                      setCustomersExpanded(true);
                    } else {
                      setCustomersExpanded(!customersExpanded);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                    isCustomerSubItem
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className={`w-5 h-5 ${isCustomerSubItem ? 'text-purple-600' : 'text-slate-400'}`} />
                    {!collapsed && <span>Customers</span>}
                  </div>
                  {!collapsed && (
                    <div className="text-slate-400">
                      {customersExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </button>

                {/* Customers Nested Tree */}
                {!collapsed && customersExpanded && (
                  <div className="ml-5 pl-3 border-l-2 border-slate-100 my-1 space-y-1 relative">
                    {/* All Customers */}
                    <button
                      onClick={() => setActiveNav('customers')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left relative ${
                        activeNav === 'customers'
                          ? 'text-purple-700 font-bold bg-purple-50/50'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-transform ${
                          activeNav === 'customers' ? 'bg-purple-600 scale-125' : 'bg-slate-300'
                        }`}
                      />
                      <span>All Customers</span>
                    </button>

                    {/* Customer Tags */}
                    <button
                      onClick={() => setActiveNav('customer-tags')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left relative ${
                        activeNav === 'customer-tags'
                          ? 'text-purple-700 font-bold bg-purple-50/50'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-transform ${
                          activeNav === 'customer-tags' ? 'bg-purple-600 scale-125' : 'bg-slate-300'
                        }`}
                      />
                      <span>Customer Tags</span>
                    </button>
                  </div>
                )}
              </div>

              {/* My Tasks */}
              <button
                onClick={() => setActiveNav('my-tasks')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  activeNav === 'my-tasks'
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckSquare className={`w-5 h-5 ${activeNav === 'my-tasks' ? 'text-purple-600' : 'text-slate-400'}`} />
                  {!collapsed && <span>My Tasks</span>}
                </div>
                {!collapsed && <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Group: Finance */}
          <div>
            {!collapsed && (
              <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 tracking-wider">
                Finance
              </div>
            )}
            <div className="space-y-1">
              <button
                onClick={() => setActiveNav('accounts')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  activeNav === 'accounts'
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Landmark className={`w-5 h-5 ${activeNav === 'accounts' ? 'text-purple-600' : 'text-slate-400'}`} />
                  {!collapsed && <span>Accounts</span>}
                </div>
                {!collapsed && <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>

              <button
                onClick={() => setActiveNav('reports')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  activeNav === 'reports'
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className={`w-5 h-5 ${activeNav === 'reports' ? 'text-purple-600' : 'text-slate-400'}`} />
                  {!collapsed && <span>Reports</span>}
                </div>
                {!collapsed && <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Group: Others */}
          <div>
            {!collapsed && (
              <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 tracking-wider">
                Others
              </div>
            )}
            <div className="space-y-1">
              <button
                onClick={() => setActiveNav('online-store')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  activeNav === 'online-store'
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Store className={`w-5 h-5 ${activeNav === 'online-store' ? 'text-purple-600' : 'text-slate-400'}`} />
                  {!collapsed && <span>Online Store</span>}
                </div>
                {!collapsed && <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>

              <button
                onClick={() => setActiveNav('settings')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  activeNav === 'settings'
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className={`w-5 h-5 ${activeNav === 'settings' ? 'text-purple-600' : 'text-slate-400'}`} />
                  {!collapsed && <span>Setting</span>}
                </div>
                {!collapsed && <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Store Switcher / Badge: Biponil.com (exact match from screenshot) */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={onOpenStorePreview}
          title="Visit Online Store (Biponil.com)"
          className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-purple-50/70 to-indigo-50/70 hover:from-purple-100/80 hover:to-indigo-100/80 border border-purple-100/60 transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Orange gradient icon badge as in screenshot */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
              <span className="font-extrabold text-[13px]">B</span>
            </div>
            {!collapsed && (
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-purple-700 transition-colors">
                  Biponil.com
                </p>
                <p className="text-[10px] text-slate-400 truncate">Live Storefront</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          )}
        </button>
      </div>
    </aside>
  );
};
