import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import PlaceholderImage from "../components/PlaceholderImage";
import { business } from "../config/business";

const DIAS_LABEL = {
  MONDAY: "Segunda",
  TUESDAY: "Terça",
  WEDNESDAY: "Quarta",
  THURSDAY: "Quinta",
  FRIDAY: "Sexta",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};
const ORDEM_DIAS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

function SectionTitle({ eyebrow, title, light }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">{eyebrow}</span>
      <h2 className={`mt-2 text-3xl font-bold sm:text-4xl ${light ? "text-white" : "text-neutral-900"}`}>
        {title}
      </h2>
    </div>
  );
}

export default function LandingPage() {
  const [servicos, setServicos] = useState([]);
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    api.get("/api/servicos").then((res) => setServicos(res.data));
    api.get("/api/barbeiros").then((res) => {
      const barbeiro = res.data[0];
      if (barbeiro) {
        api
          .get("/api/horarios-funcionamento", { params: { barbeiroId: barbeiro.id } })
          .then((r) => setHorarios(r.data));
      }
    });
  }, []);

  const horariosPorDia = Object.fromEntries(horarios.map((h) => [h.diaSemana, h]));
  const whatsappLink = `https://wa.me/${business.whatsapp}`;

  return (
    <div className="bg-neutral-950">
      {/* HERO */}
      <section className="relative overflow-hidden bg-neutral-950 py-28 text-center sm:py-36">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(217,119,6,0.25), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
            {business.nome}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-6xl">
            {business.slogan}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-neutral-400">{business.descricao}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/agendar"
              className="rounded-md bg-amber-500 px-6 py-3 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
            >
              Agendar horário
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-neutral-700 px-6 py-3 text-sm font-semibold text-white hover:border-amber-500 hover:text-amber-500"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-4 sm:grid-cols-2">
          <PlaceholderImage label="Foto do barbeiro trabalhando / fachada da barbearia" className="h-80 rounded-lg" />
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">Sobre nós</span>
            <h2 className="mt-2 text-3xl font-bold text-neutral-900">Tradição e técnica em cada atendimento</h2>
            <p className="mt-4 text-neutral-600">{business.descricao}</p>
            <p className="mt-3 text-neutral-600">
              Agende seu horário em poucos cliques, sem precisar ligar ou esperar resposta — escolha o serviço, o
              dia e o horário que melhor encaixam na sua rotina.
            </p>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="bg-neutral-950 py-20">
        <SectionTitle eyebrow="O que oferecemos" title="Nossos serviços" light />
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.length === 0 && (
            <p className="col-span-full text-center text-neutral-500">Carregando serviços...</p>
          )}
          {servicos.map((s) => (
            <div
              key={s.id}
              className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 transition hover:border-amber-500/50"
            >
              <h3 className="text-lg font-semibold text-white">{s.nome}</h3>
              <p className="mt-1 text-sm text-neutral-500">{s.duracaoMinutos} minutos</p>
              <p className="mt-4 text-2xl font-bold text-amber-500">R$ {Number(s.preco).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/agendar" className="text-sm font-semibold text-amber-500 hover:underline">
            Ver horários disponíveis →
          </Link>
        </div>
      </section>

      {/* GALERIA */}
      <section className="bg-white py-20">
        <SectionTitle eyebrow="Nosso trabalho" title="Galeria" />
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 px-4 sm:grid-cols-3">
          {[
            "Corte finalizado — cliente 1",
            "Barba feita na navalha",
            "Ambiente interno da barbearia",
            "Corte degradê",
            "Estação de atendimento",
            "Cliente satisfeito no espelho",
          ].map((label) => (
            <PlaceholderImage key={label} label={label} className="aspect-square rounded-md" />
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-neutral-400">
          Fotos ilustrativas — substitua pelos cliques reais da barbearia.
        </p>
      </section>

      {/* HORÁRIO E CONTATO */}
      <section className="bg-neutral-950 py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 md:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">Horário</span>
            <h2 className="mt-2 text-2xl font-bold text-white">Quando estamos abertos</h2>
            <ul className="mt-5 divide-y divide-neutral-800 rounded-lg border border-neutral-800">
              {ORDEM_DIAS.map((dia) => {
                const h = horariosPorDia[dia];
                return (
                  <li key={dia} className="flex justify-between px-4 py-2.5 text-sm">
                    <span className="text-neutral-400">{DIAS_LABEL[dia]}</span>
                    <span className="font-medium text-white">
                      {!h ? "—" : h.folga ? "Fechado" : `${h.horaAbertura?.slice(0, 5)} - ${h.horaFechamento?.slice(0, 5)}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">Contato</span>
            <h2 className="mt-2 text-2xl font-bold text-white">Venha nos visitar</h2>
            <div className="mt-5 space-y-3 text-sm text-neutral-300">
              <p>📍 {business.endereco}</p>
              <p>📞 {business.telefone}</p>
              <a href={business.instagram} target="_blank" rel="noreferrer" className="block text-amber-500 hover:underline">
                📷 Instagram
              </a>
            </div>
            <div className="mt-5 overflow-hidden rounded-lg border border-neutral-800">
              <iframe
                title="Localização"
                src={business.mapsEmbedUrl}
                className="h-56 w-full grayscale invert"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-amber-500 py-14 text-center">
        <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">Pronto pro seu próximo corte?</h2>
        <Link
          to="/agendar"
          className="mt-5 inline-block rounded-md bg-neutral-950 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Agendar agora
        </Link>
      </section>

      <footer className="bg-neutral-950 py-8 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} {business.nome}. Todos os direitos reservados.
      </footer>
    </div>
  );
}
