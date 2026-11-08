import React, { useState } from 'react';
import {
  X,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  User,
  Share2,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { getStatusBadgeClasses, formatCurrency } from '../../utils/orderUtils';

interface OrderDetailDrawerProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  const [showPrintSlip, setShowPrintSlip] = useState(false);

  if (!order) return null;

  const badge = getStatusBadgeClasses(order.status);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/35 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{order.orderNumber}</h2>
                <span
                  className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Placed on {order.createdAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintSlip(true)}
              title="Print Packing Slip"
              className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close details"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Quick Status Control Bar */}
          <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-3 flex items-center justify-between">
            <span className="text-xs font-medium text-purple-900">Change Order Status:</span>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
              className="text-xs font-semibold bg-white border border-purple-200 text-purple-700 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              <option value="Hold">Hold</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Processing">Processing</option>
              <option value="Ready to ship">Ready to ship</option>
              <option value="Completed">Completed</option>
              <option value="Follow Up">Follow Up</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Customer Summary Card */}
          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Customer & Delivery Details
            </h3>

            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-slate-900 text-sm">{order.customer.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{order.customer.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{order.customer.email}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                  {order.branch}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-start gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <span>
                {order.customer.address}, {order.customer.city}
              </span>
            </div>
          </div>

          {/* Order Items List */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Package className="w-3.5 h-3.5" /> Ordered Products ({order.items.length})
            </h3>

            <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                    />
                    <div>
                      <p className="font-semibold text-slate-800 text-xs">{item.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        SKU: {item.sku} • Qty: {item.quantity} × {formatCurrency(item.price)} BDT
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-bold text-slate-900 text-xs">
                    {formatCurrency(item.price * item.quantity)} BDT
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment and Financial Breakdown */}
          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/40 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5" /> Billing & Payment
            </h3>

            <div className="flex justify-between text-xs text-slate-600">
              <span>Payment Method</span>
              <span className="font-semibold text-slate-800">{order.paymentMethod}</span>
            </div>

            <div className="flex justify-between text-xs text-slate-600">
              <span>Payment Status</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  order.paymentStatus === 'Paid'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>

            <div className="border-t border-slate-200/60 my-2" />

            <div className="flex justify-between text-xs text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">{formatCurrency(order.subtotal)} BDT</span>
            </div>

            <div className="flex justify-between text-xs text-slate-600">
              <span>Shipping Fee</span>
              <span className="font-semibold text-slate-800">+{formatCurrency(order.shippingFee)} BDT</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600">
                <span>Discount</span>
                <span className="font-semibold">-{formatCurrency(order.discount)} BDT</span>
              </div>
            )}

            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Payable</span>
              <span className="text-purple-700 text-base">{formatCurrency(order.totalAmount)} BDT</span>
            </div>
          </div>

          {/* Logistics & Tracking Timeline */}
          <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-3.5 h-3.5" /> Delivery & Courier
            </h3>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Assigned Courier:</span>
              <span className="font-semibold text-slate-800">
                {order.deliveryCourier || 'Steadfast Express Logistics'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Tracking Code:</span>
              <span className="font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                {order.trackingNumber || `TRK-${order.orderNumber.replace('#', '')}`}
              </span>
            </div>

            {/* Timeline steps */}
            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Order Created ({order.createdAt})</span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  order.status !== 'Pending' ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Order Verified & Branch Assigned</span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  order.status === 'Completed' || order.status === 'Ready to ship'
                    ? 'text-emerald-600'
                    : 'text-slate-400'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0" />
                <span>Handover to Courier Partner</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-800">
              <span className="font-bold">Order Note: </span>
              {order.notes}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            onClick={() => setShowPrintSlip(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Invoice Slip</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-xs font-semibold shadow-sm shadow-[#8075FF]/25 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>

      {/* Printable Invoice Slip Modal */}
      {showPrintSlip && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900">Biponil.com Invoice</span>
                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-mono font-bold">
                  {order.orderNumber}
                </span>
              </div>
              <button
                onClick={() => setShowPrintSlip(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-slate-800">Bill To:</p>
                  <p>{order.customer.name}</p>
                  <p>{order.customer.phone}</p>
                  <p>{order.customer.address}, {order.customer.city}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">Store / Branch:</p>
                  <p>{order.branch}</p>
                  <p>Date: {order.createdAt}</p>
                  <p>Payment: {order.paymentMethod}</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden mt-3">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 border-b">
                    <tr>
                      <th className="p-2">Item</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.items.map((it) => (
                      <tr key={it.id}>
                        <td className="p-2">{it.name}</td>
                        <td className="p-2 text-center">{it.quantity}</td>
                        <td className="p-2 text-right">{it.price} BDT</td>
                        <td className="p-2 text-right font-medium">{it.price * it.quantity} BDT</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-1 text-right pt-2 border-t">
                <p>Subtotal: {formatCurrency(order.subtotal)} BDT</p>
                <p>Delivery: {formatCurrency(order.shippingFee)} BDT</p>
                {order.discount > 0 && <p className="text-emerald-600">Discount: -{formatCurrency(order.discount)} BDT</p>}
                <p className="font-bold text-sm text-slate-900 pt-1">
                  Grand Total: {formatCurrency(order.totalAmount)} BDT
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
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
    </div>
  );
};
