import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CustomerTag } from '../../types';

interface CreateCustomerTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTag: (tag: CustomerTag) => void;
  editingTag?: CustomerTag | null;
}

export const CreateCustomerTagModal: React.FC<CreateCustomerTagModalProps> = ({
  isOpen,
  onClose,
  onCreateTag,
  editingTag,
}) => {
  const [tagName, setTagName] = useState(editingTag?.name ?? '');

  React.useEffect(() => {
    setTagName(editingTag?.name ?? '');
  }, [editingTag, isOpen]);

  const handleSubmit = () => {
    if (!tagName.trim()) return;
    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

    onCreateTag({
      id: editingTag?.id ?? `tag-${Date.now()}`,
      name: tagName.trim(),
      createdAt: editingTag?.createdAt ?? dateStr,
    });
    setTagName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">
            {editingTag ? 'Edit Customer Tag' : 'Create Customer Tag'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <input
            type="text"
            placeholder="Customer Name Tag"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#8075FF] transition-colors placeholder:text-slate-400"
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
          >
            {editingTag ? 'Update Customer Tag' : 'Create Customer Tag'}
          </button>
        </div>
      </div>
    </div>
  );
};

