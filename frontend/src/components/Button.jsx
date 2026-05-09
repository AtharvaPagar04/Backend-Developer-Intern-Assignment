/** Reusable button — dark-mode variants */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0e0e10] disabled:opacity-40 disabled:cursor-not-allowed';

  const variants = {
    primary:   'bg-violet-600 text-white hover:bg-violet-500 focus:ring-violet-500 shadow-lg shadow-violet-900/30',
    secondary: 'bg-[#2a2a32] text-[#c8c8d4] hover:bg-[#32323c] focus:ring-zinc-600 border border-[#3a3a44]',
    danger:    'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 focus:ring-rose-500 border border-rose-500/20',
    ghost:     'text-[#9090a0] hover:bg-[#1e1e25] hover:text-[#c8c8d4] focus:ring-zinc-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
