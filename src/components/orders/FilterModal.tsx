import React, { useState } from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { branchesList } from '../../data/mockData';
import { OrderStatus } from '../../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  selectedPaymentStatus: string;
  setSelectedPaymentStatus: (status: string) => void;
  minAmount: string;
  setMinAmount: (val: string) => void;
  maxAmount: string;
  setMaxAmount: (val: string) => void;
  onReset: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedBranch,
  setSelectedBranch,
  selectedPaymentStatus,
  setSelectedPaymentStatus,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900">Filter Orders</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close filter"
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Branch Filter */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Branch / Outlet</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Branches</option>
              {branchesList.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Payment Status</label>
            <div className="grid grid-cols-3 gap-2">
              {['All', 'Paid', 'Unpaid'].map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setSelectedPaymentStatus(st)}
                  className={`py-1.5 px-3 rounded-xl border text-center font-medium transition-colors cursor-pointer ${
                    selectedPaymentStatus === st
                      ? 'bg-purple-50 border-purple-300 text-purple-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Total Amount Range */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Total Amount Range (BDT)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min (e.g. 1000)"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
              />
              <input
                type="number"
                placeholder="Max (e.g. 5000)"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#8075FF] hover:bg-[#6e62ff] text-white font-semibold text-xs shadow-sm shadow-[#8075FF]/25 cursor-pointer"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
