import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getStatusBadgeClasses,
  filterOrdersByTab,
  searchOrders,
  calculateOrderSubtotal,
  calculateOrderTotal,
  validateNewOrder,
} from './orderUtils';
import { Order } from '../types';

const mockSampleOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#21529',
    customer: {
      id: 'c1',
      name: 'MR MD Saidur Rahman',
      email: 'saidur@example.com',
      phone: '01712345678',
      address: 'House 12, Road 4, Dhanmondi',
      city: 'Dhaka',
    },
    branch: 'Online Shop',
    items: [{ id: 'i1', productId: 'p1', name: 'Cotton Shirt', sku: 'CS-01', price: 1310, quantity: 1 }],
    subtotal: 1310,
    shippingFee: 0,
    discount: 0,
    totalAmount: 1310,
    status: 'Hold',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Unpaid',
    createdAt: '28 Jul , 2026 9:06 PM',
  },
  {
    id: '2',
    orderNumber: '#21530',
    customer: {
      id: 'c2',
      name: 'Farhana Ahmed',
      email: 'farhana@example.com',
      phone: '01899999999',
      address: 'Banani',
      city: 'Dhaka',
    },
    branch: 'Dhaka Outlet',
    items: [{ id: 'i2', productId: 'p2', name: 'Denim Jeans', sku: 'DJ-02', price: 2200, quantity: 1 }],
    subtotal: 2200,
    shippingFee: 60,
    discount: 100,
    totalAmount: 2160,
    status: 'Completed',
    paymentMethod: 'bKash',
    paymentStatus: 'Paid',
    createdAt: '28 Jul , 2026 8:30 PM',
  },
];

test('getStatusBadgeClasses returns correct colors for Hold and Completed', () => {
  const hold = getStatusBadgeClasses('Hold');
  assert.equal(hold.bg, 'bg-amber-50');
  assert.equal(hold.text, 'text-amber-600');

  const completed = getStatusBadgeClasses('Completed');
  assert.equal(completed.bg, 'bg-emerald-50');
  assert.equal(completed.text, 'text-emerald-600');
});

test('filterOrdersByTab correctly filters orders', () => {
  const allOrders = filterOrdersByTab(mockSampleOrders, 'All');
  assert.equal(allOrders.length, 2);

  const holdOrders = filterOrdersByTab(mockSampleOrders, 'Hold');
  assert.equal(holdOrders.length, 1);
  assert.equal(holdOrders[0].orderNumber, '#21529');

  const pendingOrders = filterOrdersByTab(mockSampleOrders, 'Pending');
  assert.equal(pendingOrders.length, 0);
});

test('searchOrders correctly finds matches in order number or customer name', () => {
  const match1 = searchOrders(mockSampleOrders, '21529');
  assert.equal(match1.length, 1);
  assert.equal(match1[0].customer.name, 'MR MD Saidur Rahman');

  const match2 = searchOrders(mockSampleOrders, 'saidur');
  assert.equal(match2.length, 1);

  const noMatch = searchOrders(mockSampleOrders, 'non-existent');
  assert.equal(noMatch.length, 0);
});

test('calculateOrderSubtotal and calculateOrderTotal calculate arithmetic accurately', () => {
  const items = [
    { price: 500, quantity: 2 },
    { price: 310, quantity: 1 },
  ];
  const subtotal = calculateOrderSubtotal(items);
  assert.equal(subtotal, 1310);

  const total = calculateOrderTotal(subtotal, 100, 50);
  assert.equal(total, 1360);
});

test('validateNewOrder enforces customer name and item requirements', () => {
  const invalid1 = validateNewOrder({ customerName: '', phone: '123', items: [{ productId: '1', quantity: 1 }] });
  assert.equal(invalid1.isValid, false);

  const invalid2 = validateNewOrder({ customerName: 'Alice', phone: '', items: [{ productId: '1', quantity: 1 }] });
  assert.equal(invalid2.isValid, false);

  const invalid3 = validateNewOrder({ customerName: 'Alice', phone: '123', items: [] });
  assert.equal(invalid3.isValid, false);

  const valid = validateNewOrder({ customerName: 'Alice', phone: '123', items: [{ productId: '1', quantity: 1 }] });
  assert.equal(valid.isValid, true);
});
