import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Customer } from '../../types';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCustomer: (customer: Customer) => void;
}

const COUNTRIES = ['Bangladesh', 'India', 'Pakistan', 'Nepal', 'Sri Lanka'];
const DIVISIONS = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'];
const DISTRICTS = ['Dhaka', 'Gazipur', 'Narayanganj', 'Chittagong', 'Cox\'s Bazar'];
const AREAS = ['Mirpur', 'Uttara', 'Dhanmondi', 'Gulshan', 'Mohammadpur', 'Shyampur'];

export const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
  isOpen,
  onClose,
  onCreateCustomer,
}) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    alternativePhone: '',
    companyName: '',
    address: '',
    country: '',
    division: '',
    district: '',
    area: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: [form.address, form.area, form.district, form.division, form.country].filter(Boolean).join(', '),
      city: form.district || 'Dhaka',
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      tier: 'Regular',
      totalSale: 0,
      salePaid: 0,
      saleDue: 0,
      totalSaleReturn: 0,
    };
    onCreateCustomer(newCustomer);
    setForm({ name: '', email: '', phone: '', alternativePhone: '', companyName: '', address: '', country: '', division: '', district: '', area: '' });
    onClose();
  };

  if (!isOpen) return null;

  const inputCls = 'w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#8075FF] transition-colors placeholder:text-slate-400';
  const selectCls = 'w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#8075FF] transition-colors bg-white text-slate-700 appearance-none cursor-pointer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Create Customer</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-3 max-h-[75vh] overflow-y-auto">
          <input
            type="text"
            placeholder="Customer Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={inputCls}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={inputCls}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={inputCls}
          />
          <input
            type="tel"
            placeholder="Alternative Phone"
            value={form.alternativePhone}
            onChange={(e) => handleChange('alternativePhone', e.target.value)}
            className={inputCls}
          />
          <input
            type="text"
            placeholder="Company Name"
            value={form.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className={inputCls}
          />
          <input
            type="text"
            placeholder="Address"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className={inputCls}
          />

          {/* Country / Division */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select
                value={form.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className={selectCls}
              >
                <option value="" disabled>Country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
            </div>
            <div className="relative">
              <select
                value={form.division}
                onChange={(e) => handleChange('division', e.target.value)}
                className={selectCls}
              >
                <option value="" disabled>Division</option>
                {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
            </div>
          </div>

          {/* District / Area */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select
                value={form.district}
                onChange={(e) => handleChange('district', e.target.value)}
                className={selectCls}
              >
                <option value="" disabled>District</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
            </div>
            <div className="relative">
              <select
                value={form.area}
                onChange={(e) => handleChange('area', e.target.value)}
                className={selectCls}
              >
                <option value="" disabled>Area</option>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
          >
            Create Customer
          </button>
        </div>
      </div>
    </div>
  );
};

