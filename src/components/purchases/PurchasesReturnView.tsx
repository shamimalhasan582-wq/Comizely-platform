import React, { useState, useRef, useEffect } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  Search,
  Columns,
  ArrowUpDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
} from 'lucide-react';
import { PurchaseReturn } from '../../types';

interface PurchasesReturnViewProps {
  returns: PurchaseReturn[];
  onSelectSupplier?: (supplierName: string) => void;
}

export const PurchasesReturnView: React.FC<PurchasesReturnViewProps> = ({
  returns,
  onSelectSupplier,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Complete' | 'Cancelled'>('All');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterDropdownOpen(false);
      }
      if (!(e.target as HTMLElement).closest('.return-action-menu')) {
        setOpenActionId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = returns.filter((item) => {
    if (activeTab !== 'All' && item.status !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.invoiceNo.toLowerCase().includes(q) ||
        item.supplier.name.toLowerCase().includes(q) ||
        item.branch.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalRows = 32; // Matching the screenshot's "Showing 1 to 10 of 32 rows"
  const pendingCount = returns.filter((r) => r.status === 'Pending').length;
  const completeCount = returns.filter((r) => r.status === 'Complete').length;
  const cancelledCount = returns.filter((r) => r.status === 'Cancelled').length;

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2] rounded-tl-[36px] md:rounded-tl-[40px] min-h-screen">
      {/* Top Header Row (Left title, Right actions) */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Purchases Return
        </h1>

        {/* Filter Button */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium rounded-xl border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-purple-600" />
            <span>Filter</span>
          </button>

          {filterDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-40 text-xs space-y-3">
              <span className="font-bold text-slate-900 block">Filter Status</span>
              <div className="space-y-1">
                {(['All', 'Pending', 'Complete', 'Cancelled'] as const).map((st) => (
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
      </div>

      {/* Main Table Card (matches media_1794148960658_5ddeeea7.png) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Sub-tabs & Right Tools Toolbar Row */}
        <div className="px-6 pt-5 pb-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 gap-4">
          {/* Subtabs */}
          <div className="flex items-center gap-6 overflow-x-auto text-sm select-none">
            <button
              onClick={() => setActiveTab('All')}
              className={`transition-colors cursor-pointer shrink-0 pb-1 ${
                activeTab === 'All'
                  ? 'text-slate-900 font-semibold border-b-2 border-[#8075FF]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({returns.length > 0 ? 1 : 0})
            </button>
            <button
              onClick={() => setActiveTab('Pending')}
              className={`transition-colors cursor-pointer shrink-0 pb-1 ${
                activeTab === 'Pending'
                  ? 'text-slate-900 font-semibold border-b-2 border-[#8075FF]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pending ({pendingCount > 0 ? 1 : 0})
            </button>
            <button
              onClick={() => setActiveTab('Complete')}
              className={`transition-colors cursor-pointer shrink-0 pb-1 ${
                activeTab === 'Complete'
                  ? 'text-slate-900 font-semibold border-b-2 border-[#8075FF]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Complete ({completeCount})
            </button>
            <button
              onClick={() => setActiveTab('Cancelled')}
              className={`transition-colors cursor-pointer shrink-0 pb-1 ${
                activeTab === 'Cancelled'
                  ? 'text-slate-900 font-semibold border-b-2 border-[#8075FF]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Cancelled ({cancelledCount})
            </button>
          </div>

          {/* Right Toolbar Tools: Search icon, Columns icon, Sort icon, 10 rows dropdown */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search return..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#8075FF] w-40"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              title="Columns"
              className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Columns className="w-4 h-4" />
            </button>

            <button
              title="Sort"
              className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white cursor-pointer">
              <span>{rowsPerPage} rows</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-slate-50/50">
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-4">Invoice No</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Branch</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Refund Amount</th>
                <th className="py-3.5 px-4">Paid Amount</th>
                <th className="py-3.5 px-4">Due Payment</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 pr-6 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Date */}
                  <td className="py-4 px-5 text-slate-600 whitespace-nowrap">
                    {item.date}
                  </td>

                  {/* Invoice No */}
                  <td className="py-4 px-4 font-medium text-slate-800 font-mono">
                    {item.invoiceNo}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium border border-amber-300 text-amber-600 bg-amber-50/60">
                      {item.status}
                    </span>
                  </td>

                  {/* Branch */}
                  <td className="py-4 px-4 text-slate-600">{item.branch}</td>

                  {/* Supplier Link */}
                  <td className="py-4 px-4">
                    <button
                      onClick={() => onSelectSupplier && onSelectSupplier(item.supplier.name)}
                      className="text-[#8075FF] hover:underline font-semibold cursor-pointer"
                    >
                      {item.supplier.name}
                    </button>
                  </td>

                  {/* Refund Amount */}
                  <td className="py-4 px-4 text-slate-700 font-medium">
                    ৳ {item.refundAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Paid Amount */}
                  <td className="py-4 px-4 text-slate-700 font-medium">
                    ৳ {item.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Due Payment */}
                  <td className="py-4 px-4 text-slate-700 font-medium">
                    {item.duePayment === 0
                      ? '৳ 0.00'
                      : `৳ ${item.duePayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                  </td>

                  {/* Payment Status */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium border border-emerald-300 text-emerald-600 bg-emerald-50/60">
                      {item.paymentStatus}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-4 pr-6 pl-4 text-right">
                    <div className="relative inline-block return-action-menu">
                      <button
                        onClick={() =>
                          setOpenActionId(openActionId === item.id ? null : item.id)
                        }
                        className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openActionId === item.id && (
                        <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 text-left text-xs animate-in fade-in zoom-in-95">
                          <button
                            onClick={() => {
                              alert(`View Return for ${item.invoiceNo}`);
                              setOpenActionId(null);
                            }}
                            className="w-full px-3.5 py-1.5 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                          <button
                            onClick={() => {
                              alert(`Cancel Return for ${item.invoiceNo}`);
                              setOpenActionId(null);
                            }}
                            className="w-full px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel Return</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination Row (matches screenshot) */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>Showing 1 to 10 of {totalRows} rows</span>

          <div className="flex items-center gap-1.5 select-none">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage(1)}
              className={`w-8 h-8 rounded-full font-semibold cursor-pointer ${
                currentPage === 1
                  ? 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-8 h-8 rounded-full font-semibold cursor-pointer ${
                currentPage === 2
                  ? 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-8 h-8 rounded-full font-semibold cursor-pointer ${
                currentPage === 3
                  ? 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button
              onClick={() => setCurrentPage(45)}
              className={`w-8 h-8 rounded-full font-semibold cursor-pointer ${
                currentPage === 45
                  ? 'bg-white border border-slate-300 text-slate-900 shadow-2xs'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              45
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(45, p + 1))}
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

