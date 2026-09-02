package br.com.lucaslima.barbearia.service;

import br.com.lucaslima.barbearia.dto.RelatorioResponseDTO;
import br.com.lucaslima.barbearia.dto.ServicoRankingDTO;
import br.com.lucaslima.barbearia.model.Agendamento;
import br.com.lucaslima.barbearia.model.StatusAgendamento;
import br.com.lucaslima.barbearia.repository.AgendamentoRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RelatorioService {

    private final AgendamentoRepository agendamentoRepository;

    public RelatorioService(AgendamentoRepository agendamentoRepository) {
        this.agendamentoRepository = agendamentoRepository;
    }

    public RelatorioResponseDTO gerar(UUID barbeiroId, LocalDate inicio, LocalDate fim) {
        List<Agendamento> agendamentos = agendamentoRepository.findByBarbeiroIdAndDataBetween(barbeiroId, inicio, fim);

        long total = agendamentos.size();

        Map<String, Long> porStatus = new LinkedHashMap<>();
        for (StatusAgendamento status : StatusAgendamento.values()) {
            porStatus.put(status.name(), 0L);
        }
        agendamentos.forEach(a -> porStatus.merge(a.getStatus().name(), 1L, Long::sum));

        BigDecimal faturamento = agendamentos.stream()
                .filter(a -> a.getStatus() == StatusAgendamento.CONCLUIDO)
                .map(a -> a.getServico().getPreco())
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        List<ServicoRankingDTO> servicosMaisPedidos = agendamentos.stream()
                .filter(a -> a.getStatus() != StatusAgendamento.CANCELADO && a.getStatus() != StatusAgendamento.REMARCADO)
                .collect(Collectors.groupingBy(a -> a.getServico().getNome(), Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> new ServicoRankingDTO(e.getKey(), e.getValue()))
                .toList();

        double taxaCancelamento = total == 0 ? 0.0 : arredondar(porStatus.get(StatusAgendamento.CANCELADO.name()) * 100.0 / total);
        double taxaRemarcacao = total == 0 ? 0.0 : arredondar(porStatus.get(StatusAgendamento.REMARCADO.name()) * 100.0 / total);

        return new RelatorioResponseDTO(inicio, fim, faturamento, total, porStatus, servicosMaisPedidos, taxaCancelamento, taxaRemarcacao);
    }

    private double arredondar(double valor) {
        return Math.round(valor * 10.0) / 10.0;
    }
}
