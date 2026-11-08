import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingCart,
  Send,
  CheckCircle2,
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  Download,
  Printer,
  Search,
  ArrowUpDown,
} from 'lucide-react';
import { IncompleteOrder } from '../../types';
import { formatCurrency } from '../../utils/orderUtils';

interface IncompleteOrdersViewProps {
  incompleteOrders: IncompleteOrder[];
  onSendRecovery: (id: string) => void;
  onBackToOrders: () => void;
}

export const IncompleteOrdersView: React.FC<IncompleteOrdersViewProps> = ({
  incompleteOrders,
  onSendRecovery,
  onBackToOrders,
}) => {
  const [search, setSearch] = useState('');
  const [recoveryFilter, setRecoveryFilter] = useState('All');
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);

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

  const tabs = ['All', 'Awaiting Recovery', 'Recovery Sent'];

  const filtered = incompleteOrders
    .filter((item) => {
      const matchSearch =
        item.customerName.toLowerCase().includes(search.toLowerCase()) ||
        item.phone.includes(search);
      const matchFilter =
        recoveryFilter === 'All' ||
        (recoveryFilter === 'Recovery Sent' && item.recoverySent) ||
        (recoveryFilter === 'Awaiting Recovery' && !item.recoverySent);
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      return sortAsc ? a.cartTotal - b.cartTotal : b.cartTotal - a.cartTotal;
    });

  const exportIncompleteToCSV = () => {
    const headers = ['Customer Name', 'Phone', 'Cart Items', 'Cart Total', 'Abandoned At', 'Recovery Sent'];
    const rows = filtered.map((item) => [
      `"${item.customerName}"`,
      `"${item.phone}"`,
      item.cartItemsCount,
      item.cartTotal,
      `"${item.abandonedAt}"`,
      item.recoverySent ? 'Yes' : 'No',
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `abandoned_carts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMoreActionsOpen(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2]">
      {/* Top Header Row (Matches Orders style: Title on left, Filter + More Actions + Back to Orders on right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Incomplete Orders</h1>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium rounded-xl border transition-all cursor-pointer shadow-2xs ${
                filterDropdownOpen || recoveryFilter !== 'All'
                  ? 'border-purple-300 ring-2 ring-purple-100 text-purple-700 font-semibold'
                  : 'border-slate-200/90'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              <span>Filter</span>
              {recoveryFilter !== 'All' && (
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
                    <span className="text-sm font-bold text-slate-900">Recovery Status</span>
                  </div>
                  {recoveryFilter !== 'All' && (
                    <button
                      onClick={() => setRecoveryFilter('All')}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setRecoveryFilter(tab)}
                      className={`w-full py-2 px-3 rounded-lg text-left font-medium transition-colors cursor-pointer ${
                        recoveryFilter === tab
                          ? 'bg-purple-50 text-purple-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tab}
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
                  onClick={exportIncompleteToCSV}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Export to CSV ({filtered.length})</span>
                </button>
                <button
                  onClick={() => {
                    window.print();
                    setMoreActionsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print Recovery List</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onBackToOrders}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-2xl shadow-sm shadow-[#8075FF]/25 transition-all cursor-pointer hover:shadow-md active:scale-98"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </button>
        </div>
      </div>

      {/* Main Table Card (matches Orders table card container) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Sub-tabs & Search Toolbar Row */}
        <div className="px-6 pt-5 pb-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 gap-4">
          {/* Left Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-sm select-none">
            {tabs.map((tab) => {
              const count =
                tab === 'All'
                  ? incompleteOrders.length
                  : tab === 'Recovery Sent'
                  ? incompleteOrders.filter((i) => i.recoverySent).length
                  : incompleteOrders.filter((i) => !i.recoverySent).length;
              const isActive = recoveryFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setRecoveryFilter(tab)}
                  className={`pb-1 whitespace-nowrap text-sm transition-all cursor-pointer relative ${
                    isActive
                      ? 'font-bold text-slate-900 border-b-2 border-purple-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab} ({count})
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
                placeholder="Search by customer or phone..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white w-48 sm:w-60 transition-all"
              />
            </div>

            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors cursor-pointer"
              title={`Sort by total ${sortAsc ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-semibold">
                <th className="py-3 px-5">Customer Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Cart Items</th>
                <th className="py-3 px-4">Cart Total</th>
                <th className="py-3 px-4">Abandoned At</th>
                <th className="py-3 pr-5 text-right">Recovery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No abandoned orders found matching current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      idx % 2 === 1 ? 'bg-[#f8f9fe] hover:bg-[#edf0fd]/80' : 'bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-5 font-bold text-slate-800">{item.customerName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.phone}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.cartItemsCount} items</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatCurrency(item.cartTotal)} BDT
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{item.abandonedAt}</td>
                    <td className="py-3.5 pr-5 text-right">
                      {item.recoverySent ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Recovery SMS Sent</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onSendRecovery(item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Recovery Link</span>
                        </button>
                      )}
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
