import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Headphones,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Store,
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSupport: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  onOpenStorePreview: () => void;
  onNavigateSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenSupport,
  onOpenNotifications,
  unreadNotificationsCount,
  onOpenStorePreview,
  onNavigateSettings,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-18 bg-white px-6 flex items-center justify-between shrink-0 z-10">
      {/* Search Input Bar (rounded pill like screenshot) */}
      <div className="w-80 md:w-96 relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-[#f8fafc] hover:bg-slate-100/70 focus:bg-white text-slate-800 text-sm pl-9 pr-8 py-2 rounded-full border border-slate-200/70 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Icons & User Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Support / Helpdesk Headset */}
        <button
          onClick={onOpenSupport}
          title="Customer Support & Helpdesk"
          aria-label="Open support"
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer border border-transparent hover:border-purple-100"
        >
          <Headphones className="w-5 h-5" />
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          title="Notifications"
          aria-label="Open notifications"
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer relative border border-transparent hover:border-purple-100"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white absolute top-2 right-2 animate-pulse" />
          )}
        </button>

        {/* User Profile Pill / Avatar */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="MR MD Saidur Rahman"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-100"
              />
              <span className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0" />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                <p className="text-sm font-bold text-slate-900 truncate">MR MD Saidur Rahman</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-medium text-emerald-600">Store Administrator</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onOpenStorePreview();
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Store className="w-4 h-4 text-slate-400" />
                  <span>Preview Store (Biponil.com)</span>
                </button>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onNavigateSettings();
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Store Settings</span>
                </button>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onOpenSupport();
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Security & Roles</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
