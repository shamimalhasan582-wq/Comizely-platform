import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'pending'
    | 'followUp'
    | 'approved'
    | 'processing'
    | 'readyToShip'
    | 'delivered'
    | 'returned'
    | 'cancelled'
    | 'neutral'
    | 'primary';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
  };

  const variantClasses = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    followUp: 'bg-purple-50 text-purple-700 border border-purple-200/60',
    approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    processing: 'bg-sky-50 text-sky-700 border border-sky-200/60',
    readyToShip: 'bg-violet-50 text-violet-700 border border-violet-200/60',
    delivered: 'bg-teal-50 text-teal-700 border border-teal-200/60',
    returned: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    cancelled: 'bg-slate-100 text-slate-600 border border-slate-200/60',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/60',
    primary: 'bg-[#F0F1FF] text-[#6355FF] border border-[#6355FF]/20',
  };

  const dotColorClasses = {
    pending: 'bg-amber-500',
    followUp: 'bg-purple-500',
    approved: 'bg-emerald-500',
    processing: 'bg-sky-500',
    readyToShip: 'bg-violet-500',
    delivered: 'bg-teal-500',
    returned: 'bg-rose-500',
    cancelled: 'bg-slate-400',
    neutral: 'bg-slate-500',
    primary: 'bg-[#6355FF]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 select-none transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColorClasses[variant]}`}
        />
      )}
      {children}
    </span>
  );
};

