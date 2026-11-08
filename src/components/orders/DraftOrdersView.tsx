import React, { useState, useRef, useEffect } from 'react';
import {
  FileEdit,
  ArrowLeft,
  ArrowUpRight,
  Trash2,
  SlidersHorizontal,
  ChevronDown,
  Download,
  Printer,
  Search,
  ArrowUpDown,
} from 'lucide-react';
import { Order } from '../../types';
import { formatCurrency } from '../../utils/orderUtils';

interface DraftOrdersViewProps {
  draftOrders: Order[];
  onConvertDraftToLive: (draft: Order) => void;
  onDeleteDraft: (id: string) => void;
  onBackToOrders: () => void;
}

export const DraftOrdersView: React.FC<DraftOrdersViewProps> = ({
  draftOrders,
  onConvertDraftToLive,
  onDeleteDraft,
  onBackToOrders,
}) => {
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
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

  const branches = ['All', ...Array.from(new Set(draftOrders.map((d) => d.branch)))];

  const filtered = draftOrders
    .filter((draft) => {
      const matchSearch =
        draft.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        draft.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        draft.branch.toLowerCase().includes(search.toLowerCase());
      const matchBranch = branchFilter === 'All' || draft.branch === branchFilter;
      return matchSearch && matchBranch;
    })
    .sort((a, b) => {
      return sortAsc ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
    });

  const exportDraftsToCSV = () => {
    const headers = ['Draft #', 'Customer', 'Branch', 'Total Amount', 'Notes'];
    const rows = filtered.map((d) => [
      d.orderNumber,
      `"${d.customer.name}"`,
      `"${d.branch}"`,
      d.totalAmount,
      `"${d.notes || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `draft_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMoreActionsOpen(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2]">
      {/* Top Header Row (Matches Orders style: Title on left, Filter + More Actions + Back to Orders on right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Draft Orders</h1>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium rounded-xl border transition-all cursor-pointer shadow-2xs ${
                filterDropdownOpen || branchFilter !== 'All'
                  ? 'border-purple-300 ring-2 ring-purple-100 text-purple-700 font-semibold'
                  : 'border-slate-200/90'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              <span>Filter</span>
              {branchFilter !== 'All' && (
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
                    <span className="text-sm font-bold text-slate-900">Filter Branch</span>
                  </div>
                  {branchFilter !== 'All' && (
                    <button
                      onClick={() => setBranchFilter('All')}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {branches.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBranchFilter(b)}
                      className={`w-full py-2 px-3 rounded-lg text-left font-medium transition-colors cursor-pointer ${
                        branchFilter === b
                          ? 'bg-purple-50 text-purple-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {b}
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
                  onClick={exportDraftsToCSV}
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
                  <span>Print Draft Orders</span>
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
          {/* Left Branch Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-sm select-none">
            {branches.map((b) => {
              const count = b === 'All' ? draftOrders.length : draftOrders.filter((d) => d.branch === b).length;
              const isActive = branchFilter === b;
              return (
                <button
                  key={b}
                  onClick={() => setBranchFilter(b)}
                  className={`pb-1 whitespace-nowrap text-sm transition-all cursor-pointer relative ${
                    isActive
                      ? 'font-bold text-slate-900 border-b-2 border-purple-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {b} ({count})
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
                placeholder="Search draft orders..."
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

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="font-semibold text-slate-600">No draft orders found</p>
            <p className="text-xs text-slate-400 mt-1">Saved drafts will be listed here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-semibold">
                  <th className="py-3 px-5">Draft #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Estimated Total</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((draft, idx) => (
                  <tr
                    key={draft.id}
                    className={`transition-colors ${
                      idx % 2 === 1 ? 'bg-[#f8f9fe] hover:bg-[#edf0fd]/80' : 'bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-5 font-mono font-bold text-purple-700">
                      {draft.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {draft.customer.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{draft.branch}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {formatCurrency(draft.totalAmount)} BDT
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {draft.notes || '—'}
                    </td>
                    <td className="py-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onConvertDraftToLive(draft)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                        >
                          <span>Convert to Live Order</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteDraft(draft.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
