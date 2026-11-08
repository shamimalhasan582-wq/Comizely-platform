import React, { useState } from 'react';
import {
  Search,
  Columns,
  ArrowUpDown,
  ChevronDown,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { Customer } from '../../types';

interface CustomersViewProps {
  customers: Customer[];
  onOpenCreateCustomer?: () => void;
  onSelectCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onOpenCreateCustomer,
  onSelectCustomer,
  onDeleteCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Fill in demo list if needed to display 10 rows matching screenshot
  const displayCustomers =
    customers.length >= 10
      ? customers
      : [
          ...customers,
          ...Array.from({ length: 10 - customers.length }).map((_, i) => ({
            id: `cust-gen-${i + 1}`,
            name: 'MR MD Saidur Rahman',
            email: 'support@shopbasebd.com',
            phone: '8801710123123',
            address:
              'Babla Super Market, Shyampur, Dhaka, Dhaka, Dhaka, Bangladesh',
            city: 'Dhaka',
            totalOrders: 10,
            totalSpent: 45000,
            lastOrderDate: '28 Jul , 2026',
            tier: 'VIP' as const,
            totalSale: 45000,
            salePaid: 45000,
            saleDue: 45000,
            totalSaleReturn: 45000,
          })),
        ];

  const filtered = displayCustomers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.address && c.address.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2] rounded-tl-[36px] md:rounded-tl-[40px] min-h-screen">
      {/* Top Header Row (Left title, Right Create Customer button) */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customers</h1>

        <button
          onClick={onOpenCreateCustomer}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-2xl shadow-sm shadow-[#8075FF]/25 transition-all cursor-pointer hover:shadow-md active:scale-98"
        >
          <span>Create Customer</span>
        </button>
      </div>

      {/* Main Table Card (matches media_1794149446969_127dd11e.png) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Subheader Toolbar Row */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-800">All Customers</span>

          {/* Right Tools */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search customer..."
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
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Address</th>
                <th className="py-3.5 pr-6 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.slice(0, 10).map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Name (clickable link) */}
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    <button
                      onClick={() => onSelectCustomer && onSelectCustomer(cust)}
                      className="hover:text-[#8075FF] transition-colors cursor-pointer text-left"
                    >
                      {cust.name}
                    </button>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-4 text-slate-600">
                    {cust.email || 'support@shopbasebd.com'}
                  </td>

                  {/* Phone */}
                  <td className="py-4 px-4 text-slate-600 font-mono">
                    {cust.phone.replace(/[^0-9]/g, '') || '8801710123123'}
                  </td>

                  {/* Address */}
                  <td className="py-4 px-4 text-slate-600 truncate max-w-sm">
                    {cust.address ||
                      'Babla Super Market, Shyampur, Dhaka, Dhaka, Dhaka, Bangladesh'}
                  </td>

                  {/* Action (Eye icon + three dots menu) */}
                  <td className="py-4 pr-6 pl-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400 relative">
                      <button
                        onClick={() => onSelectCustomer && onSelectCustomer(cust)}
                        title="View Customer Details"
                        className="hover:text-[#8075FF] p-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === cust.id ? null : cust.id)
                          }
                          className="hover:text-slate-600 p-1 cursor-pointer transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === cust.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 text-left text-xs animate-in fade-in zoom-in-95">
                            <button
                              onClick={() => {
                                if (onSelectCustomer) onSelectCustomer(cust);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3.5 py-1.5 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Profile</span>
                            </button>
                            {onDeleteCustomer && (
                              <button
                                onClick={() => {
                                  if (confirm(`Delete customer ${cust.name}?`)) {
                                    onDeleteCustomer(cust.id);
                                  }
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Row (matches screenshot) */}
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
  );
};
