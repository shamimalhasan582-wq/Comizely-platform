import React, { useState, useRef, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Store,
  DollarSign,
  Users,
  SlidersHorizontal,
  ChevronDown,
  Download,
  Printer,
  Search,
  ArrowUpDown,
} from 'lucide-react';
import { Order, Product } from '../../types';
import { formatCurrency, getStatusBadgeClasses } from '../../utils/orderUtils';

interface DashboardViewProps {
  orders: Order[];
  products: Product[];
  onOpenCreateOrder: () => void;
  onNavigateToOrders: () => void;
  onSelectOrder: (order: Order) => void;
  onOpenStorePreview: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  products,
  onOpenCreateOrder,
  onNavigateToOrders,
  onSelectOrder,
  onOpenStorePreview,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Completed' | 'Pending' | 'Processing'>('All');
  const [dateRange, setDateRange] = useState('This Month');
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);

  const moreActionsRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreActionsRef.current && !moreActionsRef.current.contains(e.target as Node)) {
        setMoreActionsOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const completedCount = orders.filter((o) => o.status === 'Completed').length;
  const processingCount = orders.filter((o) => o.status === 'Processing').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Branch breakdown
  const branchSales: Record<string, number> = {};
  orders.forEach((o) => {
    branchSales[o.branch] = (branchSales[o.branch] || 0) + o.totalAmount;
  });

  const filteredOrders = orders
    .filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        o.branch.toLowerCase().includes(search.toLowerCase());
      const matchTab = activeTab === 'All' || o.status === activeTab;
      return matchSearch && matchTab;
    })
    .sort((a, b) => {
      return sortAsc ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
    });

  const exportSummaryCSV = () => {
    const headers = ['Order Number', 'Customer', 'Branch', 'Total Amount', 'Status', 'Date'];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      `"${o.customer.name}"`,
      `"${o.branch}"`,
      o.totalAmount,
      o.status,
      `"${o.createdAt}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dashboard_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMoreActionsOpen(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2]">
      {/* Top Header Row (Matches Orders style: Title on left, Filter + More Actions + Create Order on right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium rounded-xl border transition-all cursor-pointer shadow-2xs ${
                filterDropdownOpen || dateRange !== 'This Month'
                  ? 'border-purple-300 ring-2 ring-purple-100 text-purple-700 font-semibold'
                  : 'border-slate-200/90'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {filterDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-40 animate-in fade-in zoom-in-95 duration-100 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span className="font-bold text-slate-900">Select Period</span>
                </div>

                <div className="space-y-1">
                  {['Today', 'Yesterday', 'Last 7 Days', 'This Month', 'All Time'].map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => {
                        setDateRange(period);
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full py-2 px-3 rounded-lg text-left font-medium transition-colors cursor-pointer ${
                        dateRange === period
                          ? 'bg-purple-50 text-purple-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* More Actions Dropdown */}
          <div className="relative" ref={moreActionsRef}>
            <button
              onClick={() => setMoreActionsOpen(!moreActionsOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium rounded-xl border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
            >
              <span>More Actions</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {moreActionsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    onOpenStorePreview();
                    setMoreActionsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Store className="w-4 h-4 text-purple-600" />
                  <span>Visit Online Storefront</span>
                </button>
                <button
                  onClick={exportSummaryCSV}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Export Overview CSV</span>
                </button>
                <button
                  onClick={() => {
                    window.print();
                    setMoreActionsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print Dashboard Report</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenCreateOrder}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-2xl shadow-sm shadow-[#8075FF]/25 transition-all cursor-pointer hover:shadow-md active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Gross Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">
              {formatCurrency(totalRevenue)}{' '}
              <span className="text-xs font-normal text-slate-400">BDT</span>
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span>+18.4%</span>
              <span className="text-slate-400 font-normal">from last month</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">{orders.length}</h3>
            <p className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
              <span>{completedCount} Completed</span>
              <span className="text-slate-400 font-normal">• All channels</span>
            </p>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg Order Value</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">
              {formatCurrency(avgOrderValue)}{' '}
              <span className="text-xs font-normal text-slate-400">BDT</span>
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Healthy margin benchmark
            </p>
          </div>
        </div>

        {/* Pending Fulfillment */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Actions</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">{pendingCount}</h3>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">
              Requires dispatch verification
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row: Branch Distribution & Quick Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch Sales Performance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Revenue by Branch</h3>
          <div className="space-y-3">
            {Object.entries(branchSales).map(([branch, amount]) => {
              const pct = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
              return (
                <div key={branch} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{branch}</span>
                    <span className="text-slate-500">
                      {formatCurrency(amount)} BDT ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products Inventory Status */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Featured Inventory</h3>
            <span className="text-xs text-purple-600 font-medium">
              {products.length} Products Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-3 border border-slate-100 rounded-xl flex items-center gap-3 bg-slate-50/40"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-12 h-12 rounded-lg object-cover bg-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {formatCurrency(p.price)} BDT • Stock: {p.stock}
                  </p>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.2 rounded mt-1 ${
                      p.stock > 10
                        ? 'bg-emerald-50 text-emerald-700'
                        : p.stock > 0
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table Card (matches Orders table card container) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Sub-tabs & Search Toolbar Row */}
        <div className="px-6 pt-5 pb-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 gap-4">
          {/* Left Status Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-sm select-none">
            <button
              onClick={() => setActiveTab('All')}
              className={`pb-1 whitespace-nowrap text-sm transition-all cursor-pointer relative ${
                activeTab === 'All'
                  ? 'font-bold text-slate-900 border-b-2 border-purple-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Recent ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('Completed')}
              className={`pb-1 whitespace-nowrap text-sm transition-all cursor-pointer relative ${
                activeTab === 'Completed'
                  ? 'font-bold text-slate-900 border-b-2 border-purple-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setActiveTab('Pending')}
              className={`pb-1 whitespace-nowrap text-sm transition-all cursor-pointer relative ${
                activeTab === 'Pending'
                  ? 'font-bold text-slate-900 border-b-2 border-purple-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('Processing')}
              className={`pb-1 whitespace-nowrap text-sm transition-all cursor-pointer relative ${
                activeTab === 'Processing'
                  ? 'font-bold text-slate-900 border-b-2 border-purple-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Processing ({processingCount})
            </button>
          </div>

          {/* Right Toolbar: Search input, Sort, View All link */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white w-44 sm:w-56 transition-all"
              />
            </div>

            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors cursor-pointer"
              title={`Sort by total ${sortAsc ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToOrders}
              className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 cursor-pointer pl-1 whitespace-nowrap"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-5">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.slice(0, 6).map((order) => {
                const badge = getStatusBadgeClasses(order.status);
                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-5 font-bold text-slate-800">{order.orderNumber}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{order.customer.name}</td>
                    <td className="py-3 px-4 text-slate-500">{order.branch}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {formatCurrency(order.totalAmount)} BDT
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {order.createdAt}
                    </td>
                    <td className="py-3 pr-5 text-right">
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="text-purple-600 hover:text-purple-800 font-semibold cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
