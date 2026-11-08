import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

export type DeliveryType = 'Regular' | 'Express';
export type ShippingZone = 'Inside' | 'Outside' | 'Suburb';

export interface ShippingDetails {
  partner: string;
  deliveryType: DeliveryType | null;
  zone: ShippingZone;
  charge: number;
}

interface ShippingChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCharge: number;
  currentPartner?: string;
  currentDeliveryType?: DeliveryType | null;
  currentZone?: ShippingZone;
  onSave: (details: ShippingDetails) => void;
}

const COURIER_PARTNERS = [
  'Steadfast Courier',
  'Pathao Courier',
  'RedX Delivery',
  'Paperfly',
  'Sundarban Courier',
  'eCourier',
  'SA Paribahan',
];

const ZONE_DEFAULTS: Record<ShippingZone, number> = {
  Inside: 50,
  Outside: 120,
  Suburb: 80,
};

export const ShippingChargeModal: React.FC<ShippingChargeModalProps> = ({
  isOpen,
  onClose,
  currentCharge,
  currentPartner = '',
  currentDeliveryType = null,
  currentZone = 'Inside',
  onSave,
}) => {
  const [partner, setPartner] = useState<string>(currentPartner);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType | null>(currentDeliveryType);
  const [zone, setZone] = useState<ShippingZone>(currentZone);
  const [charge, setCharge] = useState<string>(
    currentCharge !== undefined && currentCharge !== null && currentCharge > 0
      ? currentCharge.toString()
      : ''
  );
  const [customEdited, setCustomEdited] = useState(false);
  const partnerDropdownRef = useRef<HTMLDivElement>(null);

  // Sync initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPartner(currentPartner);
      setDeliveryType(currentDeliveryType);
      setZone(currentZone || 'Inside');
      setCharge(
        currentCharge !== undefined && currentCharge !== null && currentCharge > 0
          ? currentCharge.toString()
          : ZONE_DEFAULTS[currentZone || 'Inside'].toString()
      );
      setCustomEdited(false);
      setIsPartnerOpen(false);
    }
  }, [isOpen, currentCharge, currentPartner, currentDeliveryType, currentZone]);

  // Close partner dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        partnerDropdownRef.current &&
        !partnerDropdownRef.current.contains(e.target as Node)
      ) {
        setIsPartnerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleZoneSelect = (newZone: ShippingZone) => {
    setZone(newZone);
    if (!customEdited) {
      setCharge(ZONE_DEFAULTS[newZone].toString());
    }
  };

  const handleSave = () => {
    const numCharge = parseFloat(charge) || 0;
    onSave({
      partner,
      deliveryType,
      zone,
      charge: numCharge,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative bg-white rounded-3xl max-w-[420px] w-full p-6 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow mesh at top-left matching image_cd63c2e5.png */}
        <div
          className="absolute -top-10 -left-10 w-44 h-32 rounded-full bg-gradient-to-br from-purple-400/30 via-indigo-400/25 to-pink-400/10 blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Header */}
        <div className="relative flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Shipping Charge
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="relative pt-4 space-y-4">
          {/* Field 1: Delivery Partner Dropdown */}
          <div className="relative" ref={partnerDropdownRef}>
            <button
              type="button"
              onClick={() => setIsPartnerOpen(!isPartnerOpen)}
              className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 flex items-center justify-between text-xs transition-colors text-left cursor-pointer shadow-2xs"
            >
              <span
                className={
                  partner ? 'text-slate-800 font-semibold' : 'text-slate-400 font-medium'
                }
              >
                {partner || 'Delivery Partner'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  isPartnerOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isPartnerOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-slate-100 shadow-xl z-30 max-h-48 overflow-y-auto divide-y divide-slate-50 py-1">
                {COURIER_PARTNERS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPartner(p);
                      setIsPartnerOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between hover:bg-purple-50 transition-colors cursor-pointer ${
                      partner === p
                        ? 'text-purple-600 font-bold bg-purple-50/50'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>{p}</span>
                    {partner === p && <Check className="w-3.5 h-3.5 text-purple-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Field 2: Select Delivery Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Select Delivery Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Regular Option */}
              <button
                type="button"
                onClick={() =>
                  setDeliveryType(deliveryType === 'Regular' ? null : 'Regular')
                }
                className={`flex items-center gap-2.5 py-2.5 px-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                  deliveryType === 'Regular'
                    ? 'border-purple-300 bg-purple-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center transition-colors ${
                    deliveryType === 'Regular'
                      ? 'border-2 border-purple-600'
                      : 'border border-slate-300 bg-white'
                  }`}
                >
                  {deliveryType === 'Regular' && (
                    <div className="w-2 h-2 rounded-full bg-purple-600" />
                  )}
                </div>
                <span className="text-xs font-medium text-slate-700">Regular</span>
              </button>

              {/* Express Option */}
              <button
                type="button"
                onClick={() =>
                  setDeliveryType(deliveryType === 'Express' ? null : 'Express')
                }
                className={`flex items-center gap-2.5 py-2.5 px-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                  deliveryType === 'Express'
                    ? 'border-purple-300 bg-purple-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center transition-colors ${
                    deliveryType === 'Express'
                      ? 'border-2 border-purple-600'
                      : 'border border-slate-300 bg-white'
                  }`}
                >
                  {deliveryType === 'Express' && (
                    <div className="w-2 h-2 rounded-full bg-purple-600" />
                  )}
                </div>
                <span className="text-xs font-medium text-slate-700">Express</span>
              </button>
            </div>
          </div>

          {/* Field 3: Select Shipping Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Select Shipping Zone
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { id: 'Inside', label: 'Inside' },
                  { id: 'Outside', label: 'Outside' },
                  { id: 'Suburb', label: 'Suburb' },
                ] as const
              ).map((z) => {
                const isSelected = zone === z.id;
                return (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => handleZoneSelect(z.id)}
                    className={`flex items-center gap-2 py-2.5 px-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'border-purple-300 bg-purple-50/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-2 border-purple-600'
                          : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-purple-600" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium truncate ${
                        isSelected ? 'text-slate-800' : 'text-slate-700'
                      }`}
                    >
                      {z.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Field 4: Shipping Charge Input */}
          <div>
            <input
              type="number"
              min="0"
              placeholder="Shipping Charge"
              value={charge}
              onChange={(e) => {
                setCharge(e.target.value);
                setCustomEdited(true);
              }}
              className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white font-semibold text-xs rounded-xl shadow-sm shadow-[#8075FF]/25 transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
