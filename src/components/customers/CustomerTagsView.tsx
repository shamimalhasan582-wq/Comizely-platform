import React, { useState } from 'react';
import {
  Search,
  Columns,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from 'lucide-react';
import { CustomerTag } from '../../types';

interface CustomerTagsViewProps {
  tags: CustomerTag[];
  onOpenCreateTag: () => void;
  onDeleteTag: (id: string) => void;
  onEditTag: (tag: CustomerTag) => void;
}

export const CustomerTagsView: React.FC<CustomerTagsViewProps> = ({
  tags,
  onOpenCreateTag,
  onDeleteTag,
  onEditTag,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Fill demo rows to match screenshot (shows 10 rows all "Fraud")
  const displayTags: CustomerTag[] =
    tags.length >= 10
      ? tags
      : [
          ...tags,
          ...Array.from({ length: Math.max(0, 10 - tags.length) }, (_, i) => ({
            id: `tag-gen-${i + 1}`,
            name: 'Fraud',
            createdAt: '2 APR 2026, 3:30 PM',
          })),
        ];

  const totalRows = 32;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paged = displayTags.slice(0, 10);

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2] rounded-tl-[36px] md:rounded-tl-[40px] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Tags</h1>
        <button
          onClick={onOpenCreateTag}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-2xl shadow-sm shadow-[#8075FF]/25 transition-all cursor-pointer hover:shadow-md active:scale-98"
        >
          <span>Create Customer Tags</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-800">All Customers tags</span>
          <div className="flex items-center gap-3">
            <button
              title="Search"
              className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
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
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-4">Created At</th>
                <th className="py-3.5 pr-6 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paged.map((tag) => (
                <tr key={tag.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 text-slate-800 font-medium">{tag.name}</td>
                  <td className="py-3.5 px-4 text-slate-500">{tag.createdAt}</td>
                  <td className="py-3.5 pr-6 pl-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditTag(tag)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTag(tag.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
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

