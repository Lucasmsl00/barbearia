export function IconEnvelope() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}

export function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AuthField({ icon, label, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</label>
      <div className="flex items-center gap-2.5 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3.5 py-2.5 transition focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/20">
        <span className="text-neutral-500">{icon}</span>
        <input
          {...props}
          className="w-full bg-transparent text-sm text-white placeholder:text-neutral-600 focus:outline-none"
        />
      </div>
    </div>
  );
}
