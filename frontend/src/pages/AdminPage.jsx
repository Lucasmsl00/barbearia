import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

function hojeISO() {
  const hoje = new Date();
  const offset = hoje.getTimezoneOffset();
  return new Date(hoje.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function somarDias(iso, dias) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + dias);
  return dt.toISOString().slice(0, 10);
}

function formatarDataLabel(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", timeZone: "UTC" });
}

/* ---------- ícones ---------- */
const iconCls = "h-4 w-4";
function IconCalendar({ className = iconCls }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}
function IconScissors({ className = iconCls }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M8.5 7.5 20 18M8.5 16.5 20 6" strokeLinecap="round" />
    </svg>
  );
}
function IconClock({ className = iconCls }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconChart({ className = iconCls }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <path d="M4 20V10M12 20V4M20 20v-7" strokeLinecap="round" />
    </svg>
  );
}
function IconUser({ className = iconCls }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" strokeLinecap="round" />
    </svg>
  );
}
function IconImage({ className = iconCls }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.7" />
      <path d="m4 18 5.5-5.5a2 2 0 0 1 2.8 0L18 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconUpload({ className = "h-3.5 w-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 15V4M8 8l4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconPhone({ className = "h-3.5 w-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
function IconChevronLeft({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconChevronRight({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconInbox({ className = "h-9 w-9" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <path d="M4 12h4l2 3h4l2-3h4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="6" width="18" height="14" rx="2" />
    </svg>
  );
}
function IconMoney({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconPlus({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
function IconTrash({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Spinner({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`animate-spin ${className}`}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- primitivos visuais ---------- */
function Card({ className = "", children }) {
  return <div className={`rounded-xl border border-neutral-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function BotaoPrimario({ className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    />
  );
}

function BotaoSecundario({ className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    />
  );
}

function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-xs font-medium text-neutral-500">{label}</span>}
      <input
        {...props}
        className={`w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${className}`}
      />
    </label>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-neutral-600">
      <span
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
          checked ? "bg-amber-500" : "bg-neutral-300"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition ${
            checked ? "translate-x-[18px]" : "translate-x-1"
          }`}
        />
      </span>
      {label}
    </label>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 py-14 text-center">
      <span className="text-neutral-300">{icon}</span>
      <p className="mt-3 text-sm font-medium text-neutral-600">{title}</p>
      {subtitle && <p className="mt-1 text-xs text-neutral-400">{subtitle}</p>}
    </div>
  );
}

/* ---------- Minha conta ---------- */
function AbaConta() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso(false);

    if (novaSenha !== confirmarSenha) {
      setErro("A nova senha e a confirmação não coincidem");
      return;
    }

    setEnviando(true);
    try {
      await api.patch("/api/barbeiros/senha", { senhaAtual, novaSenha });
      setSucesso(true);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (err) {
      setErro(err.response?.data?.message || "Não foi possível trocar a senha");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card className="max-w-sm p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <IconUser />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Trocar senha</h2>
          <p className="text-xs text-neutral-500">Mantenha seu acesso seguro</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <Input label="Senha atual" type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} required />
        <Input
          label="Nova senha"
          type="password"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          minLength={6}
          required
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          minLength={6}
          required
        />
        {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}
        {sucesso && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Senha alterada com sucesso.</p>}
        <BotaoPrimario type="submit" disabled={enviando} className="w-full">
          {enviando && <Spinner />}
          {enviando ? "Salvando..." : "Salvar nova senha"}
        </BotaoPrimario>
      </form>
    </Card>
  );
}

/* ---------- Agenda ---------- */
const STATUS_ESTILO = {
  PENDENTE: { dot: "bg-yellow-500", pill: "bg-yellow-50 text-yellow-800 ring-1 ring-yellow-200" },
  CONFIRMADO: { dot: "bg-blue-500", pill: "bg-blue-50 text-blue-800 ring-1 ring-blue-200" },
  CANCELADO: { dot: "bg-red-500", pill: "bg-red-50 text-red-700 ring-1 ring-red-200" },
  CONCLUIDO: { dot: "bg-green-500", pill: "bg-green-50 text-green-800 ring-1 ring-green-200" },
  REMARCADO: { dot: "bg-neutral-400", pill: "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200" },
};

function AbaAgenda() {
  const [data, setData] = useState(hojeISO());
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [remarcando, setRemarcando] = useState(null);
  const [novaData, setNovaData] = useState("");
  const [novaHora, setNovaHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [erro, setErro] = useState("");

  function carregar() {
    setCarregando(true);
    api
      .get("/api/agendamentos/atendimentos", { params: { data } })
      .then((res) => setAgendamentos(res.data))
      .finally(() => setCarregando(false));
  }

  useEffect(carregar, [data]);

  async function cancelar(id) {
    if (!confirm("Cancelar este agendamento?")) return;
    await api.patch(`/api/agendamentos/${id}/cancelar`);
    carregar();
  }

  async function concluir(id) {
    await api.patch(`/api/agendamentos/${id}/concluir`);
    carregar();
  }

  async function confirmarRemarcacao(id) {
    setErro("");
    try {
      await api.patch(`/api/agendamentos/${id}/remarcar`, {
        novaData,
        novaHoraInicio: novaHora,
        motivo,
      });
      setRemarcando(null);
      setMotivo("");
      carregar();
    } catch (err) {
      setErro(err.response?.data?.message || "Não foi possível remarcar");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <BotaoSecundario onClick={() => setData((d) => somarDias(d, -1))} className="px-2.5" aria-label="Dia anterior">
            <IconChevronLeft />
          </BotaoSecundario>
          <div className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-1.5">
            <IconCalendar className="h-4 w-4 text-neutral-400" />
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="bg-transparent text-sm text-neutral-900 focus:outline-none"
            />
          </div>
          <BotaoSecundario onClick={() => setData((d) => somarDias(d, 1))} className="px-2.5" aria-label="Próximo dia">
            <IconChevronRight />
          </BotaoSecundario>
          {data !== hojeISO() && <BotaoSecundario onClick={() => setData(hojeISO())}>Hoje</BotaoSecundario>}
        </div>
        <span className="text-sm capitalize text-neutral-500">{formatarDataLabel(data)}</span>
      </div>

      <div className="mt-4 space-y-3">
        {carregando && (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-neutral-500">
            <Spinner /> Carregando agenda...
          </div>
        )}
        {!carregando && agendamentos.length === 0 && (
          <EmptyState icon={<IconInbox />} title="Nenhum agendamento nesse dia" subtitle="A agenda está livre." />
        )}
        {agendamentos.map((ag) => {
          const estilo = STATUS_ESTILO[ag.status] || STATUS_ESTILO.PENDENTE;
          return (
            <Card key={ag.id} className="p-4 transition hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-neutral-900">
                    {ag.horaInicio.slice(0, 5)} – {ag.horaFim.slice(0, 5)}
                    <span className="ml-2 font-normal text-neutral-500">· {ag.nomeServico}</span>
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                    <IconUser className="h-3.5 w-3.5" />
                    {ag.nomeCliente}
                    <span className="text-neutral-300">·</span>
                    <IconPhone />
                    {ag.telefoneCliente}
                  </p>
                </div>
                <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${estilo.pill}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${estilo.dot}`} />
                  {ag.status}
                </span>
              </div>

              {(ag.status === "PENDENTE" || ag.status === "CONFIRMADO") && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-neutral-100 pt-3">
                  <button
                    onClick={() => concluir(ag.id)}
                    className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100"
                  >
                    Concluir
                  </button>
                  <button
                    onClick={() => cancelar(ag.id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                  >
                    Cancelar
                  </button>
                  <BotaoSecundario
                    className="px-3 py-1.5 text-xs"
                    onClick={() => {
                      setRemarcando(ag.id);
                      setNovaData(ag.data);
                      setNovaHora(ag.horaInicio.slice(0, 5));
                      setMotivo("");
                      setErro("");
                    }}
                  >
                    Remarcar
                  </BotaoSecundario>
                </div>
              )}

              {remarcando === ag.id && (
                <div className="mt-3 space-y-2 rounded-lg bg-neutral-50 p-3">
                  <div className="flex flex-wrap items-end gap-2">
                    <Input label="Nova data" type="date" value={novaData} onChange={(e) => setNovaData(e.target.value)} className="w-auto" />
                    <Input label="Nova hora" type="time" value={novaHora} onChange={(e) => setNovaHora(e.target.value)} className="w-auto" />
                  </div>
                  <Input
                    label="Motivo (opcional)"
                    type="text"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ex: cliente pediu pra trocar o dia"
                    maxLength={255}
                  />
                  <div className="flex flex-wrap gap-2">
                    <BotaoPrimario onClick={() => confirmarRemarcacao(ag.id)} className="px-3 py-2 text-xs">
                      Confirmar
                    </BotaoPrimario>
                    <BotaoSecundario onClick={() => setRemarcando(null)} className="px-3 py-2 text-xs">
                      Cancelar
                    </BotaoSecundario>
                  </div>
                  {erro && <p className="text-xs text-red-600">{erro}</p>}
                </div>
              )}

              {ag.status === "REMARCADO" && ag.motivoRemarcacao && (
                <p className="mt-2 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
                  <span className="font-medium text-neutral-600">Motivo da remarcação:</span> {ag.motivoRemarcacao}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Serviços ---------- */
function AbaServicos() {
  const [servicos, setServicos] = useState([]);
  const [nome, setNome] = useState("");
  const [duracao, setDuracao] = useState("");
  const [preco, setPreco] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  function carregar() {
    api.get("/api/servicos").then((res) => setServicos(res.data)).finally(() => setCarregando(false));
  }

  useEffect(carregar, []);

  async function criar(e) {
    e.preventDefault();
    setErro("");
    try {
      await api.post("/api/servicos", {
        nome,
        duracaoMinutos: Number(duracao),
        preco: Number(preco),
      });
      setNome("");
      setDuracao("");
      setPreco("");
      carregar();
    } catch (err) {
      setErro(err.response?.data?.message || "Não foi possível criar o serviço");
    }
  }

  async function excluir(id) {
    if (!confirm("Excluir este serviço?")) return;
    await api.delete(`/api/servicos/${id}`);
    carregar();
  }

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <IconPlus />
          </span>
          <h2 className="text-sm font-semibold text-neutral-900">Novo serviço</h2>
        </div>
        <form onSubmit={criar} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[10rem] flex-1">
            <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Corte de cabelo" />
          </div>
          <Input
            label="Duração (min)"
            type="number"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            required
            min="1"
            className="w-28"
          />
          <Input
            label="Preço (R$)"
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            min="0.01"
            className="w-28"
          />
          <BotaoPrimario type="submit">
            <IconPlus className="h-4 w-4" /> Adicionar
          </BotaoPrimario>
        </form>
        {erro && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}
      </Card>

      {carregando ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-neutral-500">
          <Spinner /> Carregando serviços...
        </div>
      ) : servicos.length === 0 ? (
        <EmptyState icon={<IconScissors />} title="Nenhum serviço cadastrado" subtitle="Adicione o primeiro serviço acima." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {servicos.map((s) => (
            <Card key={s.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-neutral-900">{s.nome}</p>
                <p className="mt-0.5 flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <IconClock className="h-3.5 w-3.5" /> {s.duracaoMinutos} min
                  </span>
                  <span className="flex items-center gap-1 font-medium text-amber-700">
                    <IconMoney className="h-3.5 w-3.5" /> R$ {Number(s.preco).toFixed(2)}
                  </span>
                </p>
              </div>
              <button
                onClick={() => excluir(s.id)}
                className="rounded-lg p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Excluir serviço"
              >
                <IconTrash />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Horário de funcionamento ---------- */
const DIAS_SEMANA = [
  { valor: "MONDAY", label: "Segunda" },
  { valor: "TUESDAY", label: "Terça" },
  { valor: "WEDNESDAY", label: "Quarta" },
  { valor: "THURSDAY", label: "Quinta" },
  { valor: "FRIDAY", label: "Sexta" },
  { valor: "SATURDAY", label: "Sábado" },
  { valor: "SUNDAY", label: "Domingo" },
];

function AbaHorarios({ barbeiroId, souDono }) {
  const [barbeiros, setBarbeiros] = useState([]);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(barbeiroId);
  const [horarios, setHorarios] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (souDono) {
      api.get("/api/barbeiros").then((res) => setBarbeiros(res.data));
    }
  }, [souDono]);

  const alvoId = barbeiroSelecionado || barbeiroId;

  function carregar() {
    if (!alvoId) return;
    api.get("/api/horarios-funcionamento", { params: { barbeiroId: alvoId } }).then((res) => setHorarios(res.data));
  }

  useEffect(carregar, [alvoId]);

  function horarioDoDia(dia) {
    return horarios.find((h) => h.diaSemana === dia);
  }

  async function salvar(dia, horaAbertura, horaFechamento, temAlmoco, horaAlmocoInicio, horaAlmocoFim, folga) {
    setErro("");
    try {
      await api.post("/api/horarios-funcionamento", {
        barbeiroId: alvoId,
        diaSemana: dia,
        horaAbertura: folga ? null : horaAbertura,
        horaFechamento: folga ? null : horaFechamento,
        horaAlmocoInicio: !folga && temAlmoco ? horaAlmocoInicio : null,
        horaAlmocoFim: !folga && temAlmoco ? horaAlmocoFim : null,
        folga,
      });
      carregar();
    } catch (err) {
      setErro(err.response?.data?.message || "Não foi possível salvar");
    }
  }

  return (
    <div className="space-y-4">
      {souDono && barbeiros.length > 1 && (
        <Card className="flex items-center gap-3 p-4">
          <span className="text-sm font-medium text-neutral-700">Configurando horário de</span>
          <select
            value={alvoId}
            onChange={(e) => setBarbeiroSelecionado(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            {barbeiros.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nome}
                {b.id === barbeiroId ? " (você)" : ""}
              </option>
            ))}
          </select>
        </Card>
      )}

      {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

      <div className="space-y-2.5">
        {DIAS_SEMANA.map(({ valor, label }) => {
          const existente = horarioDoDia(valor);
          return (
            <LinhaHorario
              key={`${alvoId}-${valor}-${existente?.id || "vazio"}`}
              label={label}
              dia={valor}
              existente={existente}
              onSalvar={salvar}
            />
          );
        })}
      </div>
    </div>
  );
}

function LinhaHorario({ label, dia, existente, onSalvar }) {
  const [abertura, setAbertura] = useState(existente?.horaAbertura?.slice(0, 5) || "09:00");
  const [fechamento, setFechamento] = useState(existente?.horaFechamento?.slice(0, 5) || "19:00");
  const [temAlmoco, setTemAlmoco] = useState(Boolean(existente?.horaAlmocoInicio));
  const [almocoInicio, setAlmocoInicio] = useState(existente?.horaAlmocoInicio?.slice(0, 5) || "12:00");
  const [almocoFim, setAlmocoFim] = useState(existente?.horaAlmocoFim?.slice(0, 5) || "13:00");
  const [folga, setFolga] = useState(existente?.folga || false);
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    setSalvando(true);
    await onSalvar(dia, abertura, fechamento, temAlmoco, almocoInicio, almocoFim, folga);
    setSalvando(false);
  }

  return (
    <Card className={`p-4 transition ${folga ? "bg-neutral-50/60" : ""}`}>
      <div className="flex flex-wrap items-center gap-4">
        <span className="w-20 shrink-0 text-sm font-semibold text-neutral-900">{label}</span>
        <Toggle checked={folga} onChange={setFolga} label="Folga" />

        {!folga && (
          <>
            <div className="flex items-center gap-1.5 text-sm">
              <input
                type="time"
                value={abertura}
                onChange={(e) => setAbertura(e.target.value)}
                className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <span className="text-neutral-400">até</span>
              <input
                type="time"
                value={fechamento}
                onChange={(e) => setFechamento(e.target.value)}
                className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <Toggle checked={temAlmoco} onChange={setTemAlmoco} label="Almoço" />

            {temAlmoco && (
              <div className="flex items-center gap-1.5 text-sm">
                <input
                  type="time"
                  value={almocoInicio}
                  onChange={(e) => setAlmocoInicio(e.target.value)}
                  className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <span className="text-neutral-400">até</span>
                <input
                  type="time"
                  value={almocoFim}
                  onChange={(e) => setAlmocoFim(e.target.value)}
                  className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            )}
          </>
        )}

        <BotaoPrimario onClick={handleSalvar} disabled={salvando} className="ml-auto px-3.5 py-1.5 text-xs">
          {salvando && <Spinner className="h-3.5 w-3.5" />}
          Salvar
        </BotaoPrimario>
      </div>
    </Card>
  );
}

/* ---------- Relatórios ---------- */
function inicioSemanaISO() {
  const hoje = new Date();
  const offset = hoje.getTimezoneOffset();
  const local = new Date(hoje.getTime() - offset * 60000);
  local.setUTCDate(local.getUTCDate() - local.getUTCDay());
  return local.toISOString().slice(0, 10);
}

function fimSemanaISO() {
  const hoje = new Date();
  const offset = hoje.getTimezoneOffset();
  const local = new Date(hoje.getTime() - offset * 60000);
  local.setUTCDate(local.getUTCDate() + (6 - local.getUTCDay()));
  return local.toISOString().slice(0, 10);
}

function inicioMesISO() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`;
}

function fimMesISO() {
  const hoje = new Date();
  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
}

const STATUS_LABEL = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  CANCELADO: "Cancelado",
  CONCLUIDO: "Concluído",
  REMARCADO: "Remarcado",
};

const STATUS_BARRA = {
  PENDENTE: "bg-yellow-400",
  CONFIRMADO: "bg-blue-400",
  CANCELADO: "bg-red-400",
  CONCLUIDO: "bg-green-500",
  REMARCADO: "bg-neutral-400",
};

function calcularVariacao(atual, anterior) {
  if (!anterior) return atual ? 100 : 0;
  return Math.round(((atual - anterior) / anterior) * 1000) / 10;
}

function periodoAnterior(inicio, fim) {
  const dias = Math.round((new Date(fim) - new Date(inicio)) / 86400000) + 1;
  const novoFim = somarDias(inicio, -1);
  const novoInicio = somarDias(novoFim, -(dias - 1));
  return { inicio: novoInicio, fim: novoFim };
}

function DeltaBadge({ valor }) {
  if (valor === null || valor === undefined || Number.isNaN(valor)) return null;
  const positivo = valor >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${positivo ? "text-green-600" : "text-red-600"}`}>
      {positivo ? "▲" : "▼"} {Math.abs(valor)}%
    </span>
  );
}

function StatCard({ label, value, icon, destaque, delta }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-neutral-400">
        {icon}
        <p className="text-xs font-medium text-neutral-500">{label}</p>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className={`text-2xl font-bold ${destaque ? "text-amber-600" : "text-neutral-900"}`}>{value}</p>
        <DeltaBadge valor={delta} />
      </div>
    </Card>
  );
}

function AbaRelatorios() {
  const [periodo, setPeriodo] = useState("semana");
  const [dataInicio, setDataInicio] = useState(inicioSemanaISO());
  const [dataFim, setDataFim] = useState(fimSemanaISO());
  const [relatorio, setRelatorio] = useState(null);
  const [relatorioAnterior, setRelatorioAnterior] = useState(null);
  const [carregando, setCarregando] = useState(false);

  function aplicarPeriodo(novoPeriodo) {
    setPeriodo(novoPeriodo);
    if (novoPeriodo === "semana") {
      setDataInicio(inicioSemanaISO());
      setDataFim(fimSemanaISO());
    } else if (novoPeriodo === "mes") {
      setDataInicio(inicioMesISO());
      setDataFim(fimMesISO());
    }
  }

  useEffect(() => {
    if (!dataInicio || !dataFim) return;
    setCarregando(true);
    const anterior = periodoAnterior(dataInicio, dataFim);
    Promise.all([
      api.get("/api/relatorios", { params: { dataInicio, dataFim } }),
      api.get("/api/relatorios", { params: { dataInicio: anterior.inicio, dataFim: anterior.fim } }),
    ])
      .then(([atual, passado]) => {
        setRelatorio(atual.data);
        setRelatorioAnterior(passado.data);
      })
      .finally(() => setCarregando(false));
  }, [dataInicio, dataFim]);

  const maiorContagemServico = relatorio?.servicosMaisPedidos?.[0]?.quantidade || 1;
  const maiorContagemHora = Math.max(1, ...(relatorio?.horariosPico?.map((h) => h.quantidade) || [1]));

  const concluidos = relatorio?.atendimentosPorStatus?.CONCLUIDO || 0;
  const ticketMedio = concluidos > 0 ? Number(relatorio.faturamentoTotal) / concluidos : 0;
  const concluidosAnterior = relatorioAnterior?.atendimentosPorStatus?.CONCLUIDO || 0;
  const ticketMedioAnterior = concluidosAnterior > 0 ? Number(relatorioAnterior.faturamentoTotal) / concluidosAnterior : 0;

  const deltaFaturamento = relatorioAnterior
    ? calcularVariacao(Number(relatorio?.faturamentoTotal || 0), Number(relatorioAnterior.faturamentoTotal))
    : null;
  const deltaAtendimentos = relatorioAnterior
    ? calcularVariacao(relatorio?.totalAtendimentos || 0, relatorioAnterior.totalAtendimentos)
    : null;
  const deltaTicket = relatorioAnterior ? calcularVariacao(ticketMedio, ticketMedioAnterior) : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-white p-1.5">
        {[
          ["semana", "Esta semana"],
          ["mes", "Este mês"],
          ["personalizado", "Personalizado"],
        ].map(([valor, label]) => (
          <button
            key={valor}
            onClick={() => aplicarPeriodo(valor)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              periodo === valor ? "bg-amber-500 text-neutral-950" : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {periodo === "personalizado" && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
          />
          <span className="text-neutral-400">até</span>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
      )}

      {carregando && (
        <div className="flex items-center justify-center gap-2 py-14 text-sm text-neutral-500">
          <Spinner /> Carregando relatório...
        </div>
      )}

      {!carregando && relatorio && (
        <div className="mt-5 space-y-6">
          <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard
                label="Faturamento"
                value={`R$ ${Number(relatorio.faturamentoTotal).toFixed(2)}`}
                icon={<IconMoney className="h-4 w-4" />}
                destaque
                delta={deltaFaturamento}
              />
              <StatCard label="Atendimentos" value={relatorio.totalAtendimentos} icon={<IconCalendar className="h-4 w-4" />} delta={deltaAtendimentos} />
              <StatCard label="Ticket médio" value={`R$ ${ticketMedio.toFixed(2)}`} icon={<IconMoney className="h-4 w-4" />} delta={deltaTicket} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <StatCard label="Cancelamento" value={`${relatorio.taxaCancelamento}%`} icon={<IconChart className="h-4 w-4" />} />
              <StatCard label="Remarcação" value={`${relatorio.taxaRemarcacao}%`} icon={<IconChart className="h-4 w-4" />} />
            </div>
            <p className="mt-2 text-xs text-neutral-400">Comparado ao período anterior de mesma duração</p>
          </div>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-neutral-900">Atendimentos por status</h3>
            <div className="mt-3 space-y-2">
              {Object.entries(relatorio.atendimentosPorStatus).map(([status, qtd]) => (
                <div key={status} className="flex items-center gap-2 text-xs">
                  <span className="w-24 shrink-0 text-neutral-600">{STATUS_LABEL[status] || status}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className={`h-full rounded-full ${STATUS_BARRA[status] || "bg-neutral-400"}`}
                      style={{
                        width: relatorio.totalAtendimentos
                          ? `${(qtd / relatorio.totalAtendimentos) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right font-medium text-neutral-700">{qtd}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-neutral-900">Serviços mais pedidos</h3>
            {relatorio.servicosMaisPedidos.length === 0 ? (
              <p className="mt-3 text-xs text-neutral-500">Nenhum atendimento nesse período.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {relatorio.servicosMaisPedidos.map((s) => (
                  <div key={s.nome} className="flex items-center gap-2 text-xs">
                    <span className="w-28 shrink-0 truncate text-neutral-600">{s.nome}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: `${(s.quantidade / maiorContagemServico) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right font-medium text-neutral-700">{s.quantidade}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-neutral-900">Horários de pico</h3>
            {!relatorio.horariosPico || relatorio.horariosPico.length === 0 ? (
              <p className="mt-3 text-xs text-neutral-500">Nenhum atendimento nesse período.</p>
            ) : (
              <div className="mt-4 flex h-32 items-end gap-1.5">
                {relatorio.horariosPico.map((h) => (
                  <div key={h.hora} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-neutral-600">{h.quantidade}</span>
                    <div
                      className="w-full rounded-t-md bg-amber-500"
                      style={{ height: `${Math.max(8, (h.quantidade / maiorContagemHora) * 100)}%` }}
                    />
                    <span className="text-[11px] text-neutral-400">{h.hora}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

/* ---------- Fotos do site ---------- */
function CartaoFoto({ slotInfo, onUpload, onRemover, enviando }) {
  const src = `${api.defaults.baseURL}/api/imagens/${slotInfo.slot}?t=${slotInfo.atualizadoEm || ""}`;

  return (
    <Card className="overflow-hidden">
      <div className="flex aspect-video items-center justify-center bg-neutral-100">
        {slotInfo.temImagem ? (
          <img src={src} alt={slotInfo.label} className="h-full w-full object-cover" />
        ) : (
          <IconImage className="h-8 w-8 text-neutral-300" />
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-medium text-neutral-700">{slotInfo.label}</p>
        <div className="mt-2 flex gap-2">
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50">
            {enviando ? <Spinner className="h-3.5 w-3.5" /> : <IconUpload />}
            {slotInfo.temImagem ? "Trocar" : "Enviar"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const arquivo = e.target.files[0];
                if (arquivo) onUpload(slotInfo.slot, arquivo);
                e.target.value = "";
              }}
            />
          </label>
          {slotInfo.temImagem && (
            <button
              onClick={() => onRemover(slotInfo.slot)}
              className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
              aria-label="Remover imagem"
            >
              <IconTrash className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

function AbaFotos() {
  const [slots, setSlots] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviandoSlot, setEnviandoSlot] = useState(null);
  const [erro, setErro] = useState("");

  function carregar() {
    api.get("/api/imagens").then((res) => setSlots(res.data)).finally(() => setCarregando(false));
  }

  useEffect(carregar, []);

  async function upload(slot, arquivo) {
    setErro("");
    setEnviandoSlot(slot);
    const formData = new FormData();
    formData.append("arquivo", arquivo);
    try {
      await api.post(`/api/imagens/${slot}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      carregar();
    } catch (err) {
      setErro(err.response?.data?.message || "Não foi possível enviar a imagem");
    } finally {
      setEnviandoSlot(null);
    }
  }

  async function remover(slot) {
    if (!confirm("Remover esta imagem e voltar ao espaço reservado?")) return;
    await api.delete(`/api/imagens/${slot}`);
    carregar();
  }

  return (
    <div>
      <p className="text-sm text-neutral-500">
        As fotos aqui aparecem direto na página inicial do site. JPEG, PNG ou WEBP, até 4MB cada.
      </p>
      {erro && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

      {carregando ? (
        <div className="flex items-center justify-center gap-2 py-14 text-sm text-neutral-500">
          <Spinner /> Carregando fotos...
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((s) => (
            <CartaoFoto
              key={s.slot}
              slotInfo={s}
              onUpload={upload}
              onRemover={remover}
              enviando={enviandoSlot === s.slot}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- shell ---------- */
const NAV_ITEMS = [
  { valor: "agenda", label: "Agenda", icon: IconCalendar },
  { valor: "servicos", label: "Serviços", icon: IconScissors },
  { valor: "horarios", label: "Horário", icon: IconClock },
  { valor: "relatorios", label: "Relatórios", icon: IconChart, donoOnly: true },
  { valor: "fotos", label: "Fotos do site", icon: IconImage, donoOnly: true },
  { valor: "conta", label: "Minha conta", icon: IconUser },
];

export default function AdminPage() {
  const { barbeiro } = useAuth();
  const [aba, setAba] = useState("agenda");
  const itens = NAV_ITEMS.filter((i) => !i.donoOnly || barbeiro?.dono);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Painel</p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-900">Olá, {barbeiro?.nome?.split(" ")[0] || "barbeiro"}</h1>
        </div>
        {barbeiro?.dono && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Dono</span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* navegação desktop */}
        <nav className="hidden lg:block">
          <div className="sticky top-[73px] space-y-1 rounded-xl border border-neutral-200 bg-white p-2 shadow-sm">
            {itens.map(({ valor, label, icon: Icon }) => (
              <button
                key={valor}
                onClick={() => setAba(valor)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  aba === valor ? "bg-amber-50 text-amber-800" : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                <Icon className={`h-5 w-5 ${aba === valor ? "text-amber-600" : "text-neutral-400"}`} />
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* navegação mobile */}
        <nav className="flex gap-1 overflow-x-auto rounded-xl border border-neutral-200 bg-white p-1.5 shadow-sm lg:hidden">
          {itens.map(({ valor, label, icon: Icon }) => (
            <button
              key={valor}
              onClick={() => setAba(valor)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                aba === valor ? "bg-amber-500 text-neutral-950" : "text-neutral-600"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <div>
          {aba === "agenda" && <AbaAgenda />}
          {aba === "servicos" && <AbaServicos />}
          {aba === "horarios" && <AbaHorarios barbeiroId={barbeiro?.id} souDono={barbeiro?.dono} />}
          {aba === "relatorios" && barbeiro?.dono && <AbaRelatorios />}
          {aba === "fotos" && barbeiro?.dono && <AbaFotos />}
          {aba === "conta" && <AbaConta />}
        </div>
      </div>
    </div>
  );
}
