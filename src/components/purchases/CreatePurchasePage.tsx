import React, { useState, useRef } from 'react';
import {
  Search,
  ChevronDown,
  Calendar,
  Upload,
  X,
  Plus,
  Check,
} from 'lucide-react';
import { Product, Purchase, PurchaseItem } from '../../types';
import { SUPPLIERS_LIST, BRANCHES_LIST } from '../../data/mockPurchases';

interface CreatePurchasePageProps {
  products: Product[];
  onCancel: () => void;
  onSavePurchase: (newPurchase: Purchase) => void;
  lastInvoiceNumber?: string;
}

export const CreatePurchasePage: React.FC<CreatePurchasePageProps> = ({
  products,
  onCancel,
  onSavePurchase,
  lastInvoiceNumber = '#137180',
}) => {
  // Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('sup-1');
  const [selectedBranch, setSelectedBranch] = useState<string>('Online Shop');
  const [status, setStatus] = useState<string>('Received');
  const [purchaseDate, setPurchaseDate] = useState<string>('2026-09-23');
  const [paymentNote, setPaymentNote] = useState<string>('');
  const [paymentAccount, setPaymentAccount] = useState<string>('Bank');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

  // Search & Items
  const [searchQuery, setSearchQuery] = useState('');
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountType, setDiscountType] = useState<'Fixed' | 'Percentage'>('Fixed');
  const [discountInput, setDiscountInput] = useState('');
  const [discount, setDiscount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial products added matching screenshot media_1794148148110_cce6d9f5.png
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      id: 'pitem-init-1',
      productId: 'p-1',
      name: 'Oraimo smart lite 2',
      sku: '62989D',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80',
      unit: 'Piece',
      purchasePrice: 1310,
      sellingPrice: 1800,
      quantity: 1,
      subtotal: 1310,
      discount: 0,
      totalPrice: 1310,
    },
    {
      id: 'pitem-init-2',
      productId: 'p-2',
      name: 'Oraimo smart lite 2',
      sku: '62989D',
      image:
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=150&q=80',
      unit: 'Piece',
      purchasePrice: 1310,
      sellingPrice: 1800,
      quantity: 1,
      subtotal: 1310,
      discount: 0,
      totalPrice: 1310,
    },
  ]);

  // Calculations
  const subtotal = items.reduce(
    (acc, it) => acc + (it.purchasePrice || 0) * (it.quantity || 0),
    0
  );
  const totalAmount = Math.max(0, subtotal - discount);

  // Update Item Fields
  const updateItem = (
    id: string,
    field: 'purchasePrice' | 'sellingPrice' | 'quantity' | 'unit',
    value: any
  ) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, [field]: value };
        updated.subtotal = (updated.purchasePrice || 0) * (updated.quantity || 0);
        updated.totalPrice = Math.max(0, updated.subtotal - (updated.discount || 0));
        return updated;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const addProductToPurchase = (prod: Product) => {
    const existing = items.find((i) => i.productId === prod.id);
    if (existing) {
      updateItem(existing.id, 'quantity', (existing.quantity || 1) + 1);
    } else {
      const newItem: PurchaseItem = {
        id: `pitem-${Date.now()}-${Math.random()}`,
        productId: prod.id,
        name: prod.name,
        sku: prod.sku,
        image: prod.image,
        unit: 'Piece',
        purchasePrice: prod.costPrice || 1310,
        sellingPrice: prod.price || 1800,
        quantity: 1,
        subtotal: prod.costPrice || 1310,
        discount: 0,
        totalPrice: prod.costPrice || 1310,
      };
      setItems((prev) => [...prev, newItem]);
    }
    setSearchQuery('');
  };

  // Filter products for inline search
  const searchResults =
    searchQuery.trim().length > 0
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  // Save handler
  const handleSave = () => {
    const selectedSupplier =
      SUPPLIERS_LIST.find((s) => s.id === selectedSupplierId) || SUPPLIERS_LIST[0];

    const nextNumber =
      '#' +
      (
        parseInt(lastInvoiceNumber.replace(/[^0-9]/g, '') || '137180', 10) + 1
      ).toString();

    const newPurchase: Purchase = {
      id: `pur-${Date.now()}`,
      invoiceNo: nextNumber,
      supplier: {
        id: selectedSupplier.id,
        name: selectedSupplier.name,
        email: selectedSupplier.email,
        phone: selectedSupplier.phone,
        address:
          'House-717, Road-1, Mohammadpur, Dhaka-1207, Bangladesh, Mohammadpur, Dhaka, Dhaka, Bangladesh',
        city: 'N/A',
        country: 'N/A',
      },
      branch: selectedBranch,
      items: items,
      subtotal: subtotal,
      discount: discount,
      totalAmount: totalAmount,
      paidAmount: totalAmount,
      dueAmount: 0,
      returnPaidAmount: 0,
      status: status || 'Received',
      paymentStatus: 'Paid',
      paymentAccount: paymentAccount,
      paymentNote: paymentNote,
      purchaseDate: `${new Date().getDate()} ${new Date().toLocaleString('default', {
        month: 'short',
      })} ${new Date().getFullYear()} ${new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      transactions: [
        {
          id: `trx-${Date.now()}`,
          trxId: 'MNZCATHOOMQK',
          accountName: paymentAccount,
          postBalance: 3000,
          amount: totalAmount,
          type: 'Payment',
          transactionFor: 'Purchase',
          paidAt: `${new Date().getDate()} ${new Date().toLocaleString('default', {
            month: 'short',
          })} ${new Date().getFullYear()} ${new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}`,
          note: paymentNote || 'Paid for Advance',
        },
      ],
      attachedDocuments: attachedFiles,
    };

    onSavePurchase(newPurchase);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#F2F2F2] rounded-tl-[36px] md:rounded-tl-[40px] min-h-screen">
      {/* Top Bar (matches screenshot) */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
          Create Purchase
        </h1>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-xs font-semibold rounded-xl shadow-sm shadow-[#8075FF]/25 transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-8 space-y-5">
          {/* Card 1: Supplier & Branch Dropdowns */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Supplier Dropdown */}
              <div className="relative">
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full appearance-none py-3 px-4 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white font-medium focus:outline-none focus:border-[#8075FF] cursor-pointer"
                >
                  <option value="" disabled>
                    Supplier*
                  </option>
                  {SUPPLIERS_LIST.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Branch Dropdown */}
              <div className="relative">
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full appearance-none py-3 px-4 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white font-medium focus:outline-none focus:border-[#8075FF] cursor-pointer"
                >
                  <option value="" disabled>
                    Branch*
                  </option>
                  {BRANCHES_LIST.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Search Product + Product Items Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
            {/* Top Search & Browse Bar */}
            <div className="flex items-center gap-3 relative">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Product"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#8075FF]"
                />

                {/* Inline search dropdown results */}
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 max-h-60 overflow-y-auto divide-y divide-slate-50">
                    {searchResults.map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => addProductToPurchase(prod)}
                        className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-8 h-8 rounded-lg object-cover bg-slate-100"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-800">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-slate-400">{prod.sku}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#8075FF]">
                          ৳ {prod.costPrice || 1310}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Browse Product Button */}
              <button
                type="button"
                onClick={() => setIsBrowseModalOpen(true)}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
              >
                Browse Product
              </button>
            </div>

            {/* Added Products Table (matches media_1794148148110_cce6d9f5.png) */}
            {items.length > 0 && (
              <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {/* Table Header */}
                <div className="px-4 py-2.5 bg-slate-50/60 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Product</span>
                  <span>Total Amount</span>
                </div>

                {/* Product Rows */}
                <div className="divide-y divide-slate-100">
                  {items.map((it) => (
                    <div key={it.id} className="p-4 space-y-3">
                      {/* Top row: Thumbnail, Name, Price, and Total Amount with close button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={it.image}
                            alt={it.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-800">
                              {it.name}
                            </p>
                            <p className="text-xs font-bold text-[#8075FF] mt-0.5">
                              ৳ {it.purchasePrice.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#8075FF]">
                            ৳ {it.totalPrice.toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(it.id)}
                            className="text-slate-400 hover:text-rose-500 cursor-pointer text-base leading-none"
                            title="Remove product"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      {/* Bottom row: 4 input fields (Piece dropdown, Purchase Price, Selling Price, Qty) */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        {/* Unit selector */}
                        <div className="relative">
                          <select
                            value={it.unit || 'Piece'}
                            onChange={(e) => updateItem(it.id, 'unit', e.target.value)}
                            className="w-full appearance-none py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white font-medium focus:outline-none focus:border-[#8075FF] cursor-pointer"
                          >
                            <option value="Piece">Piece</option>
                            <option value="Box">Box</option>
                            <option value="Carton">Carton</option>
                            <option value="Dozen">Dozen</option>
                            <option value="Kg">Kg</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Purchase Price */}
                        <div>
                          <input
                            type="number"
                            min="0"
                            placeholder="Purchase Price"
                            value={it.purchasePrice || ''}
                            onChange={(e) =>
                              updateItem(
                                it.id,
                                'purchasePrice',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#8075FF]"
                          />
                        </div>

                        {/* Selling Price */}
                        <div>
                          <input
                            type="number"
                            min="0"
                            placeholder="Selling Price"
                            value={it.sellingPrice || ''}
                            onChange={(e) =>
                              updateItem(
                                it.id,
                                'sellingPrice',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#8075FF]"
                          />
                        </div>

                        {/* Qty */}
                        <div>
                          <input
                            type="number"
                            min="1"
                            placeholder="Qty"
                            value={it.quantity || ''}
                            onChange={(e) =>
                              updateItem(
                                it.id,
                                'quantity',
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                            className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#8075FF]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Status & Purchase Date */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none py-3 px-4 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white font-medium focus:outline-none focus:border-[#8075FF] cursor-pointer"
                >
                  <option value="State Name">State Name</option>
                  <option value="Received">Received</option>
                  <option value="Ordered">Ordered</option>
                  <option value="Pending">Pending</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Purchase Date */}
              <div className="relative">
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white font-medium focus:outline-none focus:border-[#8075FF]"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Card 4: Payment Note Textarea */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
            <textarea
              rows={4}
              placeholder="Payment Note"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#8075FF] resize-y"
            />
          </div>

          {/* Card 5: Attach Document (matches dashed / rounded container) */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 flex flex-col items-center justify-center gap-2 hover:bg-slate-50/60 transition-colors cursor-pointer"
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const names = Array.from(e.target.files).map((f) => f.name);
                  setAttachedFiles((prev) => [...prev, ...names]);
                }
              }}
            />
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8075FF]">
              <Upload className="w-4 h-4" />
              <span>Attach Document</span>
            </div>
            {attachedFiles.length > 0 && (
              <p className="text-[11px] text-slate-500">
                {attachedFiles.length} file(s) selected: {attachedFiles.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Purchase Amount Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-800">Purchase Amount</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold text-slate-800">
                  ৳ {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsDiscountModalOpen(true)}
                  className="text-slate-800 underline hover:text-[#8075FF] cursor-pointer"
                >
                  Apply Discount
                </button>
                <span className="font-semibold text-slate-800">
                  ৳ {discount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Total box with subtle purple tint */}
            <div className="bg-[#f2f0ff] rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Total</span>
              <span className="font-bold text-[#8075FF]">
                ৳ {totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Card 2: Payment Account */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
            <div className="relative">
              <select
                value={paymentAccount}
                onChange={(e) => setPaymentAccount(e.target.value)}
                className="w-full appearance-none py-3 px-4 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white font-medium focus:outline-none focus:border-[#8075FF] cursor-pointer"
              >
                <option value="Payment Account" disabled>
                  Payment Account
                </option>
                <option value="Bank">Bank</option>
                <option value="Cash">Cash</option>
                <option value="Petty Cash">Petty Cash</option>
                <option value="bKash Merchant">bKash Merchant</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* Browse Products Modal */}
      {isBrowseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Browse Products</h3>
              <button
                type="button"
                onClick={() => setIsBrowseModalOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
              {products.map((p) => {
                const isSelected = items.some((it) => it.productId === p.id);
                return (
                  <div
                    key={p.id}
                    className="pt-2 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-100"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{p.name}</p>
                        <p className="text-[11px] text-[#8075FF] font-bold">
                          Cost: ৳ {p.costPrice || 1310} • Stock: {p.stock}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addProductToPurchase(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-[#8075FF] hover:bg-[#6e62ff] text-white shadow-2xs'
                      }`}
                    >
                      {isSelected ? 'Add More +' : '+ Add'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBrowseModalOpen(false)}
                className="px-5 py-2 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Discount Modal */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 overflow-hidden">
            <div
              className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(128,117,255,0.28) 0%, rgba(99,102,241,0.18) 50%, transparent 70%)',
                filter: 'blur(28px)',
              }}
            />

            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-sm font-bold text-slate-900">Purchase Discount</h3>
              <button
                type="button"
                onClick={() => setIsDiscountModalOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 relative z-10">
              <label className="block text-xs font-medium text-slate-700">
                Discount Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDiscountType('Fixed')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                    discountType === 'Fixed'
                      ? 'border-[#8075FF] bg-purple-50/50 text-[#8075FF]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      discountType === 'Fixed'
                        ? 'border-[#8075FF]'
                        : 'border-slate-300'
                    }`}
                  >
                    {discountType === 'Fixed' && (
                      <div className="w-2 h-2 rounded-full bg-[#8075FF]" />
                    )}
                  </div>
                  <span>Fixed</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDiscountType('Percentage')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                    discountType === 'Percentage'
                      ? 'border-[#8075FF] bg-purple-50/50 text-[#8075FF]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      discountType === 'Percentage'
                        ? 'border-[#8075FF]'
                        : 'border-slate-300'
                    }`}
                  >
                    {discountType === 'Percentage' && (
                      <div className="w-2 h-2 rounded-full bg-[#8075FF]" />
                    )}
                  </div>
                  <span>Percentage</span>
                </button>
              </div>
            </div>

            <div className="space-y-1 relative z-10">
              <input
                type="number"
                min="0"
                placeholder="Enter Discount Amount"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#8075FF]"
              />
              <p className="text-[11px] text-slate-400">
                Maximum allowed: ৳ {subtotal}
              </p>
            </div>

            <div className="pt-2 flex justify-end relative z-10">
              <button
                type="button"
                onClick={() => {
                  const val = parseFloat(discountInput);
                  if (!isNaN(val) && val >= 0) {
                    if (discountType === 'Fixed') {
                      setDiscount(Math.min(val, subtotal));
                    } else {
                      setDiscount(Math.min(Math.round((subtotal * val) / 100), subtotal));
                    }
                  }
                  setIsDiscountModalOpen(false);
                  setDiscountInput('');
                }}
                className="px-6 py-2 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm shadow-[#8075FF]/25 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

