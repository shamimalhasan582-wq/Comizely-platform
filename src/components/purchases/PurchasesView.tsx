import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Download,
  Printer,
  Eye,
  Trash2,
} from 'lucide-react';
import { Purchase } from '../../types';

interface PurchasesViewProps {
  purchases: Purchase[];
  onOpenCreatePurchase: () => void;
  onSelectPurchase: (purchase: Purchase) => void;
  onDeletePurchase?: (id: string) => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({
  purchases,
  onOpenCreatePurchase,
  onSelectPurchase,
  onDeletePurchase,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Received' | 'Ordered' | 'Pending'>('All');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filterRef = useRef<HTMLDivElement>(null);
  const moreActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterDropdownOpen(false);
      }
      if (moreActionsRef.current && !moreActionsRef.current.contains(e.target as Node)) {
        setMoreActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPurchases = purchases.filter((pur) => {
    if (activeTab !== 'All' && pur.status !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchInv = pur.invoiceNo.toLowerCase().includes(q);
      const matchSup = pur.supplier.name.toLowerCase().includes(q);
      if (!matchInv && !matchSup) return false;
    }
    return true;
  });

  const exportPurchasesToCSV = () => {
    const headers = ['Invoice No,Supplier,Branch,Total Amount,Status,Purchase Date'];
    const rows = filteredPurchases.map(
      (p) =>
        `"${p.invoiceNo}","${p.supplier.name}","${p.branch}",${p.totalAmount},"${p.status}","${p.purchaseDate}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `purchases-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMoreActionsOpen(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2] rounded-tl-[36px] md:rounded-tl-[40px] min-h-screen">
      {/* Top Header Row (Left title, Right actions) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Purchases</h1>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium rounded-xl border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              <span>Filter</span>
            </button>

            {filterDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-40 text-xs space-y-3">
                <span className="font-bold text-slate-900 block">Filter By Status</span>
                <div className="space-y-1">
                  {(['All', 'Received', 'Ordered', 'Pending'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setActiveTab(st);
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        activeTab === st
                          ? 'bg-purple-50 text-[#8075FF] font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st}
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
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 text-xs">
                <button
                  onClick={exportPurchasesToCSV}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Export to CSV</span>
                </button>
                <button
                  onClick={() => {
                    window.print();
                    setMoreActionsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print Purchases</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenCreatePurchase}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-2xl shadow-sm shadow-[#8075FF]/25 transition-all cursor-pointer hover:shadow-md active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Create Purchase</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Sub-tabs Row */}
        <div className="px-6 pt-5 pb-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 gap-4">
          <div className="flex items-center gap-6 overflow-x-auto text-sm select-none">
            {(['All', 'Received', 'Ordered', 'Pending'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`transition-colors cursor-pointer shrink-0 pb-1 ${
                  activeTab === tab
                    ? 'text-slate-900 font-semibold border-b-2 border-[#8075FF]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab} ({tab === 'All' ? purchases.length : purchases.filter((p) => p.status === tab).length})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search purchases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#8075FF] w-48"
            />
          </div>
        </div>

        {/* Purchases Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 bg-slate-50/50">
                <th className="py-3 px-6">Invoice #</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Items Count</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 pr-6 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((pur) => (
                  <tr key={pur.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Invoice # */}
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      <button
                        onClick={() => onSelectPurchase(pur)}
                        className="hover:text-[#8075FF] transition-colors cursor-pointer font-mono"
                      >
                        {pur.invoiceNo}
                      </button>
                    </td>

                    {/* Supplier */}
                    <td className="py-4 px-4 font-medium text-slate-700">
                      {pur.supplier.name}
                    </td>

                    {/* Branch */}
                    <td className="py-4 px-4 text-slate-500">{pur.branch}</td>

                    {/* Items Count */}
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {pur.items.reduce((acc, it) => acc + (it.quantity || 0), 0)} items
                    </td>

                    {/* Total Amount */}
                    <td className="py-4 px-4 font-bold text-slate-800">
                      ৳ {pur.totalAmount.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {pur.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                      {pur.purchaseDate}
                    </td>

                    {/* Action */}
                    <td className="py-4 pr-6 pl-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-400">
                        <button
                          onClick={() => onSelectPurchase(pur)}
                          title="View Purchase Details"
                          className="hover:text-[#8075FF] transition-colors cursor-pointer p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {onDeletePurchase && (
                          <button
                            onClick={() => {
                              if (confirm(`Delete purchase ${pur.invoiceNo}?`)) {
                                onDeletePurchase(pur.id);
                              }
                            }}
                            title="Delete Purchase"
                            className="hover:text-rose-600 transition-colors cursor-pointer p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No purchase orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

