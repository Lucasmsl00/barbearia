import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { business } from "../config/business";
import AuthField, { IconEnvelope, IconLock } from "../components/AuthField";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await login(email, senha);
      navigate("/admin");
    } catch {
      setErro("E-mail ou senha inválidos");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-57px)] items-center justify-center overflow-hidden bg-neutral-950 px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 0%, rgba(217,119,6,0.18), transparent 60%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-2xl">
            💈
          </span>
          <h1 className="mt-4 text-2xl font-bold text-white">Painel do barbeiro</h1>
          <p className="mt-1 text-sm text-neutral-500">{business.nome}</p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 shadow-2xl shadow-black/40 backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthField
              icon={<IconEnvelope />}
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@barbearia.com"
              required
              autoFocus
            />
            <AuthField
              icon={<IconLock />}
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
            />

            {erro && (
              <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-400">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
