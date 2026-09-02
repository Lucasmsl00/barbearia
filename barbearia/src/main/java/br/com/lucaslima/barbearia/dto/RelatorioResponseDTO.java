package br.com.lucaslima.barbearia.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class RelatorioResponseDTO {

    private final LocalDate periodoInicio;
    private final LocalDate periodoFim;
    private final BigDecimal faturamentoTotal;
    private final long totalAtendimentos;
    private final Map<String, Long> atendimentosPorStatus;
    private final List<ServicoRankingDTO> servicosMaisPedidos;
    private final double taxaCancelamento;
    private final double taxaRemarcacao;

    public RelatorioResponseDTO(
            LocalDate periodoInicio,
            LocalDate periodoFim,
            BigDecimal faturamentoTotal,
            long totalAtendimentos,
            Map<String, Long> atendimentosPorStatus,
            List<ServicoRankingDTO> servicosMaisPedidos,
            double taxaCancelamento,
            double taxaRemarcacao
    ) {
        this.periodoInicio = periodoInicio;
        this.periodoFim = periodoFim;
        this.faturamentoTotal = faturamentoTotal;
        this.totalAtendimentos = totalAtendimentos;
        this.atendimentosPorStatus = atendimentosPorStatus;
        this.servicosMaisPedidos = servicosMaisPedidos;
        this.taxaCancelamento = taxaCancelamento;
        this.taxaRemarcacao = taxaRemarcacao;
    }

    public LocalDate getPeriodoInicio() {
        return periodoInicio;
    }

    public LocalDate getPeriodoFim() {
        return periodoFim;
    }

    public BigDecimal getFaturamentoTotal() {
        return faturamentoTotal;
    }

    public long getTotalAtendimentos() {
        return totalAtendimentos;
    }

    public Map<String, Long> getAtendimentosPorStatus() {
        return atendimentosPorStatus;
    }

    public List<ServicoRankingDTO> getServicosMaisPedidos() {
        return servicosMaisPedidos;
    }

    public double getTaxaCancelamento() {
        return taxaCancelamento;
    }

    public double getTaxaRemarcacao() {
        return taxaRemarcacao;
    }
}
