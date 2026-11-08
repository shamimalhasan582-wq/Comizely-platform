export type OrderStatus =
  | 'Hold'
  | 'Completed'
  | 'Processing'
  | 'Follow Up'
  | 'Approved'
  | 'Ready to ship'
  | 'Pending'
  | 'Cancelled'
  | 'Returned';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. #21529
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  branch: string; // e.g. "Online Shop", "Dhaka Flagship", "Chittagong Hub"
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number; // e.g. 1310
  status: OrderStatus;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Credit Card' | 'Nagad';
  paymentStatus: 'Paid' | 'Unpaid' | 'Partially Paid' | 'Refunded';
  createdAt: string; // e.g. "28 Jul , 2026 9:06 PM"
  notes?: string;
  trackingNumber?: string;
  deliveryCourier?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  companyName?: string;
  address?: string;
  country?: string;
  division?: string;
  district?: string;
  area?: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  tier: 'VIP' | 'Regular' | 'New';
  totalSale?: number;
  salePaid?: number;
  saleDue?: number;
  totalSaleReturn?: number;
  history?: {
    id: string;
    date: string;
    invoiceNo: string;
    branch: string;
    totalAmount: number;
    totalPaid: number;
    sellDue: number;
    status: string;
  }[];
}

export interface CustomerTag {
  id: string;
  name: string;
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  orderNumber: string;
  customerName: string;
  reason: string;
  refundAmount: number;
  status: 'Requested' | 'Approved' | 'Rejected' | 'Refunded';
  createdAt: string;
}

export interface IncompleteOrder {
  id: string;
  customerName: string;
  phone: string;
  cartItemsCount: number;
  cartTotal: number;
  abandonedAt: string;
  recoverySent: boolean;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  image: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  subtotal: number;
  discount: number;
  totalPrice: number;
}

export interface PurchaseTransaction {
  id: string;
  trxId: string;
  accountName: string;
  postBalance: number;
  amount: number;
  type: string;
  transactionFor: string;
  paidAt: string;
  note: string;
}

export interface Purchase {
  id: string;
  invoiceNo: string;
  supplier: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  branch: string;
  items: PurchaseItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  returnPaidAmount: number;
  status: string;
  paymentStatus: string;
  paymentAccount?: string;
  paymentNote?: string;
  purchaseDate: string;
  transactions: PurchaseTransaction[];
  attachedDocuments?: string[];
}

export interface PurchaseReturn {
  id: string;
  date: string;
  invoiceNo: string;
  status: 'Pending' | 'Complete' | 'Cancelled';
  branch: string;
  supplier: {
    id: string;
    name: string;
  };
  refundAmount: number;
  paidAmount: number;
  duePayment: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
}

export interface SupplierItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  address: string;
  country?: string;
  division?: string;
  district?: string;
  area?: string;
  totalPurchase: number;
  purchasePaid: number;
  purchaseDue: number;
  totalPurchaseReturn: number;
  history?: {
    id: string;
    date: string;
    invoiceNo: string;
    branch: string;
    contactNumber: string;
    totalAmount: number;
    totalPaid: number;
    purchaseDue: number;
  }[];
}

export type ActiveNav =
  | 'dashboard'
  | 'orders'
  | 'create-order'
  | 'order-return'
  | 'incomplete-orders'
  | 'draft-orders'
  | 'products'
  | 'purchases'
  | 'create-purchase'
  | 'purchase-returns'
  | 'suppliers'
  | 'customers'
  | 'customer-tags'
  | 'my-tasks'
  | 'accounts'
  | 'reports'
  | 'online-store'
  | 'settings';
