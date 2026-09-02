import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { business } from "../config/business";

export default function Layout({ children }) {
  const { barbeiro, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === "/";
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
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" onClick={fecharMenu} className="text-lg font-semibold tracking-tight text-white">
            💈 <span className="text-amber-500">{business.nome}</span>
          </Link>

          {/* nav desktop */}
          <nav className="hidden items-center gap-4 text-sm sm:flex">
            <Link to="/" className="text-neutral-400 hover:text-white">
              Início
            </Link>
            <Link
              to="/agendar"
              className="rounded-md bg-amber-500 px-3 py-1.5 font-medium text-neutral-950 hover:bg-amber-400"
            >
              Agendar
            </Link>
            {barbeiro ? (
              <>
                <Link to="/admin" className="text-neutral-400 hover:text-white">
                  Painel
                </Link>
                <button onClick={handleLogout} className="text-neutral-400 hover:text-white">
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" className="text-neutral-400 hover:text-white">
                Sou barbeiro
              </Link>
            )}
          </nav>

          {/* botões mobile: Agendar sempre visível + hamburguer */}
          <div className="flex items-center gap-2 sm:hidden">
            <Link
              to="/agendar"
              onClick={fecharMenu}
              className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-amber-400"
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
      {isLanding ? (
        <main>{children}</main>
      ) : (
        <main className="mx-auto max-w-4xl bg-neutral-50 px-4 py-8 text-neutral-900">
          <div className="min-h-[70vh]">{children}</div>
        </main>
      )}
    </div>
  );
}
