import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { barbeiro, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            💈 Barbearia
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-neutral-600 hover:text-neutral-900">
              Agendar
            </Link>
            {barbeiro ? (
              <>
                <Link to="/admin" className="text-neutral-600 hover:text-neutral-900">
                  Painel
                </Link>
                <span className="text-neutral-400">|</span>
                <span className="text-neutral-600">{barbeiro.nome}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-700"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-700"
              >
                Login do barbeiro
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
