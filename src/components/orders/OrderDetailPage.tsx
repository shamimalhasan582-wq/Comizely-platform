import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Printer,
  Check,
  Edit2,
  Copy,
  Plus,
  X,
} from 'lucide-react';
import { Order, OrderStatus, Product } from '../../types';
import { ShippingChargeModal, ShippingDetails } from './ShippingChargeModal';

interface OrderDetailPageProps {
  order: Order;
  products?: Product[];
  onBack: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder?: (orderId: string) => void;
  onUpdateOrder?: (updatedOrder: Order) => void;
}

interface TimelineItem {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({
  order,
  products = [],
  onBack,
  onUpdateStatus,
  onDeleteOrder,
  onUpdateOrder,
}) => {
  // Local state for editable order properties
  const [items, setItems] = useState(
    order.items && order.items.length > 0
      ? order.items
      : [
          {
            id: 'item-1',
            productId: 'p-1',
            name: 'Oraimo smart lite 2',
            sku: 'OSL-02',
            price: 1310,
            quantity: 1,
            image:
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80',
          },
          {
            id: 'item-2',
            productId: 'p-2',
            name: 'Oraimo smart lite 2',
            sku: 'OSL-02',
            price: 1310,
            quantity: 1,
            image:
              'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=150&q=80',
          },
          {
            id: 'item-3',
            productId: 'p-3',
            name: 'Oraimo smart lite 2',
            sku: 'OSL-02',
            price: 1310,
            quantity: 1,
            image:
              'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=150&q=80',
          },
        ]
  );

  const [shippingFee, setShippingFee] = useState<number>(order.shippingFee || 50);
  const [discount, setDiscount] = useState<number>(order.discount || 30);
  const [vatRate] = useState<number>(0);
  const [paymentStatus] = useState<string>(order.paymentStatus || 'Paid');
  const [courierName, setCourierName] = useState<string>(order.deliveryCourier || 'Steadfast');
  const [shopType] = useState<string>(order.branch || 'Online Store');

  // Customer Editable Details
  const [customerName, setCustomerName] = useState(order.customer?.name || 'MD Hasan Mahmud');
  const [customerPhone, setCustomerPhone] = useState(order.customer?.phone || '01800000000');
  const [customerEmail, setCustomerEmail] = useState(order.customer?.email || 'hasan789@gmail.com');
  const [shippingAddress, setShippingAddress] = useState(
    order.customer?.address || '2972 Westheimer Rd. Santa Ana, Illinois 85486'
  );
  const [billingAddress, setBillingAddress] = useState(
    order.customer?.address || '2972 Westheimer Rd. Santa Ana, Illinois 85486'
  );

  // Other Details
  const [orderNote, setOrderNote] = useState(
    order.notes || 'The order was updated from Approved to Processing status'
  );
  const [customerTag, setCustomerTag] = useState('Fraud');
  const [orderSource, setOrderSource] = useState('WhatsApp');

  // Editing modals / dialogs
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Dropdown states
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Modals
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountType, setDiscountType] = useState<'Fixed' | 'Percentage'>('Fixed');
  const [discountInput, setDiscountInput] = useState<string>('');
  const [isCourierScoreOpen, setIsCourierScoreOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [showPrintSlip, setShowPrintSlip] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Timeline
  const [commentInput, setCommentInput] = useState('');
  const [timelineEvents, setTimelineEvents] = useState<TimelineItem[]>([
    {
      id: '1',
      text: 'The order was updated from Approved to Processing status',
      timestamp: '1 Aug  2026, 3:30 PM',
      author: 'Shamim',
    },
    {
      id: '2',
      text: 'Need to cancel previous vendor order',
      timestamp: '1 Aug  2026, 3:30 PM',
      author: 'Shamim',
    },
    {
      id: '3',
      text: 'The order was updated from Approved to Processing status by Md Atiqur Rahman.',
      timestamp: '2 Aug 2026, 10:15 AM',
      author: 'Alex',
    },
    {
      id: '4',
      text: 'Update on project timeline',
      timestamp: '2 Aug 2026, 11:00 AM',
      author: 'Jamie',
    },
    {
      id: '5',
      text: 'Finalize budget allocations',
      timestamp: '3 Aug 2026, 9:00 AM',
      author: 'Priya',
    },
  ]);

  const printRef = useRef<HTMLDivElement>(null);
  const moreActionsRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (printRef.current && !printRef.current.contains(e.target as Node)) {
        setIsPrintOpen(false);
      }
      if (moreActionsRef.current && !moreActionsRef.current.contains(e.target as Node)) {
        setIsMoreActionsOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculations
  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const vatAmount = Math.round((subtotal * vatRate) / 100);
  const totalAmount = Math.max(0, subtotal + shippingFee - discount + vatAmount);
  const paidAmount = paymentStatus === 'Paid' ? totalAmount : 0;
  const dueAmount = totalAmount - paidAmount;
  const totalQuantity = items.reduce((acc, it) => acc + it.quantity, 0);

  // Remove Item
  const handleRemoveItem = (itemId: string) => {
    if (items.length <= 1) {
      alert('Order must contain at least one item');
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  // Add Comment
  const handlePostComment = () => {
    if (!commentInput.trim()) return;
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', {
      month: 'short',
    })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newItem: TimelineItem = {
      id: Date.now().toString(),
      text: commentInput.trim(),
      timestamp: formattedDate,
      author: 'Shamim',
    };
    setTimelineEvents([newItem, ...timelineEvents]);
    setCommentInput('');
  };

  // Copy address
  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  // Save edited customer/other field
  const handleSaveField = () => {
    if (!editingField) return;
    if (editingField === 'name') setCustomerName(editValue);
    if (editingField === 'phone') setCustomerPhone(editValue);
    if (editingField === 'email') setCustomerEmail(editValue);
    if (editingField === 'shippingAddress') setShippingAddress(editValue);
    if (editingField === 'billingAddress') setBillingAddress(editValue);
    if (editingField === 'note') setOrderNote(editValue);
    if (editingField === 'customerTag') setCustomerTag(editValue);
    if (editingField === 'source') setOrderSource(editValue);
    setEditingField(null);
  };

  const openEditModal = (fieldName: string, currentVal: string) => {
    setEditingField(fieldName);
    setEditValue(currentVal);
  };

  return (
    <div className="py-6 md:py-8 px-4 sm:px-8 xl:px-[233px] bg-[#F2F2F2] rounded-tl-[36px] md:rounded-tl-[40px] min-h-screen">
      <div className="max-w-[1200px] w-full mx-auto space-y-6">
        {/* Top Bar (matches screenshot) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Back Button + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
            Order Details
          </h1>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Order Attribution */}
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
          >
            Order Attribution
          </button>

          {/* Print Dropdown */}
          <div className="relative" ref={printRef}>
            <button
              onClick={() => setIsPrintOpen(!isPrintOpen)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
            >
              <span>Print</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isPrintOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 text-xs">
                <button
                  onClick={() => {
                    setIsPrintOpen(false);
                    setShowPrintSlip(true);
                  }}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer"
                >
                  Print Invoice Slip
                </button>
                <button
                  onClick={() => {
                    setIsPrintOpen(false);
                    window.print();
                  }}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer"
                >
                  Print Packing Slip
                </button>
                <button
                  onClick={() => {
                    setIsPrintOpen(false);
                    window.print();
                  }}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer"
                >
                  Print Shipping Label
                </button>
              </div>
            )}
          </div>

          {/* More Actions Dropdown */}
          <div className="relative" ref={moreActionsRef}>
            <button
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
            >
              <span>More Actions</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isMoreActionsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 text-xs">
                <button
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    alert(`Order ${order.orderNumber} duplicated as new draft.`);
                  }}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer"
                >
                  Duplicate Order
                </button>
                <button
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    onUpdateStatus(order.id, 'Cancelled');
                  }}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer"
                >
                  Cancel Order
                </button>
                {onDeleteOrder && (
                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      if (confirm('Are you sure you want to delete this order?')) {
                        onDeleteOrder(order.id);
                      }
                    }}
                    className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    Delete Order
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mark as Status Dropdown (Primary styled button) */}
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
            >
              <span>Mark as {order.status}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 text-xs">
                {(
                  [
                    'Pending',
                    'Approved',
                    'Processing',
                    'Ready to ship',
                    'Completed',
                    'Hold',
                    'Cancelled',
                  ] as OrderStatus[]
                ).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      onUpdateStatus(order.id, st);
                      setIsStatusDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left flex items-center justify-between hover:bg-purple-50 hover:text-purple-700 cursor-pointer ${
                      order.status === st ? 'text-[#8075FF] font-bold bg-purple-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>Mark as {st}</span>
                    {order.status === st && <Check className="w-3.5 h-3.5 text-[#8075FF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Order Details & Products Table (matches image) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-5">
            {/* Header: Order Number and Badges */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {order.orderNumber || '#257849'}
              </h2>

              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full border border-rose-300 text-rose-500 bg-rose-50/50 text-xs font-semibold">
                  Due
                </span>
                <span className="px-3 py-0.5 rounded-full border border-emerald-400 text-emerald-600 bg-emerald-50/50 text-xs font-semibold">
                  Completed
                </span>
              </div>
            </div>

            {/* 4 Info Boxes in a Grid Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Order Date */}
              <div className="p-3 rounded-2xl border border-slate-100 bg-white">
                <span className="text-[11px] text-slate-400 font-medium block">Order Date</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block truncate">
                  {order.createdAt || '12 Jun 2026, 3:50 PM'}
                </span>
              </div>

              {/* Qty */}
              <div className="p-3 rounded-2xl border border-slate-100 bg-white">
                <span className="text-[11px] text-slate-400 font-medium block">Qty</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block">
                  {totalQuantity} Items
                </span>
              </div>

              {/* Courier */}
              <div className="p-3 rounded-2xl border border-slate-100 bg-white">
                <span className="text-[11px] text-slate-400 font-medium block">Courier</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block truncate">
                  {courierName}
                </span>
              </div>

              {/* Shop Type */}
              <div className="p-3 rounded-2xl border border-slate-100 bg-white">
                <span className="text-[11px] text-slate-400 font-medium block">Shop Type</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block truncate">
                  {shopType}
                </span>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-700 font-semibold bg-slate-50/40">
                    <th className="py-2.5 px-4 font-semibold">Product</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Qty</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Product Name & Image */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.image ||
                              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'
                            }
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-slate-800 text-xs leading-snug">
                              {item.name}
                            </p>
                            <p className="text-xs font-bold text-[#8075FF] mt-0.5">
                              ৳ {item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Qty */}
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                        {item.quantity}
                      </td>

                      {/* Amount and remove icon */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <span className="font-semibold text-slate-800">
                            ৳ {(item.price * item.quantity).toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            title="Remove product"
                            className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer text-base leading-none"
                          >
                            ×
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Product Button (matches dashed/light border in image) */}
            <div>
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(true)}
                className="w-full py-2.5 rounded-2xl border border-slate-200/90 hover:border-[#8075FF] text-[#8075FF] hover:bg-purple-50/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Card 2: Timeline Card (matches screenshot) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Timeline</h3>

            {/* Comment Box Container */}
            <div>
              <div className="border border-slate-200 rounded-2xl p-3.5 bg-white focus-within:border-[#8075FF] transition-colors">
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Leave a comment..."
                  rows={3}
                  className="w-full text-xs text-slate-800 placeholder:text-slate-400 outline-none resize-none"
                />
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handlePostComment}
                    disabled={!commentInput.trim()}
                    className="px-5 py-1.5 bg-[#8075FF] hover:bg-[#6e62ff] disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-right mt-1.5">
                Only you and other staff can see comments
              </p>
            </div>

            {/* Vertical Timeline Feed */}
            <div className="space-y-4 pt-2">
              {timelineEvents.map((ev) => (
                <div key={ev.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#8075FF] mt-1 shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {ev.text}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{ev.timestamp}</span>
                      <span className="font-semibold text-slate-500">{ev.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Payment Details Card (matches screenshot) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Payment Details</h3>

            {/* 2 Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setIsShippingModalOpen(true)}
                className="py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 rounded-xl text-xs font-semibold text-center transition-colors cursor-pointer shadow-2xs"
              >
                Shipping charge
              </button>

              <button
                type="button"
                onClick={() => setIsDiscountModalOpen(true)}
                className="py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 rounded-xl text-xs font-semibold text-center transition-colors cursor-pointer shadow-2xs"
              >
                Apply discount
              </button>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-xs">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ৳{subtotal.toFixed(2)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600">Shipping</span>
                  {shippingFee > 0 && (
                    <button
                      onClick={() => setShippingFee(0)}
                      title="Remove shipping fee"
                      className="text-slate-400 hover:text-rose-500 cursor-pointer text-xs leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>
                <span className="font-semibold text-slate-900">
                  ৳{shippingFee.toFixed(2)}
                </span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600">Discount</span>
                  {discount > 0 && (
                    <button
                      onClick={() => setDiscount(0)}
                      title="Remove discount"
                      className="text-slate-400 hover:text-rose-500 cursor-pointer text-xs leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>
                <span className="font-semibold text-slate-900">
                  ৳{discount.toFixed(2)}
                </span>
              </div>

              {/* VAT (0%) */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">VAT ({vatRate}%)</span>
                <span className="font-semibold text-slate-900">
                  ৳{vatAmount.toFixed(2)}
                </span>
              </div>

              {/* Paid */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Paid</span>
                <span className="font-semibold text-slate-900">
                  ৳{paidAmount.toFixed(2)}
                </span>
              </div>

              {/* Due */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Due</span>
                <span className="font-semibold text-rose-500">
                  ৳{dueAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Total Row */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Total</span>
              <span className="text-base font-extrabold text-[#8075FF]">
                ৳{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Card 2: Customer Details Card (matches screenshot) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Customer Details</h3>
              <button
                type="button"
                onClick={() => {}}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Order Acceptation Rate Gauge (exact replica) */}
            <div className="space-y-2 pt-1 pb-2">
              <p className="text-xs font-bold text-slate-800 text-center">
                Order Acceptation Rate
              </p>

              {/* Semi-circular gauge */}
              <div className="relative w-44 h-24 mx-auto flex items-end justify-center">
                <svg className="w-44 h-24 overflow-visible" viewBox="0 0 160 85">
                  {/* Background Track Arc */}
                  <path
                    d="M 15 80 A 65 65 0 0 1 145 80"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Foreground Filled Arc (70%) */}
                  <path
                    d="M 15 80 A 65 65 0 0 1 145 80"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="12"
                    strokeDasharray="204.2"
                    strokeDashoffset={204.2 * (1 - 0.7)}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Gauge Center Text */}
                <div className="absolute bottom-1 flex items-baseline">
                  <span className="text-3xl font-extrabold text-slate-900">70</span>
                  <span className="text-sm text-slate-500 font-semibold ml-0.5">%</span>
                </div>
              </div>

              {/* Gauge description */}
              <p className="text-[11px] text-slate-400 text-center px-4 leading-relaxed">
                Based on historical delivery acceptance rate across all partner couriers
              </p>

              {/* View Courier Score Button */}
              <button
                type="button"
                onClick={() => setIsCourierScoreOpen(true)}
                className="px-4 py-1.5 bg-[#8075FF]/10 text-[#8075FF] hover:bg-[#8075FF]/20 rounded-xl text-xs font-semibold mx-auto flex items-center justify-center transition-colors cursor-pointer mt-2"
              >
                View Courier Score
              </button>
            </div>

            {/* Customer Info Fields with Pencil edit icons */}
            <div className="space-y-3 pt-2 text-xs">
              {/* Name */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Name</span>
                  <span className="font-semibold text-slate-800">{customerName}</span>
                </div>
                <button
                  onClick={() => openEditModal('name', customerName)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Phone</span>
                  <span className="font-semibold text-slate-800">{customerPhone}</span>
                </div>
                <button
                  onClick={() => openEditModal('phone', customerPhone)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Email</span>
                  <span className="font-semibold text-slate-800">{customerEmail}</span>
                </div>
                <button
                  onClick={() => openEditModal('email', customerEmail)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Shipping Address */}
              <div className="flex items-start justify-between">
                <div className="pr-2">
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Shipping Address
                  </span>
                  <span className="font-semibold text-slate-800 leading-snug">
                    {shippingAddress}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                  <button
                    onClick={() => openEditModal('shippingAddress', shippingAddress)}
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCopyAddress(shippingAddress)}
                    title="Copy address"
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Billing Address */}
              <div className="flex items-start justify-between">
                <div className="pr-2">
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Billing Address
                  </span>
                  <span className="font-semibold text-slate-800 leading-snug">
                    {billingAddress}
                  </span>
                </div>
                <button
                  onClick={() => openEditModal('billingAddress', billingAddress)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer shrink-0 pt-0.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Other Details Card (matches screenshot) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900">Other Details</h3>

            {/* Note */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Note</span>
                <button
                  onClick={() => openEditModal('note', orderNote)}
                  className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{orderNote}</p>
            </div>

            {/* Customer Tag */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Customer Tag</span>
                <button
                  onClick={() => openEditModal('customerTag', customerTag)}
                  className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs font-medium text-slate-700">{customerTag}</p>
            </div>

            {/* Source */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Source</span>
                <button
                  onClick={() => openEditModal('source', orderSource)}
                  className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs font-medium text-slate-700">{orderSource}</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* Shipping Charge Modal */}
      <ShippingChargeModal
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
        currentCharge={shippingFee}
        currentPartner={courierName}
        onSave={(details: ShippingDetails) => {
          setShippingFee(details.charge);
          if (details.partner) setCourierName(details.partner);
          setIsShippingModalOpen(false);
        }}
      />

      {/* Overall Discount Modal (matches standard modal style) */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 overflow-hidden">
            {/* Top-left blur mesh */}
            <div
              className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(128,117,255,0.28) 0%, rgba(99,102,241,0.18) 50%, transparent 70%)',
                filter: 'blur(28px)',
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-sm font-bold text-slate-900">Overall Discount</h3>
              <button
                type="button"
                onClick={() => setIsDiscountModalOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Discount Type Radio Selector */}
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

            {/* Input */}
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

            {/* Save Button */}
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

      {/* Courier Score Modal */}
      {isCourierScoreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 overflow-hidden">
            {/* Top-left blur mesh */}
            <div
              className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(128,117,255,0.28) 0%, rgba(99,102,241,0.18) 50%, transparent 70%)',
                filter: 'blur(28px)',
              }}
            />

            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-sm font-bold text-slate-900">
                Courier Historical Performance
              </h3>
              <button
                type="button"
                onClick={() => setIsCourierScoreOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs relative z-10">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <span className="font-bold text-emerald-800">Overall Success Rate: 70%</span>
                <p className="text-emerald-700 text-[11px] mt-0.5">
                  Customer has successfully accepted and paid for 14 out of 20 dispatched shipments across partner courier networks.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="font-semibold text-slate-700">Steadfast Courier</span>
                  <span className="text-emerald-600 font-bold">85% Delivery Rate</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="font-semibold text-slate-700">RedX Logistics</span>
                  <span className="text-emerald-600 font-bold">75% Delivery Rate</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="font-semibold text-slate-700">Pathao Express</span>
                  <span className="text-amber-600 font-bold">60% Delivery Rate</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end relative z-10">
              <button
                type="button"
                onClick={() => setIsCourierScoreOpen(false)}
                className="px-5 py-2 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm shadow-[#8075FF]/25"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Field Modal */}
      {editingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 capitalize">
                Edit {editingField}
              </h3>
              <button
                onClick={() => setEditingField(null)}
                className="w-7 h-7 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {editingField === 'shippingAddress' || editingField === 'billingAddress' || editingField === 'note' ? (
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#8075FF]"
              />
            ) : (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#8075FF]"
              />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingField(null)}
                className="px-4 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveField}
                className="px-5 py-1.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Product to Order</h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
              {(products.length > 0
                ? products
                : [
                    {
                      id: 'p-new-1',
                      name: 'Oraimo smart lite 2',
                      sku: 'OSL-02',
                      category: 'Accessories',
                      price: 1310,
                      costPrice: 800,
                      stock: 25,
                      status: 'In Stock' as const,
                      image:
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80',
                    },
                    {
                      id: 'p-new-2',
                      name: 'Cotton Casual Shirt - Navy Blue',
                      sku: 'CC5-NB-01',
                      category: 'Men Fashion',
                      price: 1500,
                      costPrice: 900,
                      stock: 30,
                      status: 'In Stock' as const,
                      image:
                        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=150&q=80',
                    },
                    {
                      id: 'p-new-3',
                      name: 'Wireless Bluetooth Headphones',
                      sku: 'WBH-450',
                      category: 'Electronics',
                      price: 2450,
                      costPrice: 1500,
                      stock: 15,
                      status: 'In Stock' as const,
                      image:
                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80',
                    },
                  ]
              ).map((prod) => (
                <div
                  key={prod.id}
                  className="pt-2 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-100"
                    />
                    <div>
                      <p className="font-semibold text-xs text-slate-800">{prod.name}</p>
                      <p className="text-[11px] text-[#8075FF] font-bold">
                        ৳ {prod.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setItems((prev) => [
                        ...prev,
                        {
                          id: `item-${Date.now()}`,
                          productId: prod.id,
                          name: prod.name,
                          sku: prod.sku,
                          price: prod.price,
                          quantity: 1,
                          image: prod.image,
                        },
                      ]);
                      setIsAddProductModalOpen(false);
                    }}
                    className="px-3 py-1.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                  >
                    + Add
                  </button>
                </div>
              ))}
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
                Official Order Packing Slip
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
                  BIPONIL COMMERCE HUB
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Order #{order.orderNumber} • Date: {order.createdAt}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="font-bold text-slate-700 block">Deliver To:</span>
                  <p className="text-slate-600">{customerName}</p>
                  <p className="text-slate-600">{customerPhone}</p>
                  <p className="text-slate-500">{shippingAddress}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-700 block">Courier:</span>
                  <p className="text-slate-600">{courierName}</p>
                  <p className="text-slate-600">Total Items: {totalQuantity}</p>
                  <p className="font-bold text-slate-900 mt-1">
                    Amount: ৳{totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-1">Item</th>
                      <th className="pb-1 text-center">Qty</th>
                      <th className="pb-1 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => (
                      <tr key={it.id}>
                        <td className="py-1 truncate max-w-[150px]">{it.name}</td>
                        <td className="py-1 text-center">{it.quantity}</td>
                        <td className="py-1 text-right">
                          ৳{(it.price * it.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPrintSlip(false)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600"
              >
                Close
              </button>
              <button
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

      {/* Copied Address Toast */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-60 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg animate-in fade-in">
          Address copied to clipboard!
        </div>
      )}
    </div>
  );
};
