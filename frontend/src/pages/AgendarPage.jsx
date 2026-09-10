import { useEffect, useRef, useState } from "react";
import api from "../api/client";
import { business } from "../config/business";

function hojeISO() {
  const hoje = new Date();
  const offset = hoje.getTimezoneOffset();
  return new Date(hoje.getTime() - offset * 60000).toISOString().slice(0, 10);
}

// A barbearia só aceita agendamento dentro da semana atual (domingo a sábado)
function fimDaSemanaISO() {
  const hoje = new Date();
  const offset = hoje.getTimezoneOffset();
  const local = new Date(hoje.getTime() - offset * 60000);
  const diasAteSabado = 6 - local.getUTCDay();
  local.setUTCDate(local.getUTCDate() + diasAteSabado);
  return local.toISOString().slice(0, 10);
}

function IconClock({ className = "h-3.5 w-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheck({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepBadge({ n }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-neutral-950">
      {n}
    </span>
  );
}

function StepLabel({ n, children }) {
  return (
    <div className="flex items-center gap-2.5">
      <StepBadge n={n} />
      <span className="text-sm font-semibold text-white">{children}</span>
    </div>
  );
}

const fieldCls =
  "w-full rounded-lg border border-neutral-800 bg-neutral-900/60 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 transition focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20";

export default function AgendarPage() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [barbeiroId, setBarbeiroId] = useState("");
  const [servicoId, setServicoId] = useState("");
  const [data, setData] = useState(hojeISO());
  const [horarios, setHorarios] = useState([]);
  const [horaSelecionada, setHoraSelecionada] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(null);

  const captchaRef = useRef(null);
  const captchaWidgetId = useRef(null);

  // renderiza o widget do reCAPTCHA assim que ele aparece na tela (depois que o cliente escolhe o horário)
  useEffect(() => {
    if (!horaSelecionada) return;

    let cancelado = false;
    function tentarRenderizar() {
      if (cancelado) return;
      if (window.grecaptcha && window.grecaptcha.render && captchaRef.current && captchaWidgetId.current === null) {
        captchaWidgetId.current = window.grecaptcha.render(captchaRef.current, {
          sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        });
      } else if (!window.grecaptcha) {
        setTimeout(tentarRenderizar, 300);
      }
    }
    tentarRenderizar();

    return () => {
      cancelado = true;
    };
  }, [horaSelecionada]);

  useEffect(() => {
    api.get("/api/barbeiros").then((res) => {
      setBarbeiros(res.data);
      if (res.data.length === 1) setBarbeiroId(res.data[0].id);
    });
    api.get("/api/servicos").then((res) => setServicos(res.data));
  }, []);

  useEffect(() => {
    setHoraSelecionada("");
    setHorarios([]);
    captchaWidgetId.current = null;
    if (!barbeiroId || !servicoId || !data) return;

    setCarregandoHorarios(true);
    api
      .get("/api/agendamentos/horarios-disponiveis", {
        params: { barbeiroId, servicoId, data },
      })
      .then((res) => setHorarios(res.data))
      .catch(() => setHorarios([]))
      .finally(() => setCarregandoHorarios(false));
  }, [barbeiroId, servicoId, data]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    const captchaToken =
      captchaWidgetId.current !== null ? window.grecaptcha?.getResponse(captchaWidgetId.current) : "";
    if (!captchaToken) {
      setErro('Marque o captcha "Não sou um robô" pra confirmar o agendamento.');
      return;
    }

    setEnviando(true);
    try {
      const { data: agendamento } = await api.post("/api/agendamentos", {
        nomeCliente,
        telefoneCliente,
        barbeiroId,
        servicoId,
        data,
        horaInicio: horaSelecionada,
        captchaToken,
      });
      setSucesso(agendamento);
    } catch (err) {
      setErro(err.response?.data?.message || "Não foi possível agendar. Tente outro horário.");
      if (captchaWidgetId.current !== null) window.grecaptcha?.reset(captchaWidgetId.current);
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-neutral-950 px-4 py-16">
        <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 text-green-400">
            <IconCheck />
          </span>
          <h1 className="mt-4 text-xl font-bold text-white">Agendamento confirmado!</h1>
          <p className="mt-3 text-sm text-neutral-400">
            <span className="font-medium text-neutral-200">{sucesso.nomeServico}</span> com {sucesso.nomeBarbeiro}
          </p>
          <p className="mt-1 text-lg font-semibold text-amber-500">
            {new Date(sucesso.data + "T00:00:00").toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}{" "}
            às {sucesso.horaInicio.slice(0, 5)}
          </p>

          <p className="mt-4 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2.5 text-xs text-neutral-400">
            Precisa cancelar ou remarcar? Entre em contato pelo{" "}
            <a
              href={`https://wa.me/${business.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-amber-500 hover:underline"
            >
              WhatsApp
            </a>
            .
          </p>

          <button
            onClick={() => {
              setSucesso(null);
              setHoraSelecionada("");
              setNomeCliente("");
              setTelefoneCliente("");
              captchaWidgetId.current = null;
            }}
            className="mt-6 w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400"
          >
            Agendar outro horário
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-neutral-950">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 0%, rgba(217,119,6,0.18), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-lg px-4 py-10 sm:py-14">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
            {business.nome}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-white">Agende seu horário</h1>
          <p className="mt-1 text-sm text-neutral-400">Rápido, sem ligação e sem espera.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-3">
            <StepLabel n={1}>Escolha o barbeiro</StepLabel>
            {barbeiros.length === 0 ? (
              <p className="text-sm text-neutral-500">Carregando...</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {barbeiros.map((b) => (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => setBarbeiroId(b.id)}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                      barbeiroId === b.id
                        ? "border-amber-500 bg-amber-500/10 text-amber-400"
                        : "border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700"
                    }`}
                  >
                    {b.nome}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <StepLabel n={2}>Escolha o serviço</StepLabel>
            {servicos.length === 0 ? (
              <p className="text-sm text-neutral-500">Carregando serviços...</p>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {servicos.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setServicoId(s.id)}
                    className={`rounded-xl border p-4 text-left transition ${
                      servicoId === s.id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700"
                    }`}
                  >
                    <p className="font-semibold text-white">{s.nome}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <IconClock /> {s.duracaoMinutos} min
                      </span>
                      <span className="text-base font-bold text-amber-500">R$ {Number(s.preco).toFixed(2)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {barbeiroId && servicoId && (
            <div className="space-y-3">
              <StepLabel n={3}>Escolha o dia e o horário</StepLabel>
              <input
                type="date"
                value={data}
                min={hojeISO()}
                max={fimDaSemanaISO()}
                onChange={(e) => setData(e.target.value)}
                required
                className={fieldCls}
              />
              <p className="text-xs text-neutral-500">Agendamentos disponíveis somente até este sábado.</p>

              {carregandoHorarios ? (
                <p className="text-sm text-neutral-500">Carregando horários...</p>
              ) : horarios.length === 0 ? (
                <p className="rounded-lg border border-dashed border-neutral-800 px-3 py-3 text-sm text-neutral-500">
                  Nenhum horário disponível nesse dia — tenta outra data.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {horarios.map((h) => (
                    <button
                      type="button"
                      key={h}
                      onClick={() => setHoraSelecionada(h)}
                      className={`rounded-lg border py-2 text-sm font-medium transition ${
                        horaSelecionada === h
                          ? "border-amber-500 bg-amber-500 text-neutral-950"
                          : "border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700"
                      }`}
                    >
                      {h.slice(0, 5)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {horaSelecionada && (
            <div className="space-y-3">
              <StepLabel n={4}>Seus dados</StepLabel>
              <input
                type="text"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                placeholder="Seu nome"
                required
                className={fieldCls}
              />
              <input
                type="text"
                placeholder="(11) 91234-5678"
                value={telefoneCliente}
                onChange={(e) => setTelefoneCliente(e.target.value)}
                required
                className={fieldCls}
              />
              <div ref={captchaRef} />
            </div>
          )}

          {erro && (
            <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-400">{erro}</p>
          )}

          <button
            type="submit"
            disabled={!horaSelecionada || enviando}
            className="w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {enviando ? "Agendando..." : "Confirmar agendamento"}
          </button>
        </form>
      </div>
    </div>
  );
}
