import { useEffect, useState } from "react";
import api from "../api/client";

function hojeISO() {
  const hoje = new Date();
  const offset = hoje.getTimezoneOffset();
  return new Date(hoje.getTime() - offset * 60000).toISOString().slice(0, 10);
}

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
    setEnviando(true);
    try {
      const { data: agendamento } = await api.post("/api/agendamentos", {
        nomeCliente,
        telefoneCliente,
        barbeiroId,
        servicoId,
        data,
        horaInicio: horaSelecionada,
      });
      setSucesso(agendamento);
    } catch (err) {
      setErro(err.response?.data?.message || "Não foi possível agendar. Tente outro horário.");
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <h1 className="text-xl font-semibold text-green-800">Agendamento confirmado!</h1>
        <p className="mt-2 text-sm text-green-700">
          {sucesso.nomeServico} com {sucesso.nomeBarbeiro}
          <br />
          {new Date(sucesso.data + "T00:00:00").toLocaleDateString("pt-BR")} às {sucesso.horaInicio.slice(0, 5)}
        </p>
        <button
          onClick={() => {
            setSucesso(null);
            setHoraSelecionada("");
            setNomeCliente("");
            setTelefoneCliente("");
          }}
          className="mt-4 rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
        >
          Agendar outro horário
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold">Agendar horário</h1>
      <p className="mt-1 text-sm text-neutral-600">Escolha o serviço, a data e o horário.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Barbeiro</label>
          <select
            value={barbeiroId}
            onChange={(e) => setBarbeiroId(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="">Selecione...</option>
            {barbeiros.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">Serviço</label>
          <select
            value={servicoId}
            onChange={(e) => setServicoId(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="">Selecione...</option>
            {servicos.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome} — {s.duracaoMinutos}min — R$ {Number(s.preco).toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">Data</label>
          <input
            type="date"
            value={data}
            min={hojeISO()}
            onChange={(e) => setData(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        {barbeiroId && servicoId && (
          <div>
            <label className="block text-sm font-medium text-neutral-700">Horário</label>
            {carregandoHorarios ? (
              <p className="mt-2 text-sm text-neutral-500">Carregando horários...</p>
            ) : horarios.length === 0 ? (
              <p className="mt-2 text-sm text-neutral-500">Nenhum horário disponível nesse dia.</p>
            ) : (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {horarios.map((h) => (
                  <button
                    type="button"
                    key={h}
                    onClick={() => setHoraSelecionada(h)}
                    className={`rounded-md border px-2 py-1.5 text-sm ${
                      horaSelecionada === h
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 hover:border-neutral-500"
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
          <>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Seu nome</label>
              <input
                type="text"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Seu telefone</label>
              <input
                type="text"
                placeholder="(11) 91234-5678"
                value={telefoneCliente}
                onChange={(e) => setTelefoneCliente(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
          </>
        )}

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={!horaSelecionada || enviando}
          className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {enviando ? "Agendando..." : "Confirmar agendamento"}
        </button>
      </form>
    </div>
  );
}
