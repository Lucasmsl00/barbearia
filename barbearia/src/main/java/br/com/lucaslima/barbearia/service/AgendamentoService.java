package br.com.lucaslima.barbearia.service;

import br.com.lucaslima.barbearia.dto.AgendamentoRequestDTO;
import br.com.lucaslima.barbearia.exception.BusinessException;
import br.com.lucaslima.barbearia.exception.ResourceNotFoundException;
import br.com.lucaslima.barbearia.model.*;
import br.com.lucaslima.barbearia.repository.*;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final HorarioFuncionamentoRepository horarioFuncionamentoRepository;
    private final ServicoRepository servicoRepository;
    private final ClienteRepository clienteRepository;
    private final BarbeiroRepository barbeiroRepository;

    public AgendamentoService(
            AgendamentoRepository agendamentoRepository,
            HorarioFuncionamentoRepository horarioFuncionamentoRepository,
            ServicoRepository servicoRepository,
            ClienteRepository clienteRepository,
            BarbeiroRepository barbeiroRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.horarioFuncionamentoRepository = horarioFuncionamentoRepository;
        this.servicoRepository = servicoRepository;
        this.clienteRepository = clienteRepository;
        this.barbeiroRepository = barbeiroRepository;
    }

    public List<LocalTime> buscarHorariosDisponiveis(UUID barbeiroId, UUID servicoId, LocalDate data) {
        if (foraDaSemanaAtual(data)) {
            return List.of();
        }

        DayOfWeek diaSemana = data.getDayOfWeek();

        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado"));

        Optional<HorarioFuncionamento> horarioOpt = horarioFuncionamentoRepository
                .findByBarbeiroIdAndDiaSemana(barbeiroId, diaSemana);

        if (horarioOpt.isEmpty() || horarioOpt.get().isFolga()) {
            return List.of();
        }

        HorarioFuncionamento horario = horarioOpt.get();
        LocalTime horaAtual = horario.getHoraAbertura();
        LocalTime horaFechamento = horario.getHoraFechamento();

        List<Agendamento> agendamentosExistentes = agendamentoRepository
                .findByBarbeiroIdAndDataAndStatusNot(barbeiroId, data, StatusAgendamento.CANCELADO);

        List<LocalTime> horariosDisponiveis = new ArrayList<>();

        while (horaAtual.isBefore(horaFechamento)) {
            LocalTime horaFimServico = horaAtual.plusMinutes(servico.getDuracaoMinutos());

            if (horaFimServico.isAfter(horaFechamento)) {
                break;
            }

            boolean noAlmoco = sobrepoeAlmoco(horaAtual, horaFimServico, horario);

            if (!noAlmoco && !temConflito(horaAtual, horaFimServico, agendamentosExistentes, null)) {
                horariosDisponiveis.add(horaAtual);
            }

            horaAtual = horaAtual.plusMinutes(30);
        }

        return horariosDisponiveis;
    }

    @Transactional
    public Agendamento criarAgendamento(AgendamentoRequestDTO dto) {
        Cliente cliente = clienteRepository.findByTelefone(dto.getTelefoneCliente())
                .orElseGet(() -> {
                    Cliente novoCliente = new Cliente();
                    novoCliente.setNome(dto.getNomeCliente());
                    novoCliente.setTelefone(dto.getTelefoneCliente());
                    return clienteRepository.save(novoCliente);
                });

        Barbeiro barbeiro = barbeiroRepository.findById(dto.getBarbeiroId())
                .orElseThrow(() -> new ResourceNotFoundException("Barbeiro não encontrado"));

        Servico servico = servicoRepository.findById(dto.getServicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado"));

        LocalTime horaFim = dto.getHoraInicio().plusMinutes(servico.getDuracaoMinutos());

        validarDisponibilidade(dto.getBarbeiroId(), dto.getData(), dto.getHoraInicio(), horaFim, null);

        Agendamento agendamento = new Agendamento();
        agendamento.setCliente(cliente);
        agendamento.setBarbeiro(barbeiro);
        agendamento.setServico(servico);
        agendamento.setData(dto.getData());
        agendamento.setHoraInicio(dto.getHoraInicio());
        agendamento.setHoraFim(horaFim);
        agendamento.setStatus(StatusAgendamento.PENDENTE);

        return agendamentoRepository.save(agendamento);
    }

    public List<Agendamento> listarAgendamentoPorBarbeiroEData(UUID barbeiroId, LocalDate data) {
        return agendamentoRepository.findByBarbeiroIdAndData(barbeiroId, data);
    }

    @Transactional
    public Agendamento cancelarAgendamento(UUID id, UUID barbeiroAutenticadoId) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado"));

        verificarDono(agendamento, barbeiroAutenticadoId);

        agendamento.setStatus(StatusAgendamento.CANCELADO);

        return agendamentoRepository.save(agendamento);
    }

    @Transactional
    public Agendamento remarcarAgendamento(UUID idAntigo, LocalDate novaData, LocalTime novaHoraInicio, UUID barbeiroAutenticadoId) {
        Agendamento agendamentoAntigo = agendamentoRepository.findById(idAntigo)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado"));

        verificarDono(agendamentoAntigo, barbeiroAutenticadoId);

        if (agendamentoAntigo.getStatus() == StatusAgendamento.CANCELADO) {
            throw new BusinessException("Não é possível remarcar um agendamento cancelado");
        }

        Servico servico = agendamentoAntigo.getServico();
        LocalTime novaHoraFim = novaHoraInicio.plusMinutes(servico.getDuracaoMinutos());

        validarDisponibilidade(agendamentoAntigo.getBarbeiro().getId(), novaData, novaHoraInicio, novaHoraFim, idAntigo);

        agendamentoAntigo.setStatus(StatusAgendamento.REMARCADO);
        agendamentoRepository.save(agendamentoAntigo);

        Agendamento novoAgendamento = new Agendamento();
        novoAgendamento.setCliente(agendamentoAntigo.getCliente());
        novoAgendamento.setBarbeiro(agendamentoAntigo.getBarbeiro());
        novoAgendamento.setServico(servico);
        novoAgendamento.setData(novaData);
        novoAgendamento.setHoraInicio(novaHoraInicio);
        novoAgendamento.setHoraFim(novaHoraFim);
        novoAgendamento.setStatus(StatusAgendamento.PENDENTE);
        novoAgendamento.setAgendamentoOrigem(agendamentoAntigo);

        return agendamentoRepository.save(novoAgendamento);
    }

    @Transactional
    public Agendamento concluirAgendamento(UUID id, UUID barbeiroAutenticadoId) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado"));

        verificarDono(agendamento, barbeiroAutenticadoId);

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO || agendamento.getStatus() == StatusAgendamento.REMARCADO) {
            throw new BusinessException("Não é possível concluir um agendamento cancelado ou remarcado");
        }

        agendamento.setStatus(StatusAgendamento.CONCLUIDO);

        return agendamentoRepository.save(agendamento);
    }

    private void verificarDono(Agendamento agendamento, UUID barbeiroAutenticadoId) {
        if (!agendamento.getBarbeiro().getId().equals(barbeiroAutenticadoId)) {
            throw new AccessDeniedException("Este agendamento não pertence a este barbeiro");
        }
    }

    private void validarDisponibilidade(UUID barbeiroId, LocalDate data, LocalTime horaInicio, LocalTime horaFim, UUID idParaIgnorar) {
        if (foraDaSemanaAtual(data)) {
            throw new BusinessException("Só é possível agendar dentro da semana atual (domingo a sábado)");
        }

        HorarioFuncionamento horario = horarioFuncionamentoRepository
                .findByBarbeiroIdAndDiaSemana(barbeiroId, data.getDayOfWeek())
                .orElseThrow(() -> new BusinessException("Barbeiro não atende neste dia"));

        if (horario.isFolga()) {
            throw new BusinessException("Barbeiro não atende neste dia");
        }

        if (horaInicio.isBefore(horario.getHoraAbertura()) || horaFim.isAfter(horario.getHoraFechamento())) {
            throw new BusinessException("Horário fora do expediente");
        }

        if (sobrepoeAlmoco(horaInicio, horaFim, horario)) {
            throw new BusinessException("Este horário cai no intervalo de almoço");
        }

        List<Agendamento> existentes = agendamentoRepository
                .findByBarbeiroIdAndDataAndStatusNot(barbeiroId, data, StatusAgendamento.CANCELADO);

        if (temConflito(horaInicio, horaFim, existentes, idParaIgnorar)) {
            throw new BusinessException("Este horário já está ocupado");
        }
    }

    private boolean temConflito(LocalTime horaInicio, LocalTime horaFim, List<Agendamento> existentes, UUID idParaIgnorar) {
        for (Agendamento agendamento : existentes) {
            if (idParaIgnorar != null && idParaIgnorar.equals(agendamento.getId())) {
                continue;
            }
            boolean sobrepoe = horaInicio.isBefore(agendamento.getHoraFim()) &&
                    horaFim.isAfter(agendamento.getHoraInicio());
            if (sobrepoe) {
                return true;
            }
        }
        return false;
    }

    private boolean sobrepoeAlmoco(LocalTime horaInicio, LocalTime horaFim, HorarioFuncionamento horario) {
        if (horario.getHoraAlmocoInicio() == null || horario.getHoraAlmocoFim() == null) {
            return false;
        }
        return horaInicio.isBefore(horario.getHoraAlmocoFim()) && horaFim.isAfter(horario.getHoraAlmocoInicio());
    }

    // A barbearia só aceita agendamento dentro da semana corrente (domingo a sábado), nunca no mês inteiro
    private boolean foraDaSemanaAtual(LocalDate data) {
        LocalDate hoje = LocalDate.now();
        int diasDesdeDomingo = hoje.getDayOfWeek().getValue() % 7; // domingo=7 -> 0, segunda=1, ..., sábado=6
        LocalDate fimDaSemana = hoje.plusDays(6 - diasDesdeDomingo);
        return data.isBefore(hoje) || data.isAfter(fimDaSemana);
    }
}
