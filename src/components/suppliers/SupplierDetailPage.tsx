import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit2,
  DollarSign,
  SlidersHorizontal,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { SupplierItem } from '../../types';

interface SupplierDetailPageProps {
  supplier: SupplierItem;
  onBack: () => void;
  onAdvancePayment?: () => void;
}

export const SupplierDetailPage: React.FC<SupplierDetailPageProps> = ({
  supplier,
  onBack,
  onAdvancePayment,
}) => {
  const [activeTab, setActiveTab] = useState<'Ledger' | 'Payments' | 'Advance Payment'>('Ledger');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const history = supplier.history && supplier.history.length > 0
    ? supplier.history
    : Array.from({ length: 10 }).map((_, i) => ({
        id: `phist-def-${i}`,
        date: '25 Sep 2026, 2:11 PM',
        invoiceNo: '62989D',
        branch: 'Online Shop',
        contactNumber: supplier.phone || '8801710123123',
        totalAmount: 45000,
        totalPaid: 45000,
        purchaseDue: 0,
      }));

  const filteredHistory = history.filter((h) => {
    if (searchQuery.trim()) {
      return (
        h.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.branch.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const avatarLetter = (supplier.companyName || supplier.name || 'S')
    .charAt(0)
    .toUpperCase();

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#F2F2F2] rounded-tl-[36px] md:rounded-tl-[40px] min-h-screen">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Supplier Details
          </h1>
        </div>

        {/* Right action buttons: Edit + Advance Payment */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="p-2 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl border border-slate-200/90 shadow-2xs cursor-pointer"
            title="Edit Supplier"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (onAdvancePayment) onAdvancePayment();
              else alert('Advance Payment dialog');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200/90 shadow-2xs cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
            <span>Advance Payment</span>
          </button>
        </div>
      </div>

      {/* Top Supplier Profile Card (matches screenshot) */}
      <div className="relative bg-white rounded-3xl p-6 border border-slate-100 shadow-xs overflow-hidden">
        {/* Soft purple blur mesh */}
        <div
          className="absolute -top-10 -left-10 w-64 h-32 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(128,117,255,0.2) 0%, rgba(99,102,241,0.1) 60%, transparent 80%)',
            filter: 'blur(24px)',
          }}
        />

        <div className="flex items-center gap-4 relative z-10">
          {/* Avatar Square */}
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-xl text-slate-800 shrink-0">
            {avatarLetter}
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              {supplier.companyName || `${supplier.name} Ltd`}
            </h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span>{supplier.email}</span>
              <span>•</span>
              <span>+{supplier.phone}</span>
              <span>•</span>
              <span className="truncate max-w-md">{supplier.address}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Row (Ledger, Payments, Advance Payment) + Filter Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-100/70 p-1 rounded-2xl">
          {(['Ledger', 'Payments', 'Advance Payment'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200/90 shadow-2xs cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
          <span>Filter</span>
        </button>
      </div>

      {/* 4 KPI / Stat Cards Grid (matches screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Purchase */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
          <span className="text-base font-extrabold text-slate-900 block">
            ৳ {supplier.totalPurchase.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-slate-400 block font-medium">
            Total Purchase
          </span>
        </div>

        {/* Purchase Paid */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
          <span className="text-base font-extrabold text-emerald-600 block">
            ৳ {supplier.purchasePaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-slate-400 block font-medium">
            Purchase Paid
          </span>
        </div>

        {/* Purchase Due */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
          <span className="text-base font-extrabold text-rose-500 block">
            ৳ {supplier.purchaseDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-slate-400 block font-medium">
            Purchase Due
          </span>
        </div>

        {/* Total Purchase Return */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
          <span className="text-base font-extrabold text-slate-900 block">
            ৳ {supplier.totalPurchaseReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-slate-400 block font-medium">
            Total Purchase Return
          </span>
        </div>
      </div>

      {/* Purchase History Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Purchase History</h3>

        {/* History Table Card (matches media_1794148998358_afe531d2.jpg) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          {/* Subheader */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">
              All Purchases
            </span>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search invoice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#8075FF] w-36"
                />
                <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white">
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
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-4">Invoice No</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Contact Number</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Total Paid</th>
                  <th className="py-3 pr-6 pl-4 text-right">Purchase Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-slate-800">
                      {item.invoiceNo}
                    </td>
                    <td className="py-4 px-4 text-slate-600">{item.branch}</td>
                    <td className="py-4 px-4 text-slate-600 font-mono">
                      {item.contactNumber}
                    </td>
                    <td className="py-4 px-4 text-slate-800 font-semibold">
                      ৳ {item.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4 text-slate-800 font-semibold">
                      ৳ {item.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 pr-6 pl-4 text-right text-slate-600 font-semibold">
                      ৳ {item.purchaseDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span>Showing 1 to 10 of 32 rows</span>

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
    </div>
  );
};

