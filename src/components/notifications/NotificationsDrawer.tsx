import React from 'react';
import { X, Bell, CheckCircle2, AlertCircle, ShoppingBag, Truck } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'order' | 'stock' | 'return' | 'courier';
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onDismiss,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/35 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] text-purple-600 hover:text-purple-700 font-semibold cursor-pointer"
            >
              Mark all read
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-3 overflow-y-auto space-y-2 flex-1 text-xs">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border transition-colors flex items-start justify-between gap-2.5 ${
                  n.read
                    ? 'bg-white border-slate-100 text-slate-600'
                    : 'bg-purple-50/40 border-purple-100 text-slate-800'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {n.type === 'order' && <ShoppingBag className="w-4 h-4 text-purple-600" />}
                    {n.type === 'stock' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                    {n.type === 'courier' && <Truck className="w-4 h-4 text-blue-500" />}
                    {n.type === 'return' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-xs">{n.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{n.description}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                  </div>
                </div>

                <button
                  onClick={() => onDismiss(n.id)}
                  className="text-slate-300 hover:text-slate-600 p-0.5"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
