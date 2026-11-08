import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit2,
  MoreVertical,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Customer } from '../../types';

interface CustomerDetailPageProps {
  customer: Customer;
  onBack: () => void;
}

type TabType = 'Ledger' | 'Payments' | 'Advance Payment';

const PURCHASE_HISTORY = Array.from({ length: 10 }, (_, i) => ({
  id: `ph-${i + 1}`,
  date: '25 Sep 2026, 2:11 PM',
  invoiceNo: '629890',
  branch: 'Online Shop',
  totalAmount: 45000,
  totalPaid: 45000,
  sellDue: 45000,
  status: 'Pending' as const,
}));

export const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({
  customer,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('Ledger');
  const [rowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalRows = 32;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const avatarLetter = customer.name.charAt(0).toUpperCase();

  const kpiCards = [
    { label: 'Total Sale', value: customer.totalSale ?? 45000, color: 'text-slate-900' },
    { label: 'Sale Paid', value: customer.salePaid ?? 45000, color: 'text-emerald-600' },
    { label: 'Sale Due', value: customer.saleDue ?? 45000, color: 'text-rose-500' },
    { label: 'Total Sale Return', value: customer.totalSaleReturn ?? 45000, color: 'text-slate-900' },
  ];

  const fmt = (n: number) =>
    '৳ ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2] rounded-tl-[36px] md:rounded-tl-[40px] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #c4bfff 0%, #d8d5ff 40%, #ede9ff 70%, #f5f3ff 100%)',
        }}
      >
        {/* Decorative dots */}
        <div className="absolute right-0 top-0 bottom-0 w-64 opacity-20">
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 12 }).map((_, col) => (
              <div
                key={`${row}-${col}`}
                className="absolute w-1.5 h-1.5 rounded-full bg-purple-900"
                style={{ top: `${row * 14 + 6}px`, right: `${col * 14 + 6}px` }}
              />
            ))
          )}
        </div>

        <div className="relative px-7 py-6 flex items-center gap-5">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl bg-[#8075FF] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {avatarLetter}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{customer.name}</h2>
            <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-3 flex-wrap">
              <span>{customer.email}</span>
              <span>•</span>
              <span>+{customer.phone}</span>
              <span>•</span>
              <span>{customer.address}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs + Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1">
          {(['Ledger', 'Payments', 'Advance Payment'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#8075FF] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-xl border border-slate-200 shadow-sm transition-colors cursor-pointer">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-xs px-5 py-4">
            <p className={`text-base font-bold ${kpi.color}`}>{fmt(kpi.value)}</p>
            <p className="text-xs text-slate-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Purchase History Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">Purchase History</span>
        </div>
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">All Purchases</span>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 cursor-pointer">
              <Search className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white cursor-pointer">
              <span>10 rows</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-slate-50/50">
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-4">Invoice No</th>
                <th className="py-3.5 px-4">Branch</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Total Paid</th>
                <th className="py-3.5 px-4">Sell Due</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 pr-6 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PURCHASE_HISTORY.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 text-slate-700 whitespace-nowrap">{row.date}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.invoiceNo}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.branch}</td>
                  <td className="py-3.5 px-4 text-slate-700">৳ {row.totalAmount.toLocaleString()}.00</td>
                  <td className="py-3.5 px-4 text-slate-700">৳ {row.totalPaid.toLocaleString()}.00</td>
                  <td className="py-3.5 px-4 text-slate-700">৳ {row.sellDue.toLocaleString()}.00</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 pr-6 pl-4 text-right">
                    <button className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scroll hint */}
        <div className="border-t border-slate-100 h-1" />

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {rowsPerPage} of {totalRows} rows</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  currentPage === p
                    ? 'bg-[#8075FF] text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}
            <span className="px-1 text-slate-400">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="w-7 h-7 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              {totalPages}
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

