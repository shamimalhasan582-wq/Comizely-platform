import React, { useState } from 'react';
import {
  Home,
  ListChecks,
  Box,
  ShoppingCart,
  User,
  ClipboardList,
  Landmark,
  FileBarChart2,
  Store,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { ActiveNav } from '../types';

interface SidebarProps {
  activeNav: ActiveNav;
  setActiveNav: (nav: ActiveNav) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onOpenStorePreview?: () => void;
  orderCounts?: {
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
}) => {
  const [ordersExpanded, setOrdersExpanded] = useState(true);
  const [purchasesExpanded, setPurchasesExpanded] = useState(false);
  const [customersExpanded, setCustomersExpanded] = useState(false);

  const isOrderActive =
    activeNav === 'orders' ||
    activeNav === 'create-order' ||
    activeNav === 'order-return' ||
    activeNav === 'incomplete-orders' ||
    activeNav === 'draft-orders';

  const isPurchaseActive =
    activeNav === 'purchases' ||
    activeNav === 'create-purchase' ||
    activeNav === 'purchase-returns' ||
    activeNav === 'suppliers';

  const isCustomerActive =
    activeNav === 'customers' ||
    activeNav === 'customer-tags';

  return (
    <aside
      className={`relative bg-white flex flex-col justify-between transition-all duration-300 ease-in-out select-none z-20 ${
        collapsed ? 'w-20' : 'w-64'
      } h-screen sticky top-0`}
    >
      <div className="flex-1 flex flex-col min-h-0">
        {/* Brand Header */}
        <div className="h-18 px-5 flex items-center justify-between shrink-0">
          <div
            onClick={() => setActiveNav('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Comizely Figma Geometric Logo */}
            <div className="w-8 h-8 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 38 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
              >
                <defs>
                  <linearGradient id="comizelyLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6951F7" />
                    <stop offset="50%" stopColor="#5D3BEB" />
                    <stop offset="100%" stopColor="#4824DE" />
                  </linearGradient>
                </defs>
                <path
                  d="M11 2H28L34 8L27 15L20 8H13L4 17L11 24H18L26 16L32 22L24 30L20 34H11L1 24V17L11 2Z"
                  fill="url(#comizelyLogoGrad)"
                />
                <path
                  d="M26 15L33 22L27 28H15L10 23L16 17H24L26 15Z"
                  fill="url(#comizelyLogoGrad)"
                  fillOpacity="0.92"
                />
              </svg>
            </div>

            {!collapsed && (
              <span className="font-bold text-[21px] tracking-tight text-slate-900 group-hover:text-[#5D3BEB] transition-colors">
                Comizely
              </span>
            )}
          </div>

          {/* Sidebar Toggle Icon matching Figma */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="4" />
              <path d="M15 3v18" />
            </svg>
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 px-3 py-2 space-y-5 overflow-y-auto scrollbar-thin">
          {/* Dashboard */}
          <div>
            <button
              onClick={() => setActiveNav('dashboard')}
              title={collapsed ? 'Dashboard' : undefined}
              className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-[15px] transition-all cursor-pointer ${
                activeNav === 'dashboard'
                  ? 'bg-[#F0F1FF] text-[#6355FF] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {activeNav === 'dashboard' && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#6355FF] rounded-r-full" />
              )}
              <div className="flex items-center gap-3.5">
                <Home
                  className={`w-5 h-5 shrink-0 ${
                    activeNav === 'dashboard' ? 'text-[#6355FF]' : 'text-slate-700'
                  }`}
                  strokeWidth={1.75}
                />
                {!collapsed && <span>Dashboard</span>}
              </div>
            </button>
          </div>

          {/* Group: Management */}
          <div>
            {!collapsed && (
              <div className="px-3.5 mb-2 text-[13px] font-medium text-slate-400 select-none">
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
                      if (!isOrderActive) setActiveNav('orders');
                    }
                  }}
                  title={collapsed ? 'Orders' : undefined}
                  className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-[15px] transition-all cursor-pointer ${
                    isOrderActive
                      ? 'bg-[#F0F1FF] text-[#6355FF] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {isOrderActive && (
                    <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#6355FF] rounded-r-full" />
                  )}
                  <div className="flex items-center gap-3.5">
                    <ListChecks
                      className={`w-5 h-5 shrink-0 ${
                        isOrderActive ? 'text-[#6355FF]' : 'text-slate-700'
                      }`}
                      strokeWidth={1.8}
                    />
                    {!collapsed && <span>Orders</span>}
                  </div>
                  {!collapsed && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOrderActive ? 'text-[#6355FF]' : 'text-slate-400'
                      } ${ordersExpanded ? 'rotate-90' : ''}`}
                      strokeWidth={1.8}
                    />
                  )}
                </button>

                {/* Submenu Tree: All Orders, Order Return, Incomplete Orders, Draft Orders */}
                {!collapsed && ordersExpanded && (
                  <div className="relative pt-1 pb-1">
                    {/* Item 1: All Orders (Active in screenshot) */}
                    <div
                      onClick={() => setActiveNav('orders')}
                      className="group relative flex items-center pl-7 py-2 cursor-pointer select-none rounded-lg hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Vertical line from top connector down through node to bottom */}
                      <div className="absolute left-[33px] top-0 bottom-0 w-[1.5px] bg-slate-200" />
                      {/* Node & horizontal branch */}
                      <div className="absolute left-[33px] top-1/2 -translate-y-1/2 flex items-center z-10">
                        <span
                          className={`-translate-x-1/2 w-2 h-2 rounded-full transition-colors ${
                            activeNav === 'orders' ? 'bg-[#6355FF]' : 'bg-slate-300'
                          }`}
                        />
                        <span
                          className={`w-3.5 h-[1.5px] ${
                            activeNav === 'orders' ? 'bg-[#6355FF]' : 'bg-slate-200'
                          }`}
                        />
                      </div>
                      <span
                        className={`pl-8 text-[14px] transition-colors ${
                          activeNav === 'orders'
                            ? 'text-[#6355FF] font-medium'
                            : 'text-slate-600 group-hover:text-slate-900 font-normal'
                        }`}
                      >
                        All Orders
                      </span>
                    </div>

                    {/* Item 2: Order Return */}
                    <div
                      onClick={() => setActiveNav('order-return')}
                      className="group relative flex items-center pl-7 py-2 cursor-pointer select-none rounded-lg hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="absolute left-[33px] top-0 bottom-0 w-[1.5px] bg-slate-200" />
                      <div className="absolute left-[33px] top-1/2 -translate-y-1/2 flex items-center z-10">
                        <span
                          className={`-translate-x-1/2 w-2 h-2 rounded-full transition-colors ${
                            activeNav === 'order-return' ? 'bg-[#6355FF]' : 'bg-slate-300'
                          }`}
                        />
                        <span
                          className={`w-3.5 h-[1.5px] ${
                            activeNav === 'order-return' ? 'bg-[#6355FF]' : 'bg-slate-200'
                          }`}
                        />
                      </div>
                      <span
                        className={`pl-8 text-[14px] transition-colors ${
                          activeNav === 'order-return'
                            ? 'text-[#6355FF] font-medium'
                            : 'text-slate-600 group-hover:text-slate-900 font-normal'
                        }`}
                      >
                        Order Return
                      </span>
                    </div>

                    {/* Item 3: Incomplete Orders */}
                    <div
                      onClick={() => setActiveNav('incomplete-orders')}
                      className="group relative flex items-center pl-7 py-2 cursor-pointer select-none rounded-lg hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="absolute left-[33px] top-0 bottom-0 w-[1.5px] bg-slate-200" />
                      <div className="absolute left-[33px] top-1/2 -translate-y-1/2 flex items-center z-10">
                        <span
                          className={`-translate-x-1/2 w-2 h-2 rounded-full transition-colors ${
                            activeNav === 'incomplete-orders' ? 'bg-[#6355FF]' : 'bg-slate-300'
                          }`}
                        />
                        <span
                          className={`w-3.5 h-[1.5px] ${
                            activeNav === 'incomplete-orders' ? 'bg-[#6355FF]' : 'bg-slate-200'
                          }`}
                        />
                      </div>
                      <span
                        className={`pl-8 text-[14px] transition-colors ${
                          activeNav === 'incomplete-orders'
                            ? 'text-[#6355FF] font-medium'
                            : 'text-slate-600 group-hover:text-slate-900 font-normal'
                        }`}
                      >
                        Incomplete Orders
                      </span>
                    </div>

                    {/* Item 4: Draft Orders (Last tree item, stops at node) */}
                    <div
                      onClick={() => setActiveNav('draft-orders')}
                      className="group relative flex items-center pl-7 py-2 cursor-pointer select-none rounded-lg hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="absolute left-[33px] top-0 h-1/2 w-[1.5px] bg-slate-200" />
                      <div className="absolute left-[33px] top-1/2 -translate-y-1/2 flex items-center z-10">
                        <span
                          className={`-translate-x-1/2 w-2 h-2 rounded-full transition-colors ${
                            activeNav === 'draft-orders' ? 'bg-[#6355FF]' : 'bg-slate-300'
                          }`}
                        />
                        <span
                          className={`w-3.5 h-[1.5px] ${
                            activeNav === 'draft-orders' ? 'bg-[#6355FF]' : 'bg-slate-200'
                          }`}
                        />
                      </div>
                      <span
                        className={`pl-8 text-[14px] transition-colors ${
                          activeNav === 'draft-orders'
                            ? 'text-[#6355FF] font-medium'
                            : 'text-slate-600 group-hover:text-slate-900 font-normal'
                        }`}
                      >
                        Draft Orders
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Products */}
              <button
                onClick={() => setActiveNav('products')}
                title={collapsed ? 'Products' : undefined}
                className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-[15px] transition-all cursor-pointer ${
                  activeNav === 'products'
                    ? 'bg-[#F0F1FF] text-[#6355FF] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {activeNav === 'products' && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#6355FF] rounded-r-full" />
                )}
                <div className="flex items-center gap-3.5">
                  <Box
                    className={`w-5 h-5 shrink-0 ${
                      activeNav === 'products' ? 'text-[#6355FF]' : 'text-slate-700'
                    }`}
                    strokeWidth={1.75}
                  />
                  {!collapsed && <span>Products</span>}
                </div>
                {!collapsed && (
                  <ChevronRight
                    className={`w-4 h-4 ${
                      activeNav === 'products' ? 'text-[#6355FF]' : 'text-slate-400'
                    }`}
                    strokeWidth={1.8}
                  />
                )}
              </button>

              {/* Purchases */}
              <div>
                <button
                  onClick={() => {
                    if (collapsed) {
                      setCollapsed(false);
                      setActiveNav('purchases');
                      setPurchasesExpanded(true);
                    } else {
                      setPurchasesExpanded(!purchasesExpanded);
                      if (!isPurchaseActive) setActiveNav('purchases');
                    }
                  }}
                  title={collapsed ? 'Purchases' : undefined}
                  className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-[15px] transition-all cursor-pointer ${
                    isPurchaseActive
                      ? 'bg-[#F0F1FF] text-[#6355FF] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {isPurchaseActive && (
                    <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#6355FF] rounded-r-full" />
                  )}
                  <div className="flex items-center gap-3.5">
                    <ShoppingCart
                      className={`w-5 h-5 shrink-0 ${
                        isPurchaseActive ? 'text-[#6355FF]' : 'text-slate-700'
                      }`}
                      strokeWidth={1.75}
                    />
                    {!collapsed && <span>Purchases</span>}
                  </div>
                  {!collapsed && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isPurchaseActive ? 'text-[#6355FF]' : 'text-slate-400'
                      } ${purchasesExpanded ? 'rotate-90' : ''}`}
                      strokeWidth={1.8}
                    />
                  )}
                </button>

                {/* Purchases nested options if expanded */}
                {!collapsed && purchasesExpanded && (
                  <div className="relative pt-1 pb-1">
                    <div
                      onClick={() => setActiveNav('purchases')}
                      className="group relative flex items-center pl-7 py-2 cursor-pointer select-none rounded-lg hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="absolute left-[33px] top-0 bottom-0 w-[1.5px] bg-slate-200" />
                      <div className="absolute left-[33px] top-1/2 -translate-y-1/2 flex items-center z-10">
                        <span
                          className={`-translate-x-1/2 w-2 h-2 rounded-full transition-colors ${
                            activeNav === 'purchases' || activeNav === 'create-purchase'
                              ? 'bg-[#6355FF]'
                              : 'bg-slate-300'
                          }`}
                        />
                        <span
                          className={`w-3.5 h-[1.5px] ${
                            activeNav === 'purchases' || activeNav === 'create-purchase'
                              ? 'bg-[#6355FF]'
                              : 'bg-slate-200'
                          }`}
                        />
                      </div>
                      <span
                        className={`pl-8 text-[14px] transition-colors ${
                          activeNav === 'purchases' || activeNav === 'create-purchase'
                            ? 'text-[#6355FF] font-medium'
                            : 'text-slate-600 group-hover:text-slate-900 font-normal'
                        }`}
                      >
                        Purchases
                      </span>
                    </div>

                    <div
                      onClick={() => setActiveNav('purchase-returns')}
                      className="group relative flex items-center pl-7 py-2 cursor-pointer select-none rounded-lg hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="absolute left-[33px] top-0 bottom-0 w-[1.5px] bg-slate-200" />
                      <div className="absolute left-[33px] top-1/2 -translate-y-1/2 flex items-center z-10">
                        <span
                          className={`-translate-x-1/2 w-2 h-2 rounded-full transition-colors ${
                            activeNav === 'purchase-returns' ? 'bg-[#6355FF]' : 'bg-slate-300'
                          }`}
                        />
                        <span
                          className={`w-3.5 h-[1.5px] ${
                            activeNav === 'purchase-returns' ? 'bg-[#6355FF]' : 'bg-slate-200'
                          }`}
                        />
                      </div>
                      <span
                        className={`pl-8 text-[14px] transition-colors ${
                          activeNav === 'purchase-returns'
                            ? 'text-[#6355FF] font-medium'
                            : 'text-slate-600 group-hover:text-slate-900 font-normal'
                        }`}
                      >
                        Purchase Returns
                      </span>
                    </div>

                    <div
                      onClick={() => setActiveNav('suppliers')}
                      className="group relative flex items-center pl-7 py-2 cursor-pointer select-none rounded-lg hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="absolute left-[33px] top-0 h-1/2 w-[1.5px] bg-slate-200" />
                      <div className="absolute left-[33px] top-1/2 -translate-y-1/2 flex items-center z-10">
                        <span
                          className={`-translate-x-1/2 w-2 h-2 rounded-full transition-colors ${
                            activeNav === 'suppliers' ? 'bg-[#6355FF]' : 'bg-slate-300'
                          }`}
                        />
                        <span
                          className={`w-3.5 h-[1.5px] ${
                            activeNav === 'suppliers' ? 'bg-[#6355FF]' : 'bg-slate-200'
                          }`}
                        />
                      </div>
                      <span
                        className={`pl-8 text-[14px] transition-colors ${
                          activeNav === 'suppliers'
                            ? 'text-[#6355FF] font-medium'
                            : 'text-slate-600 group-hover:text-slate-900 font-normal'
                        }`}
                      >
                        Suppliers
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Customers */}
              <div>
                <button
                  onClick={() => {
                    if (collapsed) {
                      setCollapsed(false);
                      setActiveNav('customers');
                      setCustomersExpanded(true);
                    } else {
                      setCustomersExpanded(!customersExpanded);
                      if (!isCustomerActive) setActiveNav('customers');
                    }
                  }}
                  title={collapsed ? 'Customers' : undefined}
                  className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-[15px] transition-all cursor-pointer ${
                    isCustomerActive
                      ? 'bg-[#F0F1FF] text-[#6355FF] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {isCustomerActive && (
                    <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#6355FF] rounded-r-full" />
                  )}
                  <div className="flex items-center gap-3.5">
                    <User
                      className={`w-5 h-5 shrink-0 ${
                        isCustomerActive ? 'text-[#6355FF]' : 'text-slate-700'
                      }`}
                      strokeWidth={1.75}
                    />
                    {!collapsed && <span>Customers</span>}
                  </div>
                  {!collapsed && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isCustomerActive ? 'text-[#6355FF]' : 'text-slate-400'
                      } ${customersExpanded ? 'rotate-90' : ''}`}
                      strokeWidth={1.8}
                    />
                  )}
                </button>

                {/* Customers nested options if expanded */}
                {!collapsed && customersExpanded && (
                  <div className="relative pt-1 pb-1">
                    <div
                      onClick={() => setActiveNav('customers')}
                      className="group relative flex items-center pl-7 py-2 cursor-pointer select-none rounded-lg hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="absolute left-[33px] top-0 bottom-0 w-[1.5px] bg-slate-200" />
                      <div className="absolute left-[33px] top-1/2 -translate-y-1/2 flex items-center z-10">
                        <span
                          className={`-translate-x-1/2 w-2 h-2 rounded-full transition-colors ${
                            activeNav === 'customers' ? 'bg-[#6355FF]' : 'bg-slate-300'
                          }`}
                        />
                        <span
                          className={`w-3.5 h-[1.5px] ${
                            activeNav === 'customers' ? 'bg-[#6355FF]' : 'bg-slate-200'
                          }`}
                        />
                      </div>
                      <span
                        className={`pl-8 text-[14px] transition-colors ${
                          activeNav === 'customers'
                            ? 'text-[#6355FF] font-medium'
                            : 'text-slate-600 group-hover:text-slate-900 font-normal'
                        }`}
                      >
                        All Customers
                      </span>
                    </div>

                    <div
                      onClick={() => setActiveNav('customer-tags')}
                      className="group relative flex items-center pl-7 py-2 cursor-pointer select-none rounded-lg hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="absolute left-[33px] top-0 h-1/2 w-[1.5px] bg-slate-200" />
                      <div className="absolute left-[33px] top-1/2 -translate-y-1/2 flex items-center z-10">
                        <span
                          className={`-translate-x-1/2 w-2 h-2 rounded-full transition-colors ${
                            activeNav === 'customer-tags' ? 'bg-[#6355FF]' : 'bg-slate-300'
                          }`}
                        />
                        <span
                          className={`w-3.5 h-[1.5px] ${
                            activeNav === 'customer-tags' ? 'bg-[#6355FF]' : 'bg-slate-200'
                          }`}
                        />
                      </div>
                      <span
                        className={`pl-8 text-[14px] transition-colors ${
                          activeNav === 'customer-tags'
                            ? 'text-[#6355FF] font-medium'
                            : 'text-slate-600 group-hover:text-slate-900 font-normal'
                        }`}
                      >
                        Customer Tags
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* My Tasks */}
              <button
                onClick={() => setActiveNav('my-tasks')}
                title={collapsed ? 'My Tasks' : undefined}
                className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-[15px] transition-all cursor-pointer ${
                  activeNav === 'my-tasks'
                    ? 'bg-[#F0F1FF] text-[#6355FF] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {activeNav === 'my-tasks' && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#6355FF] rounded-r-full" />
                )}
                <div className="flex items-center gap-3.5">
                  <ClipboardList
                    className={`w-5 h-5 shrink-0 ${
                      activeNav === 'my-tasks' ? 'text-[#6355FF]' : 'text-slate-700'
                    }`}
                    strokeWidth={1.75}
                  />
                  {!collapsed && <span>My Tasks</span>}
                </div>
                {!collapsed && (
                  <ChevronRight
                    className={`w-4 h-4 ${
                      activeNav === 'my-tasks' ? 'text-[#6355FF]' : 'text-slate-400'
                    }`}
                    strokeWidth={1.8}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Group: Finance */}
          <div>
            {!collapsed && (
              <div className="px-3.5 mb-2 text-[13px] font-medium text-slate-400 select-none">
                Finance
              </div>
            )}
            <div className="space-y-1">
              <button
                onClick={() => setActiveNav('accounts')}
                title={collapsed ? 'Accounts' : undefined}
                className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-[15px] transition-all cursor-pointer ${
                  activeNav === 'accounts'
                    ? 'bg-[#F0F1FF] text-[#6355FF] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {activeNav === 'accounts' && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#6355FF] rounded-r-full" />
                )}
                <div className="flex items-center gap-3.5">
                  <Landmark
                    className={`w-5 h-5 shrink-0 ${
                      activeNav === 'accounts' ? 'text-[#6355FF]' : 'text-slate-700'
                    }`}
                    strokeWidth={1.75}
                  />
                  {!collapsed && <span>Accounts</span>}
                </div>
                {!collapsed && (
                  <ChevronRight
                    className={`w-4 h-4 ${
                      activeNav === 'accounts' ? 'text-[#6355FF]' : 'text-slate-400'
                    }`}
                    strokeWidth={1.8}
                  />
                )}
              </button>

              <button
                onClick={() => setActiveNav('reports')}
                title={collapsed ? 'Reports' : undefined}
                className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-[15px] transition-all cursor-pointer ${
                  activeNav === 'reports'
                    ? 'bg-[#F0F1FF] text-[#6355FF] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {activeNav === 'reports' && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#6355FF] rounded-r-full" />
                )}
                <div className="flex items-center gap-3.5">
                  <FileBarChart2
                    className={`w-5 h-5 shrink-0 ${
                      activeNav === 'reports' ? 'text-[#6355FF]' : 'text-slate-700'
                    }`}
                    strokeWidth={1.75}
                  />
                  {!collapsed && <span>Reports</span>}
                </div>
                {!collapsed && (
                  <ChevronRight
                    className={`w-4 h-4 ${
                      activeNav === 'reports' ? 'text-[#6355FF]' : 'text-slate-400'
                    }`}
                    strokeWidth={1.8}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Group: Others */}
          <div>
            {!collapsed && (
              <div className="px-3.5 mb-2 text-[13px] font-medium text-slate-400 select-none">
                Others
              </div>
            )}
            <div className="space-y-1">
              <button
                onClick={() => setActiveNav('online-store')}
                title={collapsed ? 'Online Store' : undefined}
                className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-[15px] transition-all cursor-pointer ${
                  activeNav === 'online-store'
                    ? 'bg-[#F0F1FF] text-[#6355FF] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {activeNav === 'online-store' && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#6355FF] rounded-r-full" />
                )}
                <div className="flex items-center gap-3.5">
                  <Store
                    className={`w-5 h-5 shrink-0 ${
                      activeNav === 'online-store' ? 'text-[#6355FF]' : 'text-slate-700'
                    }`}
                    strokeWidth={1.75}
                  />
                  {!collapsed && <span>Online Store</span>}
                </div>
                {!collapsed && (
                  <ChevronRight
                    className={`w-4 h-4 ${
                      activeNav === 'online-store' ? 'text-[#6355FF]' : 'text-slate-400'
                    }`}
                    strokeWidth={1.8}
                  />
                )}
              </button>

              <button
                onClick={() => setActiveNav('settings')}
                title={collapsed ? 'Setting' : undefined}
                className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-[15px] transition-all cursor-pointer ${
                  activeNav === 'settings'
                    ? 'bg-[#F0F1FF] text-[#6355FF] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {activeNav === 'settings' && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#6355FF] rounded-r-full" />
                )}
                <div className="flex items-center gap-3.5">
                  <Settings
                    className={`w-5 h-5 shrink-0 ${
                      activeNav === 'settings' ? 'text-[#6355FF]' : 'text-slate-700'
                    }`}
                    strokeWidth={1.75}
                  />
                  {!collapsed && <span>Setting</span>}
                </div>
                {!collapsed && (
                  <ChevronRight
                    className={`w-4 h-4 ${
                      activeNav === 'settings' ? 'text-[#6355FF]' : 'text-slate-400'
                    }`}
                    strokeWidth={1.8}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
