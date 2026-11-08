import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  Edit2,
  Printer,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { Purchase } from '../../types';

interface PurchaseDetailPageProps {
  purchase: Purchase;
  onBack: () => void;
  onDeletePurchase?: (id: string) => void;
  onUpdatePurchase?: (purchase: Purchase) => void;
}

export const PurchaseDetailPage: React.FC<PurchaseDetailPageProps> = ({
  purchase,
  onBack,
  onDeletePurchase,
  onUpdatePurchase,
}) => {
  const [currentPurchase, setCurrentPurchase] = useState<Purchase>(purchase);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusInput, setStatusInput] = useState(purchase.status || 'State Name');
  const [showPrintSlip, setShowPrintSlip] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format currency
  const fmt = (val: number | undefined) =>
    `৳ ${(val || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleSaveStatus = () => {
    const updated = { ...currentPurchase, status: statusInput };
    setCurrentPurchase(updated);
    if (onUpdatePurchase) onUpdatePurchase(updated);
    setIsEditingStatus(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2] rounded-tl-[36px] md:rounded-tl-[40px] min-h-screen">
      {/* Top Header Bar */}
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
          <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
            Purchase Details
          </h1>
        </div>

        {/* Top Right Options Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 bg-white text-slate-500 hover:text-slate-800 rounded-xl border border-slate-200/90 shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 text-xs animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowPrintSlip(true);
                }}
                className="w-full px-4 py-2 text-left text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Purchase Slip</span>
              </button>
              {onDeletePurchase && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (confirm(`Delete purchase ${currentPurchase.invoiceNo}?`)) {
                      onDeletePurchase(currentPurchase.id);
                      onBack();
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Purchase</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card 1: Top Overview Info Bar (Invoice No, Date, Status, Payment Status) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Invoice No */}
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">
              Invoice No
            </span>
            <span className="font-bold text-slate-900 mt-1 block">
              {currentPurchase.invoiceNo || '#137179'}
            </span>
          </div>

          {/* Purchase Date */}
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">
              Purchase Date
            </span>
            <span className="font-semibold text-slate-800 mt-1 block">
              {currentPurchase.purchaseDate || '23 Sep 2026 3:25 PM'}
            </span>
          </div>

          {/* Purchase Status */}
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">
              Purchase Status
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px]">
                {currentPurchase.status || 'State Name'}
              </span>
              <button
                type="button"
                onClick={() => setIsEditingStatus(true)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">
              Payment Status
            </span>
            <div className="mt-1">
              <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px]">
                {currentPurchase.paymentStatus || 'State Name'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Supplier Details Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-900">Supplier Details</h3>

        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <span className="md:col-span-2 text-slate-500 font-medium">Supplier Name</span>
            <span className="md:col-span-10 text-slate-800 font-semibold">
              : {currentPurchase.supplier?.name || 'Shopbase'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <span className="md:col-span-2 text-slate-500 font-medium">Email</span>
            <span className="md:col-span-10 text-slate-800">
              : {currentPurchase.supplier?.email || 'support@shopbasebd.com'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <span className="md:col-span-2 text-slate-500 font-medium">Phone No</span>
            <span className="md:col-span-10 text-slate-800">
              : {currentPurchase.supplier?.phone || '+8801710123123'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <span className="md:col-span-2 text-slate-500 font-medium">Address</span>
            <span className="md:col-span-10 text-slate-800">
              : {currentPurchase.supplier?.address ||
                'House-717, Road-1, Mohammadpur, Dhaka-1207, Bangladesh, Mohammadpur, Dhaka, Dhaka, Bangladesh'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <span className="md:col-span-2 text-slate-500 font-medium">City</span>
            <span className="md:col-span-10 text-slate-800">
              : {currentPurchase.supplier?.city || 'N/A'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <span className="md:col-span-2 text-slate-500 font-medium">Country</span>
            <span className="md:col-span-10 text-slate-800">
              : {currentPurchase.supplier?.country || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Product Details Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-900">Product Details</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-medium">
                <th className="py-2 px-3">Products</th>
                <th className="py-2 px-3">SKU</th>
                <th className="py-2 px-3">QTY</th>
                <th className="py-2 px-3">Purchase Price</th>
                <th className="py-2 px-3">Selling Price</th>
                <th className="py-2 px-3">Sub Total</th>
                <th className="py-2 px-3">Discount</th>
                <th className="py-2 px-3 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPurchase.items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Product */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 rounded-lg object-cover bg-slate-100 border border-slate-100 shrink-0"
                      />
                      <span className="font-semibold text-slate-800 truncate max-w-xs">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-3 px-3 text-slate-600">{item.sku}</td>

                  {/* QTY */}
                  <td className="py-3 px-3 text-slate-800 font-semibold">
                    {item.quantity}
                  </td>

                  {/* Purchase Price */}
                  <td className="py-3 px-3 text-slate-700">
                    {fmt(item.purchasePrice)}
                  </td>

                  {/* Selling Price */}
                  <td className="py-3 px-3 text-slate-700">
                    {fmt(item.sellingPrice)}
                  </td>

                  {/* Sub Total */}
                  <td className="py-3 px-3 text-slate-700">
                    {fmt(item.subtotal || item.purchasePrice * item.quantity)}
                  </td>

                  {/* Discount */}
                  <td className="py-3 px-3 text-slate-700">
                    {fmt(item.discount || 0)}
                  </td>

                  {/* Total Price */}
                  <td className="py-3 px-3 text-right font-semibold text-slate-900">
                    {fmt(item.totalPrice || item.purchasePrice * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Right Financial Summary (matches screenshot) */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <div className="w-72 bg-slate-50/50 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">
                {fmt(currentPurchase.subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Additional Discount</span>
              <span className="font-semibold text-slate-900">
                {fmt(currentPurchase.discount || 0)}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Total</span>
              <span className="font-bold text-slate-900">
                {fmt(currentPurchase.totalAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Paid Amount</span>
              <span className="font-semibold text-slate-900">
                {fmt(currentPurchase.paidAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Return Paid Amount</span>
              <span className="font-semibold text-slate-900">
                {fmt(currentPurchase.returnPaidAmount || 0)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
              <span className="font-bold text-slate-800">Due</span>
              <span className="font-bold text-rose-500">
                {fmt(currentPurchase.dueAmount || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Transaction History Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-900">Transaction History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-medium">
                <th className="py-2 px-3">Trx Id</th>
                <th className="py-2 px-3">Account Name</th>
                <th className="py-2 px-3">Post Balance</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Transaction For</th>
                <th className="py-2 px-3">Paid At</th>
                <th className="py-2 px-3 text-right">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPurchase.transactions && currentPurchase.transactions.length > 0 ? (
                currentPurchase.transactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-slate-800">
                      {trx.trxId}
                    </td>
                    <td className="py-3 px-3 text-slate-700">{trx.accountName}</td>
                    <td className="py-3 px-3 text-slate-700">{fmt(trx.postBalance)}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {fmt(trx.amount)}
                    </td>
                    <td className="py-3 px-3 text-slate-700">{trx.type}</td>
                    <td className="py-3 px-3 text-slate-700">{trx.transactionFor}</td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {trx.paidAt}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500">{trx.note}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400">
                    No transactions recorded for this purchase order yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      {isEditingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Update Status</h3>
              <button
                type="button"
                onClick={() => setIsEditingStatus(false)}
                className="w-7 h-7 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Purchase Status
              </label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-[#8075FF]"
              >
                <option value="State Name">State Name</option>
                <option value="Received">Received</option>
                <option value="Ordered">Ordered</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingStatus(false)}
                className="px-4 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStatus}
                className="px-5 py-1.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Slip Modal */}
      {showPrintSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Official Purchase Slip
              </h2>
              <button
                onClick={() => setShowPrintSlip(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 space-y-4 text-xs font-mono bg-slate-50/50">
              <div className="text-center border-b pb-3 border-slate-200">
                <h3 className="font-bold text-base text-slate-900 font-sans">
                  PURCHASE ORDER INVOICE
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Invoice: {currentPurchase.invoiceNo} • Date: {currentPurchase.purchaseDate}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="font-bold text-slate-700 block">Supplier:</span>
                  <p className="text-slate-600">{currentPurchase.supplier.name}</p>
                  <p className="text-slate-600">{currentPurchase.supplier.phone}</p>
                  <p className="text-slate-500">{currentPurchase.supplier.address}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-700 block">Branch:</span>
                  <p className="text-slate-600">{currentPurchase.branch}</p>
                  <p className="font-bold text-slate-900 mt-1">
                    Total: {fmt(currentPurchase.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-1">Product</th>
                      <th className="pb-1 text-center">Qty</th>
                      <th className="pb-1 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPurchase.items.map((it) => (
                      <tr key={it.id}>
                        <td className="py-1 truncate max-w-[150px]">{it.name}</td>
                        <td className="py-1 text-center">{it.quantity}</td>
                        <td className="py-1 text-right">{fmt(it.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPrintSlip(false)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-xl bg-[#8075FF] hover:bg-[#6e62ff] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-[#8075FF]/25 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

