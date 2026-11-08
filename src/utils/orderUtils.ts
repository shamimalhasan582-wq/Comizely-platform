import { Order, OrderStatus } from '../types';

export function getStatusBadgeClasses(status: OrderStatus): { bg: string; text: string; border: string } {
  switch (status) {
    case 'Hold':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-300',
      };
    case 'Completed':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-300',
      };
    case 'Processing':
      return {
        bg: 'bg-indigo-50/70',
        text: 'text-indigo-600',
        border: 'border-indigo-200',
      };
    case 'Follow Up':
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        border: 'border-slate-200',
      };
    case 'Approved':
      return {
        bg: 'bg-teal-50/70',
        text: 'text-teal-600',
        border: 'border-teal-300',
      };
    case 'Ready to ship':
      return {
        bg: 'bg-purple-50/70',
        text: 'text-purple-600',
        border: 'border-purple-200',
      };
    case 'Pending':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        border: 'border-orange-200/80',
      };
    case 'Cancelled':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        border: 'border-rose-200/80',
      };
    case 'Returned':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200/80',
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        border: 'border-gray-200',
      };
  }
}

export function filterOrdersByTab(orders: Order[], activeTab: string): Order[] {
  if (activeTab === 'All') return orders;
  if (activeTab === 'Pending') return orders.filter((o) => o.status === 'Pending');
  if (activeTab === 'Follow Up') return orders.filter((o) => o.status === 'Follow Up');
  if (activeTab === 'Approved') return orders.filter((o) => o.status === 'Approved');
  if (activeTab === 'Processing') return orders.filter((o) => o.status === 'Processing');
  if (activeTab === 'Ready to ship') return orders.filter((o) => o.status === 'Ready to ship');
  if (activeTab === 'Hold') return orders.filter((o) => o.status === 'Hold');
  if (activeTab === 'Completed') return orders.filter((o) => o.status === 'Completed');
  if (activeTab === 'Cancelled') return orders.filter((o) => o.status === 'Cancelled');
  return orders;
}

export function searchOrders(orders: Order[], query: string): Order[] {
  if (!query.trim()) return orders;
  const q = query.toLowerCase().trim();
  return orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(q) ||
      order.customer.name.toLowerCase().includes(q) ||
      order.customer.phone.toLowerCase().includes(q) ||
      order.branch.toLowerCase().includes(q)
  );
}

export function calculateOrderSubtotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.price * Math.max(1, item.quantity), 0);
}

export function calculateOrderTotal(subtotal: number, shipping: number, discount: number): number {
  return Math.max(0, subtotal + shipping - discount);
}

export function getTabCount(orders: Order[], status: OrderStatus | 'All'): number {
  if (status === 'All') return orders.length;
  return orders.filter((o) => o.status === status).length;
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US');
}

export function validateNewOrder(data: {
  customerName: string;
  phone: string;
  items: { productId: string; quantity: number }[];
}): { isValid: boolean; error?: string } {
  if (!data.customerName.trim()) {
    return { isValid: false, error: 'Customer name is required' };
  }
  if (!data.phone.trim()) {
    return { isValid: false, error: 'Customer phone number is required' };
  }
  if (!data.items || data.items.length === 0) {
    return { isValid: false, error: 'At least one item must be added to the order' };
  }
  return { isValid: true };
}
