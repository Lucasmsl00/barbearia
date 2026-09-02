// Espaço reservado pra foto real. Troque por <img src="/gallery/arquivo.jpg" .../>
// quando tiver as fotos da barbearia — basta colocar os arquivos em frontend/public/gallery/
export default function PlaceholderImage({ label, className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-amber-500/30 bg-neutral-800 text-neutral-500 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-8 w-8 opacity-50"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span className="px-3 text-center text-xs">{label}</span>
    </div>
  );
}
