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

function AbaAgenda({ barbeiroId }) {
  const [data, setData] = useState(hojeISO());
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [remarcando, setRemarcando] = useState(null);
  const [novaData, setNovaData] = useState("");
  const [novaHora, setNovaHora] = useState("");
  const [erro, setErro] = useState("");

  function carregar() {
    if (!barbeiroId) return;
    setCarregando(true);
    api
      .get("/api/agendamentos/atendimentos", { params: { barbeiroId, data } })
      .then((res) => setAgendamentos(res.data))
      .finally(() => setCarregando(false));
  }

  useEffect(carregar, [barbeiroId, data]);

  async function cancelar(id) {
    if (!confirm("Cancelar este agendamento?")) return;
    await api.patch(`/api/agendamentos/${id}/cancelar`);
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

function AbaHorarios({ barbeiroId }) {
  const [horarios, setHorarios] = useState([]);
  const [erro, setErro] = useState("");

  function carregar() {
    if (!barbeiroId) return;
    api.get("/api/horarios-funcionamento", { params: { barbeiroId } }).then((res) => setHorarios(res.data));
  }

  useEffect(carregar, [barbeiroId]);

  function horarioDoDia(dia) {
    return horarios.find((h) => h.diaSemana === dia);
  }

  async function salvar(dia, horaAbertura, horaFechamento, folga) {
    setErro("");
    try {
      await api.post("/api/horarios-funcionamento", {
        barbeiroId,
        diaSemana: dia,
        horaAbertura: folga ? null : horaAbertura,
        horaFechamento: folga ? null : horaFechamento,
        folga,
      });
      carregar();
    } catch (err) {
      setErro(err.response?.data?.message || "Não foi possível salvar");
    }
  }

  return (
    <div className="space-y-2">
      {erro && <p className="text-xs text-red-600">{erro}</p>}
      {DIAS_SEMANA.map(({ valor, label }) => {
        const existente = horarioDoDia(valor);
        return (
          <LinhaHorario
            key={valor}
            label={label}
            dia={valor}
            existente={existente}
            onSalvar={salvar}
          />
        );
      })}
    </div>
  );
}

function LinhaHorario({ label, dia, existente, onSalvar }) {
  const [abertura, setAbertura] = useState(existente?.horaAbertura?.slice(0, 5) || "09:00");
  const [fechamento, setFechamento] = useState(existente?.horaFechamento?.slice(0, 5) || "19:00");
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
        </>
      )}
      <button
        onClick={() => onSalvar(dia, abertura, fechamento, folga)}
        className="ml-auto rounded-md bg-neutral-900 px-3 py-1 text-xs text-white hover:bg-neutral-700"
      >
        Salvar
      </button>
    </div>
  );
}

export default function AdminPage() {
  const { barbeiro } = useAuth();
  const [aba, setAba] = useState("agenda");

  return (
    <div>
      <h1 className="text-2xl font-semibold">Painel do barbeiro</h1>
      <div className="mt-4 flex gap-1 border-b border-neutral-200">
        {[
          ["agenda", "Agenda"],
          ["servicos", "Serviços"],
          ["horarios", "Horário de funcionamento"],
        ].map(([valor, label]) => (
          <button
            key={valor}
            onClick={() => setAba(valor)}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              aba === valor ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {aba === "agenda" && <AbaAgenda barbeiroId={barbeiro?.id} />}
        {aba === "servicos" && <AbaServicos />}
        {aba === "horarios" && <AbaHorarios barbeiroId={barbeiro?.id} />}
      </div>
    </div>
  );
}
