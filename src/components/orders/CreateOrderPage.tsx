import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  X,
  Edit2,
  Copy,
  Plus,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { Order, Product, Customer, OrderStatus, OrderItem } from '../../types';
import { ShippingChargeModal, DeliveryType, ShippingZone } from './ShippingChargeModal';

interface CreateOrderPageProps {
  products: Product[];
  customers: Customer[];
  lastOrderNumber: string;
  onCancel: () => void;
  onCreateOrder: (order: Order) => void;
  onSaveDraft: (draft: Order) => void;
}

export const CreateOrderPage: React.FC<CreateOrderPageProps> = ({
  products,
  customers,
  lastOrderNumber,
  onCancel,
  onCreateOrder,
  onSaveDraft,
}) => {
  // Generate next order number
  const nextNum = parseInt(lastOrderNumber.replace(/\D/g, '') || '21547', 10) + 1;
  const newOrderNumStr = `#${nextNum}`;

  // Find or create default Oraimo products to match the screenshot
  const oraimoWatch = products.find((p) => p.name.includes('Oraimo') && p.sku.includes('WT')) || {
    id: 'prod-oraimo-1',
    name: 'Oraimo smart lite 2',
    sku: 'OSL-WT-01',
    category: 'Electronics',
    price: 1310,
    costPrice: 850,
    stock: 50,
    status: 'In Stock' as const,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80',
  };

  const oraimoEarbuds = products.find((p) => p.name.includes('Oraimo') && p.sku.includes('EB')) || {
    id: 'prod-oraimo-2',
    name: 'Oraimo smart lite 2',
    sku: 'OSL-EB-02',
    category: 'Electronics',
    price: 1310,
    costPrice: 850,
    stock: 40,
    status: 'In Stock' as const,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=150&q=80',
  };

  const oraimoCase = products.find((p) => p.name.includes('Oraimo') && p.sku.includes('AC')) || {
    id: 'prod-oraimo-3',
    name: 'Oraimo smart lite 2',
    sku: 'OSL-AC-03',
    category: 'Electronics',
    price: 1310,
    costPrice: 850,
    stock: 35,
    status: 'In Stock' as const,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=150&q=80',
  };

  // Pre-seed with the 3 items from screenshot image_bf964e1d.png
  const [selectedItems, setSelectedItems] = useState<
    { product: Product; quantity: number }[]
  >([
    { product: oraimoWatch, quantity: 1 },
    { product: oraimoEarbuds, quantity: 1 },
    { product: oraimoCase, quantity: 1 },
  ]);

  const [productSearch, setProductSearch] = useState('');
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState(false);

  // Customer State - Pre-seeded with MD Hasan Mahmud from screenshot image_bf964e1d.png
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<{
    name: string;
    phone: string;
    email: string;
    shippingAddress: string;
    billingAddress: string;
    acceptanceRate: number;
  } | null>({
    name: 'MD Hasan Mahmud',
    phone: '01800000000',
    email: 'hasan789@gmail.com',
    shippingAddress: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
    billingAddress: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
    acceptanceRate: 70,
  });

  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Editing individual customer fields
  const [editingField, setEditingField] = useState<string | null>(null);

  // Payment details states - Pre-seeded to match 3930 + 50 - 30 = 3950 Total, 3950 Paid, Due 0.00
  const [shippingFee, setShippingFee] = useState<number>(50);
  const [shippingPartner, setShippingPartner] = useState<string>('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType | null>(null);
  const [shippingZone, setShippingZone] = useState<ShippingZone>('Inside');
  const [discount, setDiscount] = useState<number>(30);
  const [paidAmount, setPaidAmount] = useState<number>(3950);
  const [vatRate] = useState<number>(0); // 0%
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountType, setDiscountType] = useState<'Fixed' | 'Percentage'>('Fixed');
  const [discountInput, setDiscountInput] = useState<string>('');
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  // Side cards states
  const [orderNote, setOrderNote] = useState('');
  const [customerTag, setCustomerTag] = useState('Customer Tag');
  const [isCustomerTagOpen, setIsCustomerTagOpen] = useState(false);
  const [source, setSource] = useState('Select Source');
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isSplitMenuOpen, setIsSplitMenuOpen] = useState(false);

  const customerSearchRef = useRef<HTMLDivElement>(null);
  const splitMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        customerSearchRef.current &&
        !customerSearchRef.current.contains(e.target as Node)
      ) {
        setIsCustomerDropdownOpen(false);
      }
      if (
        splitMenuRef.current &&
        !splitMenuRef.current.contains(e.target as Node)
      ) {
        setIsSplitMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products by inline search
  const searchedProducts = useMemo(() => {
    if (!productSearch.trim()) return [];
    const q = productSearch.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, productSearch]);

  // Filter customers
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase().trim();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }, [customers, customerSearch]);

  // Add product item
  const handleAddProduct = (product: Product) => {
    const existing = selectedItems.find((i) => i.product.id === product.id);
    if (existing) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { product, quantity: 1 }]);
    }
    setProductSearch('');
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setSelectedItems(
      selectedItems
        .map((i) => {
          if (i.product.id === productId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as { product: Product; quantity: number }[]
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.product.id !== productId));
  };

  // Calculations
  const subtotal = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [selectedItems]);

  const vatAmount = useMemo(() => {
    return (subtotal * vatRate) / 100;
  }, [subtotal, vatRate]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal + shippingFee + vatAmount - discount);
  }, [subtotal, shippingFee, vatAmount, discount]);

  const dueAmount = useMemo(() => {
    return Math.max(0, grandTotal - paidAmount);
  }, [grandTotal, paidAmount]);

  const formatTk = (val: number) => {
    return `৳${val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleSelectCustomer = (c: Customer) => {
    setSelectedCustomer({
      name: c.name,
      phone: c.phone,
      email: c.email,
      shippingAddress: `2972 Westheimer Rd. ${c.city}`,
      billingAddress: `2972 Westheimer Rd. ${c.city}`,
      acceptanceRate: 70,
    });
    setCustomerSearch('');
    setIsCustomerDropdownOpen(false);
  };

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const buildOrderObject = (status: OrderStatus = 'Pending'): Order => {
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
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', {
      month: 'short',
    })} , ${now.getFullYear()} ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    return {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumStr,
      customer: {
        id: `cust-${Date.now()}`,
        name: selectedCustomer?.name || 'Walk-in Customer',
        phone: selectedCustomer?.phone || '+880 1800000000',
        email: selectedCustomer?.email || 'customer@biponil.com',
        address: selectedCustomer?.shippingAddress || 'Dhaka, Bangladesh',
        city: 'Santa Ana, Illinois',
      },
      branch: 'Online Shop',
      items: orderItems,
      subtotal,
      shippingFee,
      discount,
      totalAmount: grandTotal,
      status,
      paymentMethod: paidAmount >= grandTotal ? 'bKash' : 'Cash on Delivery',
      paymentStatus:
        paidAmount >= grandTotal
          ? 'Paid'
          : paidAmount > 0
          ? 'Partially Paid'
          : 'Unpaid',
      createdAt: formattedDate,
      notes: orderNote.trim() || undefined,
      deliveryCourier: shippingPartner || undefined,
    };
  };

  const handleCreate = () => {
    const order = buildOrderObject('Pending');
    onCreateOrder(order);
  };

  const handleSaveAsDraft = () => {
    const draft = buildOrderObject('Hold');
    onSaveDraft(draft);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header Row (matches screenshot: Create Order on left, Cancel + Create Order v on right) */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Order</h1>

        <div className="flex items-center gap-3">
          {/* Cancel button */}
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-semibold rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            Cancel
          </button>

          {/* Split primary button: "Create Order | v" */}
          <div className="relative inline-flex" ref={splitMenuRef}>
            <div className="flex rounded-2xl shadow-sm shadow-[#8075FF]/25 overflow-hidden bg-[#8075FF] hover:bg-[#6e62ff] text-white transition-colors">
              <button
                onClick={handleCreate}
                className="px-5 py-2 text-sm font-semibold cursor-pointer"
              >
                Create Order
              </button>
              <div className="w-[1px] bg-white/20 my-1.5" />
              <button
                onClick={() => setIsSplitMenuOpen(!isSplitMenuOpen)}
                className="px-2.5 py-2 hover:bg-black/10 transition-colors cursor-pointer flex items-center justify-center"
                aria-label="More creation options"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {isSplitMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in zoom-in-95 text-xs text-slate-700">
                <button
                  onClick={() => {
                    setIsSplitMenuOpen(false);
                    handleSaveAsDraft();
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => {
                    setIsSplitMenuOpen(false);
                    handleCreate();
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
                >
                  Create & Print Invoice
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Form Grid Layout (matches screenshot image_bf964e1d.png 2-column layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Selection Table & Customer Details Card */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Products Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
            {/* Top search & browse bar */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search Product"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 placeholder:text-slate-400 transition-all"
                />

                {/* Instant search autocomplete results */}
                {searchedProducts.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto z-30 divide-y divide-slate-100">
                    {searchedProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleAddProduct(p)}
                        className="w-full p-3 flex items-center justify-between text-left hover:bg-purple-50/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{p.name}</p>
                            <p className="text-[11px] text-slate-400">
                              SKU: {p.sku} • Stock: {p.stock}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-xs text-purple-700">
                          ৳ {p.price.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Browse Product Button (matches screenshot) */}
              <button
                type="button"
                onClick={() => setIsBrowseModalOpen(true)}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
              >
                Browse Product
              </button>
            </div>

            {/* Products Table (matches image_bf964e1d.png layout and styling) */}
            <div className="border border-slate-100 rounded-xl overflow-hidden mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8f9fc] border-b border-slate-100 text-xs font-semibold text-slate-700">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 pr-6 pl-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {selectedItems.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400">
                        No products added yet. Click &quot;Browse Product&quot; to add items.
                      </td>
                    </tr>
                  ) : (
                    selectedItems.map((item, index) => (
                      <tr key={`${item.product.id}-${index}`} className="hover:bg-slate-50/50 transition-colors">
                        {/* Product info: Thumbnail, Name, and Purple Price */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-xs text-slate-800">
                                {item.product.name}
                              </p>
                              <p className="text-xs font-bold text-[#6366f1] mt-0.5">
                                ৳ {item.product.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Qty Counter Pill */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center justify-between border border-slate-200 rounded-xl px-2.5 py-1 text-xs bg-white w-24 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.product.id, -1)}
                              className="text-slate-400 hover:text-slate-700 cursor-pointer font-bold px-1"
                            >
                              —
                            </button>
                            <span className="font-semibold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.product.id, 1)}
                              className="text-slate-400 hover:text-slate-700 cursor-pointer font-bold px-1"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Amount & Remove Cross Icon */}
                        <td className="py-3.5 pr-6 pl-4 text-right">
                          <div className="flex items-center justify-end gap-5">
                            <span className="font-semibold text-xs text-slate-800">
                              ৳ {(item.product.price * item.quantity).toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(item.product.id)}
                              className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer p-0.5"
                              title="Remove item"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 2: Customer Details Card (matches image_bf964e1d.png) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
            {selectedCustomer ? (
              <>
                {/* Header with Title and Cancel text button */}
                <div className="flex items-center justify-between pb-1">
                  <h2 className="text-sm font-bold text-slate-900">Customer Details</h2>
                  <button
                    type="button"
                    onClick={() => setSelectedCustomer(null)}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {/* 2-Column Sub Layout: Left Fields + Right Order Acceptation Rate Gauge */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left Column: 5 Stacked Gray Detail Boxes */}
                  <div className="md:col-span-7 space-y-2.5">
                    {/* Box 1: Name */}
                    <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-2.5 px-3.5 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="block text-[11px] text-slate-400 font-medium">Name</span>
                        {editingField === 'name' ? (
                          <input
                            type="text"
                            value={selectedCustomer.name}
                            onChange={(e) =>
                              setSelectedCustomer({ ...selectedCustomer, name: e.target.value })
                            }
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded px-1.5 py-0.5 w-full mt-0.5"
                          />
                        ) : (
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {selectedCustomer.name}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingField('name')}
                        className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer shrink-0"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Box 2: Phone */}
                    <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-2.5 px-3.5 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="block text-[11px] text-slate-400 font-medium">Phone</span>
                        {editingField === 'phone' ? (
                          <input
                            type="text"
                            value={selectedCustomer.phone}
                            onChange={(e) =>
                              setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })
                            }
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded px-1.5 py-0.5 w-full mt-0.5"
                          />
                        ) : (
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {selectedCustomer.phone}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingField('phone')}
                        className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer shrink-0"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Box 3: Email */}
                    <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-2.5 px-3.5 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="block text-[11px] text-slate-400 font-medium">Email</span>
                        {editingField === 'email' ? (
                          <input
                            type="email"
                            value={selectedCustomer.email}
                            onChange={(e) =>
                              setSelectedCustomer({ ...selectedCustomer, email: e.target.value })
                            }
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded px-1.5 py-0.5 w-full mt-0.5"
                          />
                        ) : (
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {selectedCustomer.email}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingField('email')}
                        className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer shrink-0"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Box 4: Shipping Address */}
                    <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-2.5 px-3.5 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="block text-[11px] text-slate-400 font-medium">
                          Shipping Address
                        </span>
                        {editingField === 'shippingAddress' ? (
                          <input
                            type="text"
                            value={selectedCustomer.shippingAddress}
                            onChange={(e) =>
                              setSelectedCustomer({
                                ...selectedCustomer,
                                shippingAddress: e.target.value,
                              })
                            }
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded px-1.5 py-0.5 w-full mt-0.5"
                          />
                        ) : (
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {selectedCustomer.shippingAddress}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => setEditingField('shippingAddress')}
                          className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(selectedCustomer.shippingAddress)}
                          title="Copy Address"
                          className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Box 5: Billing Address */}
                    <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-2.5 px-3.5 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="block text-[11px] text-slate-400 font-medium">
                          Billing Address
                        </span>
                        {editingField === 'billingAddress' ? (
                          <input
                            type="text"
                            value={selectedCustomer.billingAddress}
                            onChange={(e) =>
                              setSelectedCustomer({
                                ...selectedCustomer,
                                billingAddress: e.target.value,
                              })
                            }
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded px-1.5 py-0.5 w-full mt-0.5"
                          />
                        ) : (
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {selectedCustomer.billingAddress}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingField('billingAddress')}
                        className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer shrink-0"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Order Acceptation Rate Gauge Widget (matches image_bf964e1d.png) */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center p-3 text-center">
                    <h3 className="text-xs font-bold text-slate-900 mb-3">
                      Order Acceptation Rate
                    </h3>

                    {/* SVG Semicircle Gauge */}
                    <div className="relative w-40 h-24 flex items-center justify-center">
                      <svg viewBox="0 0 120 70" className="w-36 h-22 overflow-visible">
                        {/* Background track arc (180 to 0 deg) */}
                        <path
                          d="M 15 60 A 45 45 0 0 1 105 60"
                          fill="none"
                          stroke="#e6edf5"
                          strokeWidth="8"
                          strokeLinecap="round"
                        />
                        {/* 70% Progress arc */}
                        <path
                          d="M 15 60 A 45 45 0 0 1 105 60"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="8.5"
                          strokeLinecap="round"
                          strokeDasharray="141.37"
                          strokeDashoffset="42.41"
                        />
                      </svg>
                      {/* Center percentage text */}
                      <div className="absolute bottom-1 flex items-baseline justify-center">
                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                          {selectedCustomer.acceptanceRate || 70}
                        </span>
                        <span className="text-sm font-semibold text-slate-600 ml-0.5">%</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 text-center leading-relaxed max-w-[210px] mt-2">
                      Based on historical delivery acceptance rate across all partner couriers
                    </p>

                    <button
                      type="button"
                      onClick={() => setIsScoreModalOpen(true)}
                      className="mt-3.5 px-4 py-1.5 bg-[#eff3ff] hover:bg-[#e2eafd] text-[#6366f1] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      View Courier Score
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* If no customer selected yet: Search Customer Input */
              <div className="relative" ref={customerSearchRef}>
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={customerSearch}
                  onFocus={() => setIsCustomerDropdownOpen(true)}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setIsCustomerDropdownOpen(true);
                  }}
                  placeholder="Search Customer"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 placeholder:text-slate-400 transition-all"
                />

                {/* Customer dropdown */}
                {isCustomerDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto z-30 divide-y divide-slate-100 text-xs">
                    <div className="p-2 bg-slate-50 flex items-center justify-between">
                      <span className="font-semibold text-slate-500 text-[11px]">
                        Suggested Customers
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCustomer({
                            name: customerSearch || 'MD Hasan Mahmud',
                            phone: '01800000000',
                            email: 'hasan789@gmail.com',
                            shippingAddress: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
                            billingAddress: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
                            acceptanceRate: 70,
                          });
                          setIsCustomerDropdownOpen(false);
                        }}
                        className="text-purple-600 font-bold hover:underline cursor-pointer"
                      >
                        + Add As New Customer
                      </button>
                    </div>

                    {filteredCustomers.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCustomer(c)}
                        className="w-full p-3 flex items-center justify-between text-left hover:bg-purple-50/50 transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{c.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {c.phone} • {c.city}
                          </p>
                        </div>
                        <span className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
                          {c.tier}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Column (Payment Details + Write Note + Customer Tag + Select Source) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Payment Details (matches screenshot image_bf964e1d.png) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Payment Details</h2>

            {/* Top buttons: "Shipping charge" and "Apply discount" side-by-side */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsShippingModalOpen(true)}
                className="py-2 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer text-center shadow-2xs"
              >
                Shipping charge
              </button>
              <button
                type="button"
                onClick={() => {
                  setDiscountInput(discount > 0 ? String(discount) : '');
                  setDiscountType('Fixed');
                  setIsDiscountModalOpen(true);
                }}
                className="py-2 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer text-center shadow-2xs"
              >
                Apply discount
              </button>
            </div>

            {/* Financial Rows (Matches screenshot typography & colors) */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">{formatTk(subtotal)}</span>
              </div>

              {/* Shipping with cross button */}
              <div className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span>Shipping</span>
                  {shippingFee > 0 && (
                    <button
                      type="button"
                      onClick={() => setShippingFee(0)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer text-[10px]"
                      title="Remove shipping"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <span className="font-medium text-slate-800">{formatTk(shippingFee)}</span>
              </div>

              {/* Discount with cross button */}
              <div className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span>Discount</span>
                  {discount > 0 && (
                    <button
                      type="button"
                      onClick={() => setDiscount(0)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer text-[10px]"
                      title="Remove discount"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <span className="font-medium text-slate-800">{formatTk(discount)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>VAT (0%)</span>
                <span className="font-medium text-slate-800">{formatTk(vatAmount)}</span>
              </div>

              {/* Paid */}
              <div className="flex items-center justify-between text-slate-600">
                <span>Paid</span>
                <span className="font-medium text-slate-800">{formatTk(paidAmount)}</span>
              </div>

              {/* Due amount in coral/rose as in screenshot */}
              <div className="flex items-center justify-between text-slate-600">
                <span>Due</span>
                <span className="font-semibold text-rose-500">{formatTk(dueAmount)}</span>
              </div>
            </div>

            {/* Total Divider & Big Total Row (matches screenshot purple total ৳3950.00) */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Total</span>
              <span className="text-base font-extrabold text-[#6366f1] tracking-tight">
                {formatTk(grandTotal)}
              </span>
            </div>
          </div>

          {/* Card 2: Write Note (matches screenshot) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4">
            <textarea
              rows={4}
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Write Note"
              className="w-full text-xs text-slate-700 placeholder:text-slate-400 bg-transparent resize-y focus:outline-none"
            />
          </div>

          {/* Card 3: Customer Tag (matches screenshot card with chevron down) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 relative">
            <button
              type="button"
              onClick={() => setIsCustomerTagOpen(!isCustomerTagOpen)}
              className="w-full flex items-center justify-between text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <span>{customerTag}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  isCustomerTagOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isCustomerTagOpen && (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs animate-in fade-in">
                {['VIP Customer', 'Wholesale Buyer', 'Retail Buyer', 'New Customer', 'Frequent Returner'].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setCustomerTag(tag);
                        setIsCustomerTagOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 text-left rounded-lg transition-colors cursor-pointer ${
                        customerTag === tag
                          ? 'bg-purple-50 text-purple-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Card 4: Select Source (matches screenshot card with chevron down) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 relative">
            <button
              type="button"
              onClick={() => setIsSourceOpen(!isSourceOpen)}
              className="w-full flex items-center justify-between text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <span>{source}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  isSourceOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isSourceOpen && (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs animate-in fade-in">
                {[
                  'Online Store (Biponil.com)',
                  'Facebook Messenger',
                  'Instagram Direct',
                  'Phone Call Order',
                  'WhatsApp Business',
                  'Retail Outlet Walk-in',
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSource(s);
                      setIsSourceOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 text-left rounded-lg transition-colors cursor-pointer ${
                      source === s
                        ? 'bg-purple-50 text-purple-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal 1: Browse Product Modal */}
      {isBrowseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900">Browse Product Catalog</h2>
              <button
                onClick={() => setIsBrowseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
              {products.map((p) => {
                const isSelected = selectedItems.some((i) => i.product.id === p.id);
                return (
                  <div
                    key={p.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-11 h-11 rounded-lg object-contain bg-slate-100 shrink-0 p-1"
                      />
                      <div>
                        <p className="font-bold text-xs text-slate-800">{p.name}</p>
                        <p className="text-[11px] text-slate-400">
                          SKU: {p.sku} • Stock: {p.stock}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-xs text-slate-900">
                        ৳ {p.price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddProduct(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-[#8075FF] hover:bg-[#6e62ff] text-white'
                        }`}
                      >
                        {isSelected ? 'Add More +' : '+ Add'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setIsBrowseModalOpen(false)}
                className="px-5 py-2 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Shipping Charge Modal (matches image_cd63c2e5.png) */}
      <ShippingChargeModal
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
        currentCharge={shippingFee}
        currentPartner={shippingPartner}
        currentDeliveryType={deliveryType}
        currentZone={shippingZone}
        onSave={(details) => {
          setShippingFee(details.charge);
          setShippingPartner(details.partner);
          setDeliveryType(details.deliveryType);
          setShippingZone(details.zone);
        }}
      />

      {/* Modal 3: Overall Discount Modal */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Overall Discount</h2>
              <button
                onClick={() => {
                  setIsDiscountModalOpen(false);
                  setDiscountInput('');
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Discount Type */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Discount Type</p>
              <div className="grid grid-cols-2 gap-3">
                {(['Fixed', 'Percentage'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDiscountType(type)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                      discountType === type
                        ? 'border-indigo-300 bg-white text-slate-800'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {/* Radio circle */}
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        discountType === type
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {discountType === type && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-1.5">
              <input
                type="number"
                min="0"
                max={discountType === 'Fixed' ? subtotal : 100}
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                placeholder="Enter Discount Amount"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              <p className="text-xs text-slate-500 pl-1">
                Maximum allowed:{' '}
                <span className="font-medium text-slate-700">
                  ৳ {discountType === 'Fixed' ? subtotal.toLocaleString() : 100}
                  {discountType === 'Percentage' ? '%' : ''}
                </span>
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-1">
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
                className="px-6 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-sm font-semibold cursor-pointer transition-colors shadow-sm shadow-[#8075FF]/25"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: View Courier Score Modal */}
      {isScoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-sm font-bold text-slate-900">Courier Historical Performance</h2>
              <button
                onClick={() => setIsScoreModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <span className="font-bold text-emerald-800">Overall Success Rate: 70%</span>
                <p className="text-emerald-700 text-[11px] mt-0.5">
                  Customer has successfully accepted and paid for 14 out of 20 dispatched shipments across partner courier networks.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span className="font-semibold text-slate-700">Steadfast Courier</span>
                  <span className="text-emerald-600 font-bold">85% Delivery Rate</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span className="font-semibold text-slate-700">RedX Logistics</span>
                  <span className="text-emerald-600 font-bold">75% Delivery Rate</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span className="font-semibold text-slate-700">Pathao Express</span>
                  <span className="text-amber-600 font-bold">60% Delivery Rate</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsScoreModalOpen(false)}
                className="px-4 py-2 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Copied Toast */}
      {copiedAddress && (
        <div className="fixed bottom-6 right-6 z-60 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg animate-in fade-in">
          Shipping address copied to clipboard!
        </div>
      )}
    </div>
  );
};
