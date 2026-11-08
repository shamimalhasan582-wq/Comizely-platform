import React, { useState } from 'react';
import { X, Plus, Trash2, ShoppingBag, User, MapPin, CreditCard } from 'lucide-react';
import { Order, Product, OrderItem, OrderStatus } from '../../types';
import { branchesList } from '../../data/mockData';
import { calculateOrderSubtotal, calculateOrderTotal, formatCurrency } from '../../utils/orderUtils';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onCreateOrder: (order: Order) => void;
  lastOrderNumber: string;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  products,
  onCreateOrder,
  lastOrderNumber,
}) => {
  // Extract number from "#21529" -> 21530
  const nextNum = parseInt(lastOrderNumber.replace(/\D/g, '') || '21547', 10) + 1;
  const newOrderNumStr = `#${nextNum}`;

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [branch, setBranch] = useState(branchesList[0]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash' | 'Credit Card' | 'Nagad'>('Cash on Delivery');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Unpaid' | 'Partially Paid'>('Unpaid');
  const [initialStatus, setInitialStatus] = useState<OrderStatus>('Pending');
  const [shippingFee, setShippingFee] = useState<number>(60);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<
    { product: Product; quantity: number }[]
  >([
    {
      product: products[0] || {
        id: 'p-default',
        name: 'Cotton Casual Shirt - Navy Blue',
        price: 1310,
        sku: 'CCS-NB-01',
        category: 'Men Fashion',
        costPrice: 850,
        stock: 50,
        status: 'In Stock',
        image: '',
      },
      quantity: 1,
    },
  ]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddItem = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const exists = selectedItems.find((i) => i.product.id === productId);
    if (exists) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { product: prod, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setSelectedItems(
      selectedItems
        .map((i) => {
          if (i.product.id === productId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as { product: Product; quantity: number }[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.product.id !== productId));
  };

  const subtotal = calculateOrderSubtotal(
    selectedItems.map((i) => ({ price: i.product.price, quantity: i.quantity }))
  );
  const totalAmount = calculateOrderTotal(subtotal, shippingFee, discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Please provide customer name');
      return;
    }
    if (!customerPhone.trim()) {
      setError('Please provide contact phone number');
      return;
    }
    if (selectedItems.length === 0) {
      setError('Please add at least one product item');
      return;
    }

    const orderItems: OrderItem[] = selectedItems.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      productId: item.product.id,
      name: item.product.name,
      sku: item.product.sku,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} , ${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumStr,
      customer: {
        id: `cust-${Date.now()}`,
        name: customerName.trim(),
        email: customerEmail.trim() || 'customer@example.com',
        phone: customerPhone.trim(),
        address: address.trim() || 'Dhaka, Bangladesh',
        city,
      },
      branch,
      items: orderItems,
      subtotal,
      shippingFee,
      discount,
      totalAmount,
      status: initialStatus,
      paymentMethod,
      paymentStatus,
      createdAt: formattedDate,
      notes: notes.trim() || undefined,
    };

    onCreateOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
              <span>Create New Order</span>
              <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full ml-2">
                {newOrderNumStr}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Fill order and customer specifications</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Customer Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MR MD Saidur Rahman"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +880 1712-345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="customer@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 bg-white"
                >
                  {branchesList.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Address & City
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="House, Road, Area..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="col-span-2 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                  />
                  <input
                    type="text"
                    placeholder="City (Dhaka)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Items Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5" /> Order Items ({selectedItems.length})
              </h3>
              {/* Add product dropdown */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddItem(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
              >
                <option value="" disabled>
                  + Add Product...
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.price} BDT
                  </option>
                ))}
              </select>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {selectedItems.map((item) => (
                <div key={item.product.id} className="p-3 flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.product.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=100&q=80'}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-slate-800 text-xs truncate">{item.product.name}</p>
                      <p className="text-[11px] text-slate-400">{item.product.sku} • {item.product.price} BDT</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.product.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.product.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-16 text-right font-bold text-slate-800 text-xs">
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financials & Order Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Status
              </label>
              <select
                value={initialStatus}
                onChange={(e) => setInitialStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Processing">Processing</option>
                <option value="Follow Up">Follow Up</option>
                <option value="Hold">Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shipping Fee (BDT)
              </label>
              <input
                type="number"
                min="0"
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Discount (BDT)
              </label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Order Notes</label>
              <textarea
                rows={2}
                placeholder="Special delivery instructions or size notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Total Calculation Card */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">{formatCurrency(subtotal)} BDT</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-slate-800">+{formatCurrency(shippingFee)} BDT</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-semibold">-{formatCurrency(discount)} BDT</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
              <span>Grand Total</span>
              <span className="text-purple-700 text-base">{formatCurrency(totalAmount)} BDT</span>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-[#8075FF] hover:bg-[#6e62ff] text-white font-semibold shadow-md shadow-[#8075FF]/25 transition-all cursor-pointer hover:shadow-lg active:scale-98"
            >
              Confirm & Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
