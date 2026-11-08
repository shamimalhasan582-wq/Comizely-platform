import React, { useState } from 'react';
import {
  Store,
  ShoppingBag,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react';
import { Product, Order } from '../../types';
import { formatCurrency } from '../../utils/orderUtils';

interface OnlineStoreViewProps {
  products: Product[];
  onBackToAdmin: () => void;
  onPlaceStorefrontOrder: (order: Order) => void;
  lastOrderNumber: string;
}

export const OnlineStoreView: React.FC<OnlineStoreViewProps> = ({
  products,
  onBackToAdmin,
  onPlaceStorefrontOrder,
  lastOrderNumber,
}) => {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccessOrderNum, setCheckoutSuccessOrderNum] = useState<string | null>(null);

  // Quick checkout form
  const [name, setName] = useState('MR MD Saidur Rahman');
  const [phone, setPhone] = useState('+880 1712-345678');
  const [address, setAddress] = useState('Dhanmondi, Dhaka');

  const addToCart = (product: Product) => {
    const existing = cart.find((i) => i.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const nextNum = parseInt(lastOrderNumber.replace(/\D/g, '') || '21547', 10) + 1;
    const newOrderNum = `#${nextNum}`;

    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} , ${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newOrder: Order = {
      id: `ord-store-${Date.now()}`,
      orderNumber: newOrderNum,
      customer: {
        id: `cust-${Date.now()}`,
        name,
        email: 'customer@biponil.com',
        phone,
        address,
        city: 'Dhaka',
      },
      branch: 'Online Shop',
      items: cart.map((i, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        productId: i.product.id,
        name: i.product.name,
        sku: i.product.sku,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
      })),
      subtotal: cartTotal,
      shippingFee: 60,
      discount: 0,
      totalAmount: cartTotal + 60,
      status: 'Pending',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Unpaid',
      createdAt: formattedDate,
      notes: 'Placed via Biponil.com storefront checkout',
    };

    onPlaceStorefrontOrder(newOrder);
    setCart([]);
    setCheckoutSuccessOrderNum(newOrderNum);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Banner / Store Notice */}
      <div className="bg-purple-900 text-white px-4 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Summer Collection 2026 Live on <strong>Biponil.com</strong> • Free delivery above 2,500 BDT</span>
        </div>
        <button
          onClick={onBackToAdmin}
          className="text-purple-200 hover:text-white flex items-center gap-1 font-semibold text-xs ml-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Comizely Admin</span>
        </button>
      </div>

      {/* Store Navigation Bar */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
            B
          </div>
          <div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              Biponil<span className="text-purple-600">.com</span>
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1">Official Online Store</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs transition-colors cursor-pointer relative"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Bag ({cartCount})</span>
            {cartCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-purple-600 absolute top-1.5 right-1.5" />
            )}
          </button>
        </div>
      </header>

      {/* Main Storefront Area */}
      <main className="max-w-6xl w-full mx-auto p-6 space-y-8 flex-1">
        {checkoutSuccessOrderNum && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Order Placed Successfully!</h2>
            <p className="text-xs text-slate-600">
              Your order <strong className="text-purple-700 font-mono">{checkoutSuccessOrderNum}</strong> has been transmitted to Comizely Admin and is now in <strong>Pending</strong> status for verification.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setCheckoutSuccessOrderNum(null)}
                className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Continue Shopping
              </button>
              <button
                onClick={onBackToAdmin}
                className="px-4 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 cursor-pointer"
              >
                View in Comizely Orders Table
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
              New Season Arrivals
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Premium Lifestyle & Fashion For Everyone.
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm">
              Discover curated shirts, trousers, kurtis, and genuine leather goods. Express delivery across Bangladesh.
            </p>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Featured Catalog</h2>
            <span className="text-xs text-slate-500">{products.length} Products Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-700 shadow-xs">
                    {p.category}
                  </span>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-700 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">SKU: {p.sku}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div>
                      <p className="text-xs text-slate-400">Price</p>
                      <p className="font-extrabold text-base text-slate-900">
                        {formatCurrency(p.price)} <span className="text-xs font-normal">BDT</span>
                      </p>
                    </div>

                    <button
                      onClick={() => addToCart(p)}
                      disabled={p.stock <= 0}
                      className="px-4 py-2 bg-[#8075FF] hover:bg-[#6e62ff] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm shadow-[#8075FF]/25"
                    >
                      {p.stock > 0 ? 'Add to Bag' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">Your Bag ({cartCount})</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="font-medium">Your shopping bag is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                          />
                          <div>
                            <p className="font-semibold text-slate-800 text-xs">{item.product.name}</p>
                            <p className="text-[11px] text-slate-400">
                              Qty: {item.quantity} × {item.product.price} BDT
                            </p>
                          </div>
                        </div>
                        <div className="font-bold text-xs text-slate-900">
                          {formatCurrency(item.product.price * item.quantity)} BDT
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Checkout inputs */}
                  <form onSubmit={handleCheckout} className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                    <h4 className="font-bold text-slate-900">Delivery Information</h4>
                    <div>
                      <label className="block text-slate-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Delivery Address</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-slate-600 mt-2">
                      <div className="flex justify-between">
                        <span>Items Subtotal</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(cartTotal)} BDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Standard Shipping</span>
                        <span className="font-semibold text-slate-900">+60 BDT</span>
                      </div>
                      <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-200">
                        <span>Total Payable</span>
                        <span className="text-purple-700">{formatCurrency(cartTotal + 60)} BDT</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl font-bold shadow-md shadow-[#8075FF]/25 cursor-pointer mt-2 transition-all active:scale-98"
                    >
                      Complete Order (Cash on Delivery)
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
