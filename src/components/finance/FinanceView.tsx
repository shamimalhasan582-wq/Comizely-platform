import React, { useState, useRef, useEffect } from 'react';
import {
  Landmark,
  SlidersHorizontal,
  ChevronDown,
  Download,
  Printer,
  Search,
  ArrowUpDown,
  Plus,
  CreditCard,
  Wallet,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Order } from '../../types';
import { formatCurrency, getStatusBadgeClasses } from '../../utils/orderUtils';

interface FinanceViewProps {
  orders: Order[];
}

export const FinanceView: React.FC<FinanceViewProps> = ({ orders }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
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
  const paidRevenue = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const unpaidRevenue = orders
    .filter((o) => o.paymentStatus === 'Unpaid' || o.paymentStatus === 'Partially Paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const paymentMethods = ['All', 'bKash', 'Cash on Delivery', 'Credit Card', 'Nagad'];

  const filteredOrders = orders
    .filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        o.paymentMethod.toLowerCase().includes(search.toLowerCase());
      const matchMethod = activeTab === 'All' || o.paymentMethod === activeTab;
      const matchStatus =
        paymentStatusFilter === 'All' || o.paymentStatus === paymentStatusFilter;
      return matchSearch && matchMethod && matchStatus;
    })
    .sort((a, b) => {
      return sortAsc ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
    });

  const exportFinanceCSV = () => {
    const headers = ['Order Number', 'Customer', 'Payment Method', 'Payment Status', 'Total Amount', 'Created At'];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      `"${o.customer.name}"`,
      `"${o.paymentMethod}"`,
      o.paymentStatus,
      o.totalAmount,
      `"${o.createdAt}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMoreActionsOpen(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2]">
      {/* Top Header Row (Matches Orders style: Title on left, Filter + More Actions + Add/Export on right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Accounts</h1>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium rounded-xl border transition-all cursor-pointer shadow-2xs ${
                filterDropdownOpen || paymentStatusFilter !== 'All'
                  ? 'border-purple-300 ring-2 ring-purple-100 text-purple-700 font-semibold'
                  : 'border-slate-200/90'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              <span>Filter</span>
              {paymentStatusFilter !== 'All' && (
                <span className="w-5 h-5 rounded-full bg-[#8075FF] text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
              )}
            </button>

            {filterDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-40 animate-in fade-in zoom-in-95 duration-100 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-slate-900">Payment Status</span>
                  </div>
                  {paymentStatusFilter !== 'All' && (
                    <button
                      onClick={() => setPaymentStatusFilter('All')}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {['All', 'Paid', 'Unpaid', 'Partially Paid'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setPaymentStatusFilter(st)}
                      className={`w-full py-2 px-3 rounded-lg text-left font-medium transition-colors cursor-pointer ${
                        paymentStatusFilter === st
                          ? 'bg-purple-50 text-purple-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setFilterDropdownOpen(false)}
                    className="px-4 py-1.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Apply Filter
                  </button>
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
                  onClick={exportFinanceCSV}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Export Financial Ledger</span>
                </button>
                <button
                  onClick={() => {
                    window.print();
                    setMoreActionsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print Financial Report</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={exportFinanceCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-2xl shadow-sm shadow-[#8075FF]/25 transition-all cursor-pointer hover:shadow-md active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Billed Gross</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
            {formatCurrency(totalRevenue)} <span className="text-xs font-normal text-slate-400">BDT</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Total revenue generated across all channels</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Collected & Settled</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-2">
            {formatCurrency(paidRevenue)} <span className="text-xs font-normal text-slate-400">BDT</span>
          </h3>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Directly credited to merchant account</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending COD Collection</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-2">
            {formatCurrency(unpaidRevenue)} <span className="text-xs font-normal text-slate-400">BDT</span>
          </h3>
          <p className="text-[11px] text-amber-600 font-medium mt-1">Pending courier reconciliation</p>
        </div>
      </div>

      {/* Main Table Card (matches Orders table card container) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Sub-tabs & Search Toolbar Row */}
        <div className="px-6 pt-5 pb-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 gap-4">
          {/* Left Payment Method Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-sm select-none">
            {paymentMethods.map((m) => {
              const count = m === 'All' ? orders.length : orders.filter((o) => o.paymentMethod === m).length;
              const isActive = activeTab === m;
              return (
                <button
                  key={m}
                  onClick={() => setActiveTab(m)}
                  className={`pb-1 whitespace-nowrap text-sm transition-all cursor-pointer relative ${
                    isActive
                      ? 'font-bold text-slate-900 border-b-2 border-purple-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {m} ({count})
                </button>
              );
            })}
          </div>

          {/* Right Toolbar: Search input, Sort button */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white w-48 sm:w-60 transition-all"
              />
            </div>

            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors cursor-pointer"
              title={`Sort by amount ${sortAsc ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-semibold">
                <th className="py-3 px-5">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4 text-center">Settlement Status</th>
                <th className="py-3 pr-5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No transactions found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className={`transition-colors ${
                      idx % 2 === 1 ? 'bg-[#f8f9fe] hover:bg-[#edf0fd]/80' : 'bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-5 font-bold text-slate-800">{order.orderNumber}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{order.customer.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        <CreditCard className="w-3 h-3 text-slate-400" />
                        <span>{order.paymentMethod}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{order.branch}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatCurrency(order.totalAmount)} BDT
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : order.paymentStatus === 'Partially Paid'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 pr-5 text-right text-slate-500 whitespace-nowrap">
                      {order.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
