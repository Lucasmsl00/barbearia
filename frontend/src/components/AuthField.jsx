import { useState } from "react";

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

function IconEye({ visivel }) {
  return visivel ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.75" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.75" />
      <path d="M3 3l18 18" strokeLinecap="round" />
    </svg>
  );
}

export default function AuthField({ icon, label, ...props }) {
  const [mostrar, setMostrar] = useState(false);
  const ehSenha = props.type === "password";

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</label>
      <div className="flex items-center gap-2.5 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3.5 py-2.5 transition focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/20">
        <span className="text-neutral-500">{icon}</span>
        <input
          {...props}
          type={ehSenha && mostrar ? "text" : props.type}
          className="w-full bg-transparent text-sm text-white placeholder:text-neutral-600 focus:outline-none"
        />
        {ehSenha && (
          <button
            type="button"
            onClick={() => setMostrar((v) => !v)}
            className="text-neutral-500 transition hover:text-neutral-300"
            aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
          >
            <IconEye visivel={mostrar} />
          </button>
        )}
      </div>
    </div>
  );
}
