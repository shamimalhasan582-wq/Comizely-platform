import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  Plus,
  Search,
  Columns,
  ArrowUpDown,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  CheckCircle2,
  Trash2,
  Clock,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { getStatusBadgeClasses, formatCurrency } from '../../utils/orderUtils';
import { branchesList } from '../../data/mockData';

interface OrdersViewProps {
  orders: Order[];
  onOpenCreateOrder: () => void;
  onOpenFilter?: () => void;
  onSelectOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onBulkDelete: (orderIds: string[]) => void;
  onBulkStatusUpdate: (orderIds: string[], status: OrderStatus) => void;
  filterBranch?: string;
  setFilterBranch?: (branch: string) => void;
  filterPaymentStatus?: string;
  setFilterPaymentStatus?: (status: string) => void;
  filterMinAmount?: string;
  setFilterMinAmount?: (val: string) => void;
  filterMaxAmount?: string;
  setFilterMaxAmount?: (val: string) => void;
  onResetFilters?: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onOpenCreateOrder,
  onOpenFilter,
  onSelectOrder,
  onUpdateOrderStatus,
  onDeleteOrder,
  onBulkDelete,
  onBulkStatusUpdate,
  filterBranch,
  setFilterBranch,
  filterPaymentStatus,
  setFilterPaymentStatus,
  filterMinAmount,
  setFilterMinAmount,
  filterMaxAmount,
  setFilterMaxAmount,
  onResetFilters,
}) => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [othersOpen, setOthersOpen] = useState(false);
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [searchTableQuery, setSearchTableQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<'createdAt' | 'totalAmount' | 'orderNumber'>('createdAt');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [activeMenuOrderId, setActiveMenuOrderId] = useState<string | null>(null);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    orderNumber: true,
    customer: true,
    branch: true,
    totalAmount: true,
    status: true,
    createdAt: true,
    action: true,
  });

  // Local fallback filters if parent doesn't provide them
  const [localBranch, setLocalBranch] = useState('All');
  const [localPaymentStatus, setLocalPaymentStatus] = useState('All');
  const [localMinAmount, setLocalMinAmount] = useState('');
  const [localMaxAmount, setLocalMaxAmount] = useState('');

  const currentBranch = filterBranch !== undefined ? filterBranch : localBranch;
  const setBranch = setFilterBranch || setLocalBranch;

  const currentPaymentStatus = filterPaymentStatus !== undefined ? filterPaymentStatus : localPaymentStatus;
  const setPaymentStatus = setFilterPaymentStatus || setLocalPaymentStatus;

  const currentMinAmount = filterMinAmount !== undefined ? filterMinAmount : localMinAmount;
  const setMin = setFilterMinAmount || setLocalMinAmount;

  const currentMaxAmount = filterMaxAmount !== undefined ? filterMaxAmount : localMaxAmount;
  const setMax = setFilterMaxAmount || setLocalMaxAmount;

  const handleReset = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      setLocalBranch('All');
      setLocalPaymentStatus('All');
      setLocalMinAmount('');
      setLocalMaxAmount('');
    }
  };

  const activeFiltersCount =
    (currentBranch !== 'All' ? 1 : 0) +
    (currentPaymentStatus !== 'All' ? 1 : 0) +
    (currentMinAmount ? 1 : 0) +
    (currentMaxAmount ? 1 : 0);

  const moreActionsRef = useRef<HTMLDivElement>(null);
  const othersTabRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close popups on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreActionsRef.current && !moreActionsRef.current.contains(e.target as Node)) {
        setMoreActionsOpen(false);
      }
      if (othersTabRef.current && !othersTabRef.current.contains(e.target as Node)) {
        setOthersOpen(false);
      }
      if (rowsRef.current && !rowsRef.current.contains(e.target as Node)) {
        setRowsDropdownOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterDropdownOpen(false);
      }
      if (columnsRef.current && !columnsRef.current.contains(e.target as Node)) {
        setColumnsDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
      if (!(e.target as HTMLElement).closest('.order-row-action-menu')) {
        setActiveMenuOrderId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute counts for tabs
  const tabCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === 'Pending').length,
      followUp: orders.filter((o) => o.status === 'Follow Up').length,
      approved: orders.filter((o) => o.status === 'Approved').length,
      processing: orders.filter((o) => o.status === 'Processing').length,
      readyToShip: orders.filter((o) => o.status === 'Ready to ship').length,
      hold: orders.filter((o) => o.status === 'Hold').length,
      completed: orders.filter((o) => o.status === 'Completed').length,
      cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filter by tab
    if (activeTab === 'Pending') {
      result = result.filter((o) => o.status === 'Pending');
    } else if (activeTab === 'Follow Up') {
      result = result.filter((o) => o.status === 'Follow Up');
    } else if (activeTab === 'Approved') {
      result = result.filter((o) => o.status === 'Approved');
    } else if (activeTab === 'Processing') {
      result = result.filter((o) => o.status === 'Processing');
    } else if (activeTab === 'Ready to ship') {
      result = result.filter((o) => o.status === 'Ready to ship');
    } else if (activeTab === 'Hold') {
      result = result.filter((o) => o.status === 'Hold');
    } else if (activeTab === 'Completed') {
      result = result.filter((o) => o.status === 'Completed');
    } else if (activeTab === 'Cancelled') {
      result = result.filter((o) => o.status === 'Cancelled');
    }

    // Filter by inline search
    if (searchTableQuery.trim()) {
      const q = searchTableQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.branch.toLowerCase().includes(q) ||
          o.status.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortField === 'totalAmount') {
        return sortAsc ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
      }
      if (sortField === 'orderNumber') {
        return sortAsc ? a.orderNumber.localeCompare(b.orderNumber) : b.orderNumber.localeCompare(a.orderNumber);
      }
      // default createdAt
      return sortAsc
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [orders, activeTab, searchTableQuery, sortField, sortAsc]);

  // Pagination calculation
  const totalRows = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage);

  const isAllSelected =
    paginatedOrders.length > 0 &&
    paginatedOrders.every((o) => selectedOrderIds.includes(o.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = new Set(paginatedOrders.map((o) => o.id));
      setSelectedOrderIds(selectedOrderIds.filter((id) => !pageIds.has(id)));
    } else {
      const newIds = new Set([...selectedOrderIds, ...paginatedOrders.map((o) => o.id)]);
      setSelectedOrderIds(Array.from(newIds));
    }
  };

  const toggleSelectOrder = (id: string) => {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter((item) => item !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
    }
  };

  const exportSelectedToCSV = () => {
    const targetOrders =
      selectedOrderIds.length > 0
        ? orders.filter((o) => selectedOrderIds.includes(o.id))
        : orders;
    const headers = ['Order Number', 'Customer', 'Branch', 'Total Amount', 'Status', 'Created At'];
    const rows = targetOrders.map((o) => [
      o.orderNumber,
      `"${o.customer.name}"`,
      `"${o.branch}"`,
      o.totalAmount,
      o.status,
      `"${o.createdAt}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `comizely_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMoreActionsOpen(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2] rounded-tl-[36px] md:rounded-tl-[40px]">
      {/* Top Header Row (Matches screenshot: Orders title on left, Filter + More Actions + Create Order on right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders</h1>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter Dropdown (Dropdown style not modal) */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium rounded-xl border transition-all cursor-pointer shadow-2xs ${
                filterDropdownOpen || activeFiltersCount > 0
                  ? 'border-purple-300 ring-2 ring-purple-100 text-purple-700 font-semibold'
                  : 'border-slate-200/90'
              }`}
              aria-expanded={filterDropdownOpen}
              aria-label="Filter orders"
            >
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#8075FF] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {filterDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-40 animate-in fade-in zoom-in-95 duration-100 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-slate-900">Filter Orders</span>
                    {activeFiltersCount > 0 && (
                      <span className="text-[11px] text-purple-600 font-medium">({activeFiltersCount} active)</span>
                    )}
                  </div>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={handleReset}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                    >
                      Reset all
                    </button>
                  )}
                </div>

                {/* Branch / Outlet Filter */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Branch / Outlet</label>
                  <select
                    value={currentBranch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white text-slate-800 text-xs focus:outline-none focus:border-purple-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="All">All Branches</option>
                    {branchesList.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Status Filter */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Payment Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['All', 'Paid', 'Unpaid'].map((st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setPaymentStatus(st)}
                        className={`py-1.5 px-3 rounded-xl border text-center font-medium transition-colors cursor-pointer text-xs ${
                          currentPaymentStatus === st
                            ? 'bg-purple-50 border-purple-300 text-purple-700 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total Amount Range */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Total Amount Range (BDT)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min (e.g. 1000)"
                      value={currentMinAmount}
                      onChange={(e) => setMin(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-800 text-xs focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="number"
                      placeholder="Max (e.g. 5000)"
                      value={currentMaxAmount}
                      onChange={(e) => setMax(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-800 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Clear filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterDropdownOpen(false)}
                    className="px-4 py-1.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                  >
                    Apply Filters
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
              aria-expanded={moreActionsOpen}
            >
              <span>More Actions</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {moreActionsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={exportSelectedToCSV}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Export to CSV {selectedOrderIds.length > 0 && `(${selectedOrderIds.length})`}</span>
                </button>

                <button
                  onClick={() => {
                    window.print();
                    setMoreActionsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print Invoices</span>
                </button>

                {selectedOrderIds.length > 0 && (
                  <>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        onBulkStatusUpdate(selectedOrderIds, 'Approved');
                        setMoreActionsOpen(false);
                      }}
                      className="w-full px-4 py-2 text-xs text-emerald-600 hover:bg-emerald-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Mark as Approved ({selectedOrderIds.length})</span>
                    </button>
                    <button
                      onClick={() => {
                        onBulkStatusUpdate(selectedOrderIds, 'Processing');
                        setMoreActionsOpen(false);
                      }}
                      className="w-full px-4 py-2 text-xs text-indigo-600 hover:bg-indigo-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      <RefreshCw className="w-4 h-4 text-indigo-500" />
                      <span>Mark as Processing ({selectedOrderIds.length})</span>
                    </button>
                    <button
                      onClick={() => {
                        onBulkDelete(selectedOrderIds);
                        setSelectedOrderIds([]);
                        setMoreActionsOpen(false);
                      }}
                      className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                      <span>Delete Selected ({selectedOrderIds.length})</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* + Create Order Primary Button (matches screenshot vibrant solid #8075FF) */}
          <button
            onClick={onOpenCreateOrder}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-2xl shadow-sm shadow-[#8075FF]/25 transition-all cursor-pointer hover:shadow-md active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* Main Table Card (matches screenshot white rounded-2xl container) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Sub-tabs Row (All (27), Pending (5), Follow Up (4), Approved (7), Processing (4), Ready to ship, Others v) */}
        <div className="px-6 pt-5 pb-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 gap-4">
          {/* Left Tabs */}
          <div className="flex items-center gap-6 md:gap-7 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-sm select-none">
            {/* All */}
            <button
              onClick={() => {
                setActiveTab('All');
                setCurrentPage(1);
              }}
              className={`transition-colors cursor-pointer shrink-0 ${
                activeTab === 'All'
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 font-normal'
              }`}
            >
              All (27)
            </button>

            {/* Pending */}
            <button
              onClick={() => {
                setActiveTab('Pending');
                setCurrentPage(1);
              }}
              className={`transition-colors cursor-pointer shrink-0 ${
                activeTab === 'Pending'
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 font-normal'
              }`}
            >
              Pending ({tabCounts.pending})
            </button>

            {/* Follow Up */}
            <button
              onClick={() => {
                setActiveTab('Follow Up');
                setCurrentPage(1);
              }}
              className={`transition-colors cursor-pointer shrink-0 ${
                activeTab === 'Follow Up'
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 font-normal'
              }`}
            >
              Follow Up ({tabCounts.followUp})
            </button>

            {/* Approved */}
            <button
              onClick={() => {
                setActiveTab('Approved');
                setCurrentPage(1);
              }}
              className={`transition-colors cursor-pointer shrink-0 ${
                activeTab === 'Approved'
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 font-normal'
              }`}
            >
              Approved ({tabCounts.approved})
            </button>

            {/* Processing */}
            <button
              onClick={() => {
                setActiveTab('Processing');
                setCurrentPage(1);
              }}
              className={`transition-colors cursor-pointer shrink-0 ${
                activeTab === 'Processing'
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 font-normal'
              }`}
            >
              Processing ({tabCounts.processing})
            </button>

            {/* Ready to ship */}
            <button
              onClick={() => {
                setActiveTab('Ready to ship');
                setCurrentPage(1);
              }}
              className={`transition-colors cursor-pointer shrink-0 ${
                activeTab === 'Ready to ship'
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 font-normal'
              }`}
            >
              Ready to ship
            </button>

            {/* Others Dropdown */}
            <div className="relative shrink-0" ref={othersTabRef}>
              <button
                onClick={() => setOthersOpen(!othersOpen)}
                className={`flex items-center gap-1 transition-colors cursor-pointer ${
                  activeTab === 'Hold' || activeTab === 'Completed' || activeTab === 'Cancelled'
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 font-normal'
                }`}
              >
                <span>Others</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {othersOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      setActiveTab('Hold');
                      setCurrentPage(1);
                      setOthersOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex justify-between cursor-pointer"
                  >
                    <span>Hold</span>
                    <span className="text-slate-400 font-semibold">{tabCounts.hold}</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('Completed');
                      setCurrentPage(1);
                      setOthersOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex justify-between cursor-pointer"
                  >
                    <span>Completed</span>
                    <span className="text-slate-400 font-semibold">{tabCounts.completed}</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('Cancelled');
                      setCurrentPage(1);
                      setOthersOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex justify-between cursor-pointer"
                  >
                    <span>Cancelled</span>
                    <span className="text-slate-400 font-semibold">{tabCounts.cancelled}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Tools: Search, Columns, Sort, Rows per page selector (Matches screenshot) */}
          <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
            {showSearchInput ? (
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchTableQuery}
                  onChange={(e) => setSearchTableQuery(e.target.value)}
                  placeholder="Filter table..."
                  className="w-40 md:w-52 text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-6 focus:outline-none focus:border-purple-400"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setShowSearchInput(false);
                    setSearchTableQuery('');
                  }}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                title="Search table"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Columns Dropdown */}
            <div className="relative" ref={columnsRef}>
              <button
                onClick={() => setColumnsDropdownOpen(!columnsDropdownOpen)}
                title="Customize columns"
                aria-label="Customize columns"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                  columnsDropdownOpen ? 'bg-purple-50 text-purple-700 border-purple-300' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <Columns className="w-4 h-4" />
              </button>

              {columnsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-40 animate-in fade-in zoom-in-95 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-semibold text-slate-800">
                    <span>Toggle Columns</span>
                    <button
                      onClick={() =>
                        setVisibleColumns({
                          orderNumber: true,
                          customer: true,
                          branch: true,
                          totalAmount: true,
                          status: true,
                          createdAt: true,
                          action: true,
                        })
                      }
                      className="text-[10px] text-purple-600 hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="space-y-1">
                    {[
                      { key: 'orderNumber', label: 'Order #' },
                      { key: 'customer', label: 'Customer' },
                      { key: 'branch', label: 'Branch' },
                      { key: 'totalAmount', label: 'Total Amount' },
                      { key: 'status', label: 'Status' },
                      { key: 'createdAt', label: 'Created At' },
                      { key: 'action', label: 'Action' },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1.5 rounded-lg select-none"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns[key as keyof typeof visibleColumns]}
                          onChange={() =>
                            setVisibleColumns((prev) => ({
                              ...prev,
                              [key]: !prev[key as keyof typeof visibleColumns],
                            }))
                          }
                          className="w-3.5 h-3.5 rounded text-purple-600 accent-purple-600 cursor-pointer"
                        />
                        <span className="text-slate-700 font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                title="Sort orders"
                aria-label="Sort orders"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                  sortDropdownOpen ? 'bg-purple-50 text-purple-700 border-purple-300' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>

              {sortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in zoom-in-95 text-xs">
                  <div className="px-3 py-1 font-semibold text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                    Sort by
                  </div>
                  {[
                    { label: 'Date: Newest First', field: 'createdAt', asc: false },
                    { label: 'Date: Oldest First', field: 'createdAt', asc: true },
                    { label: 'Amount: High to Low', field: 'totalAmount', asc: false },
                    { label: 'Amount: Low to High', field: 'totalAmount', asc: true },
                    { label: 'Order #: A to Z', field: 'orderNumber', asc: true },
                  ].map((opt) => {
                    const isSelected = sortField === opt.field && sortAsc === opt.asc;
                    return (
                      <button
                        key={opt.label}
                        onClick={() => {
                          setSortField(opt.field as any);
                          setSortAsc(opt.asc);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Rows per page dropdown (Matches screenshot "10 rows v") */}
            <div className="relative" ref={rowsRef}>
              <button
                onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 font-normal bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <span>{rowsPerPage} rows</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {rowsDropdownOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-30">
                  {[5, 10, 20, 50].map((count) => (
                    <button
                      key={count}
                      onClick={() => {
                        setRowsPerPage(count);
                        setCurrentPage(1);
                        setRowsDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-xs text-left cursor-pointer ${
                        rowsPerPage === count
                          ? 'bg-purple-50 text-purple-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {count} rows
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Batch Notification Bar */}
        {selectedOrderIds.length > 0 && (
          <div className="bg-purple-50/70 border-b border-purple-100 px-6 py-2.5 flex items-center justify-between text-xs text-purple-900">
            <span className="font-semibold">
              {selectedOrderIds.length} order{selectedOrderIds.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onBulkStatusUpdate(selectedOrderIds, 'Approved')}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 font-medium cursor-pointer"
              >
                Approve
              </button>
              <button
                onClick={() => onBulkStatusUpdate(selectedOrderIds, 'Processing')}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 font-medium cursor-pointer"
              >
                Process
              </button>
              <button
                onClick={() => {
                  onBulkDelete(selectedOrderIds);
                  setSelectedOrderIds([]);
                }}
                className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 rounded-md border border-rose-200 font-medium cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedOrderIds([])}
                className="text-slate-500 hover:text-slate-700 ml-2 cursor-pointer underline"
              >
                Deselect all
              </button>
            </div>
          </div>
        )}

        {/* Table Content (Matches screenshot columns and spacing) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[13px] font-semibold text-slate-800 select-none">
                <th className="py-4 pl-6 pr-3 w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all orders on this page"
                    className="w-4.5 h-4.5 rounded-[5px] border-slate-300 text-purple-600 focus:ring-0 accent-purple-600 cursor-pointer"
                  />
                </th>
                {visibleColumns.orderNumber && (
                  <th className="py-4 px-4 font-semibold text-slate-800 text-left">Order #</th>
                )}
                {visibleColumns.customer && (
                  <th className="py-4 px-4 font-semibold text-slate-800 text-left">Customer</th>
                )}
                {visibleColumns.branch && (
                  <th className="py-4 px-4 font-semibold text-slate-800 text-left">Branch</th>
                )}
                {visibleColumns.totalAmount && (
                  <th className="py-4 px-4 font-semibold text-slate-800 text-left">Total Amount</th>
                )}
                {visibleColumns.status && (
                  <th className="py-4 px-4 font-semibold text-slate-800 text-left">Status</th>
                )}
                {visibleColumns.createdAt && (
                  <th className="py-4 px-4 font-semibold text-slate-800 text-left">Created At</th>
                )}
                {visibleColumns.action && (
                  <th className="py-4 pr-6 pl-4 font-semibold text-slate-800 text-right">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">No orders found</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting your filters or create a new order.</p>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, idx) => {
                  const isChecked = selectedOrderIds.includes(order.id);
                  const badge = getStatusBadgeClasses(order.status);
                  const isMenuOpen = activeMenuOrderId === order.id;
                  const isRowSelectedStyle = isChecked
                    ? 'bg-purple-50/40 hover:bg-purple-100/40'
                    : idx % 2 === 1
                    ? 'bg-[#f8f9fe] hover:bg-[#edf0fd]/80'
                    : 'bg-white hover:bg-slate-50/80';

                  return (
                    <tr
                      key={order.id}
                      className={`border-b border-slate-100/60 transition-colors group ${isRowSelectedStyle}`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 pl-6 pr-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOrder(order.id)}
                          aria-label={`Select order ${order.orderNumber}`}
                          className="w-4.5 h-4.5 rounded-[5px] border-slate-300 text-purple-600 focus:ring-0 accent-purple-600 cursor-pointer"
                        />
                      </td>

                      {/* Order # */}
                      {visibleColumns.orderNumber && (
                        <td className="py-4 px-4 text-sm text-slate-600 font-normal">
                          <button
                            onClick={() => onSelectOrder(order)}
                            className="hover:text-purple-600 transition-colors cursor-pointer text-left"
                          >
                            {order.orderNumber}
                          </button>
                        </td>
                      )}

                      {/* Customer */}
                      {visibleColumns.customer && (
                        <td className="py-4 px-4 text-sm text-slate-700 font-normal">
                          {order.customer.name}
                        </td>
                      )}

                      {/* Branch */}
                      {visibleColumns.branch && (
                        <td className="py-4 px-4 text-sm text-slate-500 font-normal">
                          {order.branch}
                        </td>
                      )}

                      {/* Total Amount */}
                      {visibleColumns.totalAmount && (
                        <td className="py-4 px-4 text-sm text-slate-600 font-normal">
                          {formatCurrency(order.totalAmount)}
                        </td>
                      )}

                      {/* Status (Pill badges exactly matching screenshot) */}
                      {visibleColumns.status && (
                        <td className="py-4 px-4 text-left">
                          <span
                            className={`inline-flex items-center px-3.5 py-0.5 rounded-full text-xs font-normal border ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      )}

                      {/* Created At */}
                      {visibleColumns.createdAt && (
                        <td className="py-4 px-4 text-sm text-slate-500 font-normal whitespace-nowrap">
                          {order.createdAt}
                        </td>
                      )}

                      {/* Action (Eye icon + three dots vertical menu icon) */}
                      {visibleColumns.action && (
                        <td className="py-4 pr-6 pl-4 text-right">
                        <div className="flex items-center justify-end gap-3 text-slate-400 relative order-row-action-menu">
                          {/* Quick View Eye Button */}
                          <button
                            onClick={() => onSelectOrder(order)}
                            title="View Order Details"
                            aria-label={`View details for ${order.orderNumber}`}
                            className="hover:text-slate-600 transition-colors cursor-pointer p-0.5"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Context Menu Three Dots Button */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveMenuOrderId(isMenuOpen ? null : order.id)
                              }
                              title="More Options"
                              aria-label={`Options for ${order.orderNumber}`}
                              className="hover:text-slate-600 transition-colors cursor-pointer p-0.5"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Row Action Dropdown */}
                            {isMenuOpen && (
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 text-left">
                                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                  Change Status
                                </div>
                                <button
                                  onClick={() => {
                                    onUpdateOrderStatus(order.id, 'Approved');
                                    setActiveMenuOrderId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                                  <span>Mark Approved</span>
                                </button>
                                <button
                                  onClick={() => {
                                    onUpdateOrderStatus(order.id, 'Processing');
                                    setActiveMenuOrderId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                  <span>Mark Processing</span>
                                </button>
                                <button
                                  onClick={() => {
                                    onUpdateOrderStatus(order.id, 'Ready to ship');
                                    setActiveMenuOrderId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                                  <span>Mark Ready to Ship</span>
                                </button>
                                <button
                                  onClick={() => {
                                    onUpdateOrderStatus(order.id, 'Completed');
                                    setActiveMenuOrderId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span>Mark Completed</span>
                                </button>
                                <button
                                  onClick={() => {
                                    onUpdateOrderStatus(order.id, 'Hold');
                                    setActiveMenuOrderId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                                  <span>Put on Hold</span>
                                </button>

                                <div className="border-t border-slate-100 my-1" />

                                <button
                                  onClick={() => {
                                    onSelectOrder(order);
                                    setActiveMenuOrderId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Print Packing Slip</span>
                                </button>

                                <button
                                  onClick={() => {
                                    onDeleteOrder(order.id);
                                    setActiveMenuOrderId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Delete Order</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination (Matches screenshot: "Showing 1 to 10 of 32 rows", < 1 2 3 ... 45 >) */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-slate-500 select-none">
          <div>
            Showing {totalRows === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + rowsPerPage, totalRows)} of {totalRows} rows
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2 self-center sm:self-auto">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page 1 */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-xs font-medium transition-colors cursor-pointer ${
                currentPage === 1
                  ? 'text-slate-900 font-semibold bg-slate-50/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              1
            </button>

            {/* Page 2 */}
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-xs font-medium transition-colors cursor-pointer ${
                currentPage === 2
                  ? 'text-slate-900 font-semibold bg-slate-50/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              2
            </button>

            {/* Page 3 */}
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-xs font-medium transition-colors cursor-pointer ${
                currentPage === 3
                  ? 'text-slate-900 font-semibold bg-slate-50/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              3
            </button>

            {/* Ellipsis */}
            <span className="px-1 text-slate-400 text-xs flex items-center justify-center">...</span>

            {/* Far page (matches screenshot 45) */}
            <button
              onClick={() => setCurrentPage(45)}
              className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-xs font-medium transition-colors cursor-pointer ${
                currentPage === 45
                  ? 'text-slate-900 font-semibold bg-slate-50/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              45
            </button>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(45, p + 1))}
              aria-label="Next page"
              className="w-8 h-8 rounded-full border border-purple-200 text-purple-600 hover:bg-purple-50 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
