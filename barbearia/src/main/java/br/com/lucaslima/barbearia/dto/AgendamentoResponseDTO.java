package br.com.lucaslima.barbearia.dto;

import br.com.lucaslima.barbearia.model.Agendamento;
import br.com.lucaslima.barbearia.model.StatusAgendamento;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public class AgendamentoResponseDTO {

    private UUID id;
    private String nomeCliente;
    private String telefoneCliente;
    private String nomeServico;
    private String nomeBarbeiro;
    private LocalDate data;
    private LocalTime horaInicio;
    private LocalTime horaFim;
    private StatusAgendamento status;
    private UUID agendamentoOrigemId;
    private String motivoRemarcacao;
    private BigDecimal precoCobrado;
    private List<String> nomesServicosAdicionais;

    public AgendamentoResponseDTO() {}

    public AgendamentoResponseDTO(Agendamento agendamento) {
        this.id = agendamento.getId();
        this.nomeCliente = agendamento.getCliente().getNome();
        this.telefoneCliente = agendamento.getCliente().getTelefone();
        this.nomeServico = agendamento.getServico().getNome();
        this.nomeBarbeiro = agendamento.getBarbeiro().getNome();
        this.nomesServicosAdicionais = agendamento.getServicosAdicionais().stream()
                .map(br.com.lucaslima.barbearia.model.Servico::getNome)
                .toList();
        this.data = agendamento.getData();
        this.horaInicio = agendamento.getHoraInicio();
        this.horaFim = agendamento.getHoraFim();
        this.status = agendamento.getStatus();
        this.agendamentoOrigemId = agendamento.getAgendamentoOrigem() != null
                ? agendamento.getAgendamentoOrigem().getId()
                : null;
        this.motivoRemarcacao = agendamento.getMotivoRemarcacao();
        this.precoCobrado = agendamento.getPrecoCobrado() != null
                ? agendamento.getPrecoCobrado()
                : agendamento.getServico().getPreco();
    }

    public UUID getId() {
        return id;
    }

    public String getNomeCliente() {
        return nomeCliente;
    }

    public String getTelefoneCliente() {
        return telefoneCliente;
    }

    public String getNomeServico() {
        return nomeServico;
    }

    public String getNomeBarbeiro() {
        return nomeBarbeiro;
    }

    public LocalDate getData() {
        return data;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public LocalTime getHoraFim() {
        return horaFim;
    }

    public StatusAgendamento getStatus() {
        return status;
    }

    public UUID getAgendamentoOrigemId() {
        return agendamentoOrigemId;
    }

    public String getMotivoRemarcacao() {
        return motivoRemarcacao;
    }

    public BigDecimal getPrecoCobrado() {
        return precoCobrado;
    }

    public List<String> getNomesServicosAdicionais() {
        return nomesServicosAdicionais;
    }
}
