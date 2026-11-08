import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { SupplierItem } from '../../types';

interface CreateSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSupplier: (supplier: SupplierItem) => void;
}

export const CreateSupplierModal: React.FC<CreateSupplierModalProps> = ({
  isOpen,
  onClose,
  onCreateSupplier,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('Shyampur');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSupplier: SupplierItem = {
      id: `sup-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim() || '8801710123123',
      email: email.trim() || 'support@shopbasebd.com',
      companyName: companyName.trim() || `${name.trim()} Ltd`,
      address: address.trim() || 'Babla Super Market, Shyampur, Dhaka, Dhaka, Dhaka, Bangladesh',
      country,
      division,
      district,
      area,
      totalPurchase: 45000,
      purchasePaid: 45000,
      purchaseDue: 0,
      totalPurchaseReturn: 0,
      history: [
        {
          id: `phist-new-${Date.now()}`,
          date: '25 Sep 2026, 2:11 PM',
          invoiceNo: '62989D',
          branch: 'Online Shop',
          contactNumber: phone.trim() || '8801710123123',
          totalAmount: 45000,
          totalPaid: 45000,
          purchaseDue: 0,
        },
      ],
    };

    onCreateSupplier(newSupplier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 overflow-hidden">
        {/* Top-left blur mesh */}
        <div
          className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(128,117,255,0.28) 0%, rgba(99,102,241,0.18) 50%, transparent 70%)',
            filter: 'blur(28px)',
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10 pb-1">
          <h2 className="text-sm font-bold text-slate-900">Create Supplier</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 relative z-10 text-xs">
          {/* Supplier Name */}
          <div>
            <input
              type="text"
              required
              placeholder="Supplier Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#8075FF]"
            />
          </div>

          {/* Phone Number */}
          <div>
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#8075FF]"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#8075FF]"
            />
          </div>

          {/* Company Name */}
          <div>
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#8075FF]"
            />
          </div>

          {/* Address */}
          <div>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#8075FF]"
            />
          </div>

          {/* Country & Division Selects */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full appearance-none py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white outline-none focus:border-[#8075FF] cursor-pointer"
              >
                <option value="Bangladesh">Country</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="India">India</option>
                <option value="China">China</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full appearance-none py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white outline-none focus:border-[#8075FF] cursor-pointer"
              >
                <option value="Division">Division</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rajshahi">Rajshahi</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* District & Area Selects */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full appearance-none py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white outline-none focus:border-[#8075FF] cursor-pointer"
              >
                <option value="District">District</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Gazipur">Gazipur</option>
                <option value="Narayanganj">Narayanganj</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full appearance-none py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white outline-none focus:border-[#8075FF] cursor-pointer"
              >
                <option value="Area">Area</option>
                <option value="Shyampur">Shyampur</option>
                <option value="Mohammadpur">Mohammadpur</option>
                <option value="Dhanmondi">Dhanmondi</option>
                <option value="Gulshan">Gulshan</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm shadow-[#8075FF]/25 transition-colors"
            >
              Create Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

