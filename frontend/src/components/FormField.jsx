const INPUT_BASE = 'w-full rounded-lg border bg-[#141418] px-3 py-2 text-sm text-[#e2e2e8] placeholder-[#4a4a58] transition focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500/50';

/** Reusable labelled form input field */
export function InputField({ label, id, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-[#8080a0] uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`${INPUT_BASE} ${error ? 'border-rose-500/50 bg-rose-500/5' : 'border-[#2a2a35]'}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

/** Select dropdown */
export function SelectField({ label, id, error, children, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-[#8080a0] uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`${INPUT_BASE} ${error ? 'border-rose-500/50' : 'border-[#2a2a35]'} cursor-pointer`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

/** Textarea field */
export function TextareaField({ label, id, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-[#8080a0] uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={3}
        className={`${INPUT_BASE} resize-none ${error ? 'border-rose-500/50 bg-rose-500/5' : 'border-[#2a2a35]'}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
