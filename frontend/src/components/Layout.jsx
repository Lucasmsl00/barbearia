import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { business } from "../config/business";

export default function Layout({ children }) {
  const { barbeiro, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === "/";

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold tracking-tight text-white">
            💈 <span className="text-amber-500">{business.nome}</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="hidden text-neutral-400 hover:text-white sm:inline">
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
        </div>
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
