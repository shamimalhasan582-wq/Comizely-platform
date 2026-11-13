import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconPosition = 'left',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && iconPosition === 'left' && (
            <span className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-[#f8fafc] hover:bg-slate-100/70 focus:bg-white text-slate-800 text-sm py-2 rounded-xl border transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-100 ${
              icon && iconPosition === 'left' ? 'pl-9' : 'pl-3.5'
            } ${icon && iconPosition === 'right' ? 'pr-9' : 'pr-3.5'} ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
                : 'border-slate-200/80 focus:border-purple-400'
            } ${className}`}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <span className="absolute right-3 text-slate-400 pointer-events-none flex items-center">
              {icon}
            </span>
          )}
        </div>
        {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-[11px] text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
