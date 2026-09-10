import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { business } from "../config/business";

const PAGINAS_IMERSIVAS = ["/", "/login", "/registrar", "/agendar"];

export default function Layout({ children }) {
  const { barbeiro, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isImersiva = PAGINAS_IMERSIVAS.includes(location.pathname);
  const isAdmin = location.pathname === "/admin";
  const [menuAberto, setMenuAberto] = useState(false);

  function handleLogout() {
    logout();
    setMenuAberto(false);
    navigate("/");
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
          <Link
            to="/"
            onClick={fecharMenu}
            className="flex min-w-0 shrink items-center gap-2 text-base font-semibold tracking-tight text-white sm:text-lg"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-base">
              💈
            </span>
            <span className="truncate text-amber-500">{business.nome}</span>
          </Link>

          {/* nav desktop */}
          <nav className="hidden items-center gap-5 text-sm sm:flex">
            <Link to="/" className="text-neutral-400 transition hover:text-white">
              Início
            </Link>
            <Link
              to="/agendar"
              className="rounded-full bg-amber-500 px-4 py-2 font-semibold text-neutral-950 transition hover:bg-amber-400"
            >
              Agendar
            </Link>
            {barbeiro ? (
              <>
                <Link to="/admin" className="text-neutral-400 transition hover:text-white">
                  Painel
                </Link>
                <span className="h-5 w-px bg-neutral-800" />
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-amber-400">
                    {barbeiro.nome?.[0]?.toUpperCase()}
                  </span>
                  <button onClick={handleLogout} className="text-neutral-400 transition hover:text-white">
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="text-neutral-400 transition hover:text-white">
                Sou barbeiro
              </Link>
            )}
          </nav>

          {/* botões mobile: Agendar sempre visível + hamburguer */}
          <div className="flex shrink-0 items-center gap-2 sm:hidden">
            <Link
              to="/agendar"
              onClick={fecharMenu}
              className="rounded-full bg-amber-500 px-3 py-1.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
            >
              Agendar
            </Link>
            <button
              onClick={() => setMenuAberto((v) => !v)}
              aria-label="Abrir menu"
              aria-expanded={menuAberto}
              className="rounded-md border border-neutral-700 p-2 text-neutral-300"
            >
              {menuAberto ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* menu mobile expandido */}
        {menuAberto && (
          <nav className="flex flex-col gap-1 border-t border-neutral-800 px-4 py-3 text-sm sm:hidden">
            <Link to="/" onClick={fecharMenu} className="rounded-md px-2 py-2 text-neutral-300 hover:bg-neutral-900">
              Início
            </Link>
            {barbeiro ? (
              <>
                <Link to="/admin" onClick={fecharMenu} className="rounded-md px-2 py-2 text-neutral-300 hover:bg-neutral-900">
                  Painel
                </Link>
                <button onClick={handleLogout} className="rounded-md px-2 py-2 text-left text-neutral-300 hover:bg-neutral-900">
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" onClick={fecharMenu} className="rounded-md px-2 py-2 text-neutral-300 hover:bg-neutral-900">
                Sou barbeiro
              </Link>
            )}
          </nav>
        )}
      </header>
      {isImersiva ? (
        <main>{children}</main>
      ) : (
        <main className="min-h-[calc(100vh-57px)] bg-neutral-50 text-neutral-900">
          <div className={`mx-auto px-4 py-8 sm:py-10 ${isAdmin ? "max-w-6xl" : "max-w-4xl"}`}>{children}</div>
        </main>
      )}
    </div>
  );
}
