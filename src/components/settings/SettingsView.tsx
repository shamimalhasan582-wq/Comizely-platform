import React, { useState, useRef, useEffect } from 'react';
import {
  Settings,
  Store,
  Truck,
  Shield,
  Bell,
  Save,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Download,
  Plus,
  Trash2,
} from 'lucide-react';
import { branchesList } from '../../data/mockData';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'shipping' | 'branches' | 'notifications'>('profile');
  const [storeName, setStoreName] = useState('Biponil.com');
  const [storeEmail, setStoreEmail] = useState('support@biponil.com');
  const [storePhone, setStorePhone] = useState('+880 1800-000000');
  const [currency, setCurrency] = useState('BDT');
  const [shippingInsideDhaka, setShippingInsideDhaka] = useState(60);
  const [shippingOutsideDhaka, setShippingOutsideDhaka] = useState(120);
  const [shippingSuburb, setShippingSuburb] = useState(80);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(2500);
  const [branches, setBranches] = useState<string[]>(branchesList);
  const [newBranch, setNewBranch] = useState('');
  const [orderSmsAlert, setOrderSmsAlert] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [returnEmailAlert, setReturnEmailAlert] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);

  const moreActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreActionsRef.current && !moreActionsRef.current.contains(e.target as Node)) {
        setMoreActionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.trim()) return;
    setBranches([...branches, newBranch.trim()]);
    setNewBranch('');
  };

  const handleRemoveBranch = (branchToRemove: string) => {
    setBranches(branches.filter((b) => b !== branchToRemove));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    setStoreName('Biponil.com');
    setCurrency('BDT');
    setShippingInsideDhaka(60);
    setShippingOutsideDhaka(120);
    setShippingSuburb(80);
    setFreeShippingThreshold(2500);
    setBranches(branchesList);
    setMoreActionsOpen(false);
    handleSave();
  };

  const exportConfig = () => {
    const config = {
      storeName,
      storeEmail,
      storePhone,
      currency,
      shippingInsideDhaka,
      shippingOutsideDhaka,
      shippingSuburb,
      freeShippingThreshold,
      branches,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `store_settings_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMoreActionsOpen(false);
  };

  const tabs = [
    { id: 'profile', label: 'Store Profile' },
    { id: 'shipping', label: 'Delivery & Logistics' },
    { id: 'branches', label: `Branches & Hubs (${branches.length})` },
    { id: 'notifications', label: 'Alerts & Notifications' },
  ] as const;

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2]">
      {/* Top Header Row (Matches Orders style: Title on left, More Actions + Save Changes on right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>

        <div className="flex items-center gap-2.5 flex-wrap">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Saved Successfully</span>
            </div>
          )}

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
                  onClick={handleResetDefaults}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                  <span>Reset to Defaults</span>
                </button>
                <button
                  onClick={exportConfig}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Export Settings JSON</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => handleSave()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-2xl shadow-sm shadow-[#8075FF]/25 transition-all cursor-pointer hover:shadow-md active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Main Settings Card (matches Orders table card container) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Sub-tabs Row */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-6 overflow-x-auto pb-1 scrollbar-none text-sm select-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-1 whitespace-nowrap text-sm transition-all cursor-pointer relative ${
                    isActive
                      ? 'font-bold text-slate-900 border-b-2 border-purple-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-5 max-w-2xl text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Store Domain / Name *</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Base Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-400 cursor-pointer"
                  >
                    <option value="BDT">BDT (Bangladeshi Taka)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Support Email</label>
                  <input
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Helpline Phone</label>
                  <input
                    type="text"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-5 max-w-2xl text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Inside Dhaka Delivery Charge (BDT)
                  </label>
                  <input
                    type="number"
                    value={shippingInsideDhaka}
                    onChange={(e) => setShippingInsideDhaka(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Outside Dhaka Delivery Charge (BDT)
                  </label>
                  <input
                    type="number"
                    value={shippingOutsideDhaka}
                    onChange={(e) => setShippingOutsideDhaka(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Suburb Area Delivery Charge (BDT)
                  </label>
                  <input
                    type="number"
                    value={shippingSuburb}
                    onChange={(e) => setShippingSuburb(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Free Delivery Threshold (BDT)
                  </label>
                  <input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branches' && (
            <div className="space-y-5 max-w-2xl text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Active Retail Outlets & Hubs</label>
                <div className="flex flex-wrap gap-2.5">
                  {branches.map((b) => (
                    <div
                      key={b}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                    >
                      <span>{b}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBranch(b)}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                        title="Remove branch"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAddBranch} className="flex gap-2.5 pt-2 max-w-md">
                <input
                  type="text"
                  placeholder="Enter branch name (e.g. Uttara Sector 11)..."
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Add Branch
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-2xl text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div>
                  <p className="font-bold text-slate-800">Order SMS Confirmation</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Send instant SMS invoice link to customer when order is placed</p>
                </div>
                <input
                  type="checkbox"
                  checked={orderSmsAlert}
                  onChange={(e) => setOrderSmsAlert(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-400 cursor-pointer accent-purple-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div>
                  <p className="font-bold text-slate-800">Low Stock Push Alert</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Alert store managers when product units fall under 10</p>
                </div>
                <input
                  type="checkbox"
                  checked={lowStockAlert}
                  onChange={(e) => setLowStockAlert(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-400 cursor-pointer accent-purple-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div>
                  <p className="font-bold text-slate-800">Return & Exchange Email Digest</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Receive notifications when customer submits RMA return request</p>
                </div>
                <input
                  type="checkbox"
                  checked={returnEmailAlert}
                  onChange={(e) => setReturnEmailAlert(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-400 cursor-pointer accent-purple-600"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
