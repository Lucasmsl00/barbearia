import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

function hojeISO() {
  const hoje = new Date();
  const offset = hoje.getTimezoneOffset();
  return new Date(hoje.getTime() - offset * 60000).toISOString().slice(0, 10);
}

const STATUS_COR = {
  PENDENTE: "bg-yellow-100 text-yellow-800",
  CONFIRMADO: "bg-blue-100 text-blue-800",
  CANCELADO: "bg-red-100 text-red-800",
  CONCLUIDO: "bg-green-100 text-green-800",
  REMARCADO: "bg-neutral-200 text-neutral-600",
};

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
    <div className="max-w-sm">
      <h2 className="text-lg font-semibold">Trocar senha</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Senha atual</label>
          <input
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">Nova senha</label>
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            minLength={6}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">Confirmar nova senha</label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            minLength={6}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        {sucesso && <p className="text-sm text-green-600">Senha alterada com sucesso.</p>}
        <button
          type="submit"
          disabled={enviando}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-40"
        >
          {enviando ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}

function AbaAgenda() {
  const [data, setData] = useState(hojeISO());
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [remarcando, setRemarcando] = useState(null);
  const [novaData, setNovaData] = useState("");
  const [novaHora, setNovaHora] = useState("");
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
      });
      setRemarcando(null);
      carregar();
    } catch (err) {
      setErro(err.response?.data?.message || "Não foi possível remarcar");
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-neutral-700">Data</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
        />
      </div>

      <div className="mt-4 space-y-3">
        {carregando && <p className="text-sm text-neutral-500">Carregando...</p>}
        {!carregando && agendamentos.length === 0 && (
          <p className="text-sm text-neutral-500">Nenhum agendamento nesse dia.</p>
        )}
        {agendamentos.map((ag) => (
          <div key={ag.id} className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">
                  {ag.horaInicio.slice(0, 5)} - {ag.horaFim.slice(0, 5)} · {ag.nomeServico}
                </p>
                <p className="text-sm text-neutral-600">
                  {ag.nomeCliente} · {ag.telefoneCliente}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COR[ag.status]}`}>
                {ag.status}
              </span>
            </div>

            {(ag.status === "PENDENTE" || ag.status === "CONFIRMADO") && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => concluir(ag.id)}
                  className="rounded-md border border-green-300 px-3 py-1 text-xs text-green-700 hover:bg-green-50"
                >
                  Concluir
                </button>
                <button
                  onClick={() => cancelar(ag.id)}
                  className="rounded-md border border-red-300 px-3 py-1 text-xs text-red-700 hover:bg-red-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setRemarcando(ag.id);
                    setNovaData(ag.data);
                    setNovaHora(ag.horaInicio.slice(0, 5));
                    setErro("");
                  }}
                  className="rounded-md border border-neutral-300 px-3 py-1 text-xs hover:bg-neutral-50"
                >
                  Remarcar
                </button>
              </div>
            )}

            {remarcando === ag.id && (
              <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-neutral-100 pt-3">
                <div>
                  <label className="block text-xs text-neutral-500">Nova data</label>
                  <input
                    type="date"
                    value={novaData}
                    onChange={(e) => setNovaData(e.target.value)}
                    className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500">Nova hora</label>
                  <input
                    type="time"
                    value={novaHora}
                    onChange={(e) => setNovaHora(e.target.value)}
                    className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                  />
                </div>
                <button
                  onClick={() => confirmarRemarcacao(ag.id)}
                  className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs text-white hover:bg-neutral-700"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setRemarcando(null)}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                {erro && <p className="w-full text-xs text-red-600">{erro}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AbaServicos() {
  const [servicos, setServicos] = useState([]);
  const [nome, setNome] = useState("");
  const [duracao, setDuracao] = useState("");
  const [preco, setPreco] = useState("");
  const [erro, setErro] = useState("");

  function carregar() {
    api.get("/api/servicos").then((res) => setServicos(res.data));
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
    <div>
      <form onSubmit={criar} className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <div>
          <label className="block text-xs text-neutral-500">Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-500">Duração (min)</label>
          <input
            type="number"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            required
            min="1"
            className="w-24 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-500">Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            min="0.01"
            className="w-28 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
        <button className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700">
          Adicionar
        </button>
        {erro && <p className="w-full text-xs text-red-600">{erro}</p>}
      </form>

      <div className="mt-4 space-y-2">
        {servicos.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3">
            <span className="text-sm">
              {s.nome} — {s.duracaoMinutos}min — R$ {Number(s.preco).toFixed(2)}
            </span>
            <button onClick={() => excluir(s.id)} className="text-xs text-red-600 hover:underline">
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        <div>
          <label className="block text-sm font-medium text-neutral-700">Barbeiro</label>
          <select
            value={alvoId}
            onChange={(e) => setBarbeiroSelecionado(e.target.value)}
            className="mt-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
          >
            {barbeiros.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nome}
                {b.id === barbeiroId ? " (você)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        {erro && <p className="text-xs text-red-600">{erro}</p>}
        {DIAS_SEMANA.map(({ valor, label }) => {
          const existente = horarioDoDia(valor);
          return (
            <LinhaHorario
              key={`${alvoId}-${valor}`}
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

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3">
      <span className="w-20 text-sm font-medium">{label}</span>
      <label className="flex items-center gap-1.5 text-xs text-neutral-600">
        <input type="checkbox" checked={folga} onChange={(e) => setFolga(e.target.checked)} />
        Folga
      </label>
      {!folga && (
        <>
          <input
            type="time"
            value={abertura}
            onChange={(e) => setAbertura(e.target.value)}
            className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
          />
          <span className="text-neutral-400">até</span>
          <input
            type="time"
            value={fechamento}
            onChange={(e) => setFechamento(e.target.value)}
            className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
          />
          <label className="flex items-center gap-1.5 text-xs text-neutral-600">
            <input type="checkbox" checked={temAlmoco} onChange={(e) => setTemAlmoco(e.target.checked)} />
            Almoço
          </label>
          {temAlmoco && (
            <>
              <input
                type="time"
                value={almocoInicio}
                onChange={(e) => setAlmocoInicio(e.target.value)}
                className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
              />
              <span className="text-neutral-400">até</span>
              <input
                type="time"
                value={almocoFim}
                onChange={(e) => setAlmocoFim(e.target.value)}
                className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
              />
            </>
          )}
        </>
      )}
      <button
        onClick={() => onSalvar(dia, abertura, fechamento, temAlmoco, almocoInicio, almocoFim, folga)}
        className="ml-auto rounded-md bg-neutral-900 px-3 py-1 text-xs text-white hover:bg-neutral-700"
      >
        Salvar
      </button>
    </div>
  );
}

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

function AbaRelatorios() {
  const [periodo, setPeriodo] = useState("semana");
  const [dataInicio, setDataInicio] = useState(inicioSemanaISO());
  const [dataFim, setDataFim] = useState(fimSemanaISO());
  const [relatorio, setRelatorio] = useState(null);
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
    api
      .get("/api/relatorios", { params: { dataInicio, dataFim } })
      .then((res) => setRelatorio(res.data))
      .finally(() => setCarregando(false));
  }, [dataInicio, dataFim]);

  const maiorContagemServico = relatorio?.servicosMaisPedidos?.[0]?.quantidade || 1;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {[
          ["semana", "Esta semana"],
          ["mes", "Este mês"],
          ["personalizado", "Personalizado"],
        ].map(([valor, label]) => (
          <button
            key={valor}
            onClick={() => aplicarPeriodo(valor)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              periodo === valor ? "bg-neutral-900 text-white" : "border border-neutral-300 text-neutral-600"
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
            className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
          />
          <span className="text-neutral-400">até</span>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
          />
        </div>
      )}

      {carregando && <p className="mt-4 text-sm text-neutral-500">Carregando relatório...</p>}

      {!carregando && relatorio && (
        <div className="mt-5 space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-500">Faturamento</p>
              <p className="mt-1 text-xl font-bold text-neutral-900">
                R$ {Number(relatorio.faturamentoTotal).toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-500">Atendimentos</p>
              <p className="mt-1 text-xl font-bold text-neutral-900">{relatorio.totalAtendimentos}</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-500">Taxa de cancelamento</p>
              <p className="mt-1 text-xl font-bold text-neutral-900">{relatorio.taxaCancelamento}%</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-500">Taxa de remarcação</p>
              <p className="mt-1 text-xl font-bold text-neutral-900">{relatorio.taxaRemarcacao}%</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-700">Atendimentos por status</h3>
            <div className="mt-2 space-y-1.5">
              {Object.entries(relatorio.atendimentosPorStatus).map(([status, qtd]) => (
                <div key={status} className="flex items-center gap-2 text-xs">
                  <span className="w-24 shrink-0 text-neutral-600">{STATUS_LABEL[status] || status}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className={`h-full ${STATUS_BARRA[status] || "bg-neutral-400"}`}
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
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-700">Serviços mais pedidos</h3>
            {relatorio.servicosMaisPedidos.length === 0 ? (
              <p className="mt-2 text-xs text-neutral-500">Nenhum atendimento nesse período.</p>
            ) : (
              <div className="mt-2 space-y-1.5">
                {relatorio.servicosMaisPedidos.map((s) => (
                  <div key={s.nome} className="flex items-center gap-2 text-xs">
                    <span className="w-28 shrink-0 truncate text-neutral-600">{s.nome}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${(s.quantidade / maiorContagemServico) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right font-medium text-neutral-700">{s.quantidade}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { barbeiro } = useAuth();
  const [aba, setAba] = useState("agenda");

  return (
    <div>
      <h1 className="text-2xl font-semibold">Painel do barbeiro</h1>
      <div className="mt-4 flex gap-1 overflow-x-auto border-b border-neutral-200">
        {[
          ["agenda", "Agenda"],
          ["servicos", "Serviços"],
          ["horarios", "Horário"],
          ...(barbeiro?.dono ? [["relatorios", "Relatórios"]] : []),
          ["conta", "Minha conta"],
        ].map(([valor, label]) => (
          <button
            key={valor}
            onClick={() => setAba(valor)}
            className={`shrink-0 border-b-2 px-4 py-2 text-sm font-medium ${
              aba === valor ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {aba === "agenda" && <AbaAgenda />}
        {aba === "servicos" && <AbaServicos />}
        {aba === "horarios" && <AbaHorarios barbeiroId={barbeiro?.id} souDono={barbeiro?.dono} />}
        {aba === "relatorios" && barbeiro?.dono && <AbaRelatorios />}
        {aba === "conta" && <AbaConta />}
      </div>
    </div>
  );
}
