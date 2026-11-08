import React, { useState, useRef, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Download,
  Printer,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  ArrowUpDown,
} from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/orderUtils';

interface ProductsViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onDeleteProduct: (productId: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onAddProduct,
  onUpdateStock,
  onDeleteProduct,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [stockStatusFilter, setStockStatusFilter] = useState('All');
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // New product form fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Men Fashion');
  const [price, setPrice] = useState<number>(1500);
  const [costPrice, setCostPrice] = useState<number>(900);
  const [stock, setStock] = useState<number>(30);
  const [imageUrl, setImageUrl] = useState('');

  const moreActionsRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreActionsRef.current && !moreActionsRef.current.contains(e.target as Node)) {
        setMoreActionsOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = ['All', 'Men Fashion', 'Women Fashion', 'Accessories', 'Footwear', 'Electronics'];

  const filteredProducts = products
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchStock =
        stockStatusFilter === 'All' ||
        (stockStatusFilter === 'In Stock' && p.stock > 10) ||
        (stockStatusFilter === 'Low Stock' && p.stock > 0 && p.stock <= 10) ||
        (stockStatusFilter === 'Out of Stock' && p.stock === 0);
      return matchSearch && matchCategory && matchStock;
    })
    .sort((a, b) => {
      if (sortField === 'price') {
        return sortAsc ? a.price - b.price : b.price - a.price;
      }
      if (sortField === 'stock') {
        return sortAsc ? a.stock - b.stock : b.stock - a.stock;
      }
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });

  const exportProductsToCSV = () => {
    const headers = ['Product Name', 'SKU', 'Category', 'Selling Price', 'Cost Price', 'Stock Level', 'Status'];
    const rows = filteredProducts.map((p) => [
      `"${p.name}"`,
      p.sku,
      `"${p.category}"`,
      p.price,
      p.costPrice,
      p.stock,
      p.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `products_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMoreActionsOpen(false);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      category,
      price,
      costPrice,
      stock,
      status: stock > 10 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock',
      image: imageUrl.trim() || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80',
    };

    onAddProduct(newProd);
    setIsAddModalOpen(false);
    setName('');
    setSku('');
  };

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2]">
      {/* Top Header Row (Matches Orders style: Title on left, Filter + More Actions + Add Product on right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products</h1>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium rounded-xl border transition-all cursor-pointer shadow-2xs ${
                filterDropdownOpen || stockStatusFilter !== 'All'
                  ? 'border-purple-300 ring-2 ring-purple-100 text-purple-700 font-semibold'
                  : 'border-slate-200/90'
              }`}
              aria-label="Filter products"
            >
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              <span>Filter</span>
              {stockStatusFilter !== 'All' && (
                <span className="w-5 h-5 rounded-full bg-[#8075FF] text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
              )}
            </button>

            {filterDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-40 animate-in fade-in zoom-in-95 duration-100 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-slate-900">Filter Stock</span>
                  </div>
                  {stockStatusFilter !== 'All' && (
                    <button
                      onClick={() => setStockStatusFilter('All')}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Stock Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStockStatusFilter(st)}
                        className={`py-1.5 px-2.5 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                          stockStatusFilter === st
                            ? 'bg-purple-50 border-purple-300 text-purple-700 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setFilterDropdownOpen(false)}
                    className="px-4 py-1.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* More Actions Dropdown */}
          <div className="relative" ref={moreActionsRef}>
            <button
              onClick={() => setMoreActionsOpen(!moreActionsOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium rounded-xl border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
            >
              <span>More Actions</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {moreActionsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={exportProductsToCSV}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Export to CSV ({filteredProducts.length})</span>
                </button>
                <button
                  onClick={() => {
                    window.print();
                    setMoreActionsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print Catalog</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-2xl shadow-sm shadow-[#8075FF]/25 transition-all cursor-pointer hover:shadow-md active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Main Table Card (matches Orders table card container) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Sub-tabs & Search Toolbar Row */}
        <div className="px-6 pt-5 pb-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 gap-4">
          {/* Left Category Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-sm select-none">
            {categories.map((cat) => {
              const count = cat === 'All' ? products.length : products.filter((p) => p.category === cat).length;
              const isActive = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`pb-1 whitespace-nowrap text-sm transition-all cursor-pointer relative ${
                    isActive
                      ? 'font-bold text-slate-900 border-b-2 border-purple-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Right Toolbar: Search input, Sort button */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white w-48 sm:w-60 transition-all"
              />
            </div>

            <button
              onClick={() => {
                setSortAsc(!sortAsc);
              }}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors cursor-pointer"
              title={`Sort ${sortAsc ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-semibold">
                <th className="py-3 px-5">Product</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Cost Price</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`transition-colors ${
                    idx % 2 === 1 ? 'bg-[#f8f9fe] hover:bg-[#edf0fd]/80' : 'bg-white hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <span className="font-bold text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-purple-700">{p.sku}</td>
                  <td className="py-3.5 px-4 text-slate-600">{p.category}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{formatCurrency(p.price)} BDT</td>
                  <td className="py-3.5 px-4 text-slate-500">{formatCurrency(p.costPrice)} BDT</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 5))}
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-800 w-8 text-center">{p.stock}</span>
                      <button
                        onClick={() => onUpdateStock(p.id, p.stock + 5)}
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.stock > 10
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.stock > 0
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {p.stock > 10 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-3.5 pr-5 text-right">
                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product View - Structured in the exact same 2-column card layout as image_0872a207.png */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#F2F2F2] overflow-y-auto p-6 md:p-8 animate-in fade-in duration-150">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add New Product</h1>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-semibold rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateProduct}
                  className="px-6 py-2 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-xl shadow-sm shadow-[#8075FF]/25 transition-all cursor-pointer hover:shadow-md"
                >
                  Save Product
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Product Details Cards */}
              <div className="lg:col-span-8 space-y-6">
                {/* General Information Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">General Information</h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cotton Casual Shirt - Navy Blue"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        SKU Identifier *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="CCS-NB-01"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                      >
                        {categories.filter((c) => c !== 'All').map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pricing & Stock Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Pricing & Stock Inventory</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Selling Price (৳)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Cost Price (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={costPrice}
                        onChange={(e) => setCostPrice(Number(e.target.value))}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Available Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Media Image Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Product Media</h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing Summary & Status */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Product Summary</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Base Selling Price</span>
                      <span className="font-semibold text-slate-800">৳{price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Gross Margin</span>
                      <span className="font-semibold text-emerald-600">
                        ৳{Math.max(0, price - costPrice).toFixed(2)} ({price > 0 ? Math.round(((price - costPrice) / price) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Initial Stock</span>
                      <span className="font-semibold text-slate-800">{stock} units</span>
                    </div>
                    <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-sm text-slate-900">
                      <span>Inventory Value</span>
                      <span className="text-[#6366f1]">৳{(price * stock).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Product Status Preview
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      stock > 10
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : stock > 0
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {stock > 10 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
