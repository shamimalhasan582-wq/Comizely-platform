import React, { useState } from 'react';
import {
  Plus,
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
import { SupplierItem } from '../../types';

interface SuppliersViewProps {
  suppliers: SupplierItem[];
  onOpenCreateSupplier: () => void;
  onSelectSupplier: (supplier: SupplierItem) => void;
  onDeleteSupplier?: (id: string) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  onOpenCreateSupplier,
  onSelectSupplier,
  onDeleteSupplier,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredSuppliers = suppliers.filter((sup) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sup.name.toLowerCase().includes(q) ||
        sup.email.toLowerCase().includes(q) ||
        sup.phone.toLowerCase().includes(q) ||
        sup.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2] rounded-tl-[36px] md:rounded-tl-[40px] min-h-screen">
      {/* Top Header Row (Left title, Right Create Supplier button) */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Suppliers</h1>

        <button
          onClick={onOpenCreateSupplier}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-2xl shadow-sm shadow-[#8075FF]/25 transition-all cursor-pointer hover:shadow-md active:scale-98"
        >
          <span>Create Supplier</span>
        </button>
      </div>

      {/* Main Table Card (matches media_1794148974198_ab27d1cb.png) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Subheader Toolbar Row */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-800">All Suppliers</span>

          {/* Right Tools */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search supplier..."
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
              {filteredSuppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Name (clickable link) */}
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    <button
                      onClick={() => onSelectSupplier(sup)}
                      className="hover:text-[#8075FF] transition-colors cursor-pointer text-left"
                    >
                      {sup.name}
                    </button>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-4 text-slate-600">{sup.email}</td>

                  {/* Phone */}
                  <td className="py-4 px-4 text-slate-600 font-mono">{sup.phone}</td>

                  {/* Address */}
                  <td className="py-4 px-4 text-slate-600 truncate max-w-sm">
                    {sup.address}
                  </td>

                  {/* Action (Eye icon + three dots menu) */}
                  <td className="py-4 pr-6 pl-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400 relative">
                      <button
                        onClick={() => onSelectSupplier(sup)}
                        title="View Supplier Details"
                        className="hover:text-[#8075FF] p-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === sup.id ? null : sup.id)
                          }
                          className="hover:text-slate-600 p-1 cursor-pointer transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === sup.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 text-left text-xs animate-in fade-in zoom-in-95">
                            <button
                              onClick={() => {
                                onSelectSupplier(sup);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3.5 py-1.5 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Profile</span>
                            </button>
                            {onDeleteSupplier && (
                              <button
                                onClick={() => {
                                  if (confirm(`Delete supplier ${sup.name}?`)) {
                                    onDeleteSupplier(sup.id);
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

