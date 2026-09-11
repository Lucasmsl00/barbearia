package br.com.lucaslima.barbearia.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "agendamento")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;

    @ManyToOne
    @JoinColumn(name = "barbeiro_id", nullable = false)
    private Barbeiro barbeiro;

    @NotNull
    @Column(nullable = false)
    private LocalDate data;

    @NotNull
    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @NotNull
    @Column(name = "hora_fim", nullable = false)
    private LocalTime horaFim;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private StatusAgendamento status;

    @ManyToOne
    @JoinColumn(name = "agendamento_origem_id")
    private Agendamento agendamentoOrigem;

    @Column(name = "motivo_remarcacao")
    private String motivoRemarcacao;

    // preço efetivamente cobrado no momento do agendamento (pode variar por dia da semana); histórico não muda se o preço do serviço mudar depois
    @Column(name = "preco_cobrado")
    private BigDecimal precoCobrado;

    @ManyToMany
    @JoinTable(
            name = "agendamento_servico_adicional",
            joinColumns = @JoinColumn(name = "agendamento_id"),
            inverseJoinColumns = @JoinColumn(name = "servico_id"))
    private Set<Servico> servicosAdicionais = new HashSet<>();

    public Agendamento() {}

    public UUID getId() {
        return id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Servico getServico() {
        return servico;
    }

    public void setServico(Servico servico) {
        this.servico = servico;
    }

    public Barbeiro getBarbeiro() {
        return barbeiro;
    }

    public void setBarbeiro(Barbeiro barbeiro) {
        this.barbeiro = barbeiro;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFim() {
        return horaFim;
    }

    public void setHoraFim(LocalTime horaFim) {
        this.horaFim = horaFim;
    }

    public StatusAgendamento getStatus() {
        return status;
    }

    public void setStatus(StatusAgendamento status) {
        this.status = status;
    }

    public Agendamento getAgendamentoOrigem() {
        return agendamentoOrigem;
    }

    public void setAgendamentoOrigem(Agendamento agendamentoOrigem) {
        this.agendamentoOrigem = agendamentoOrigem;
    }

    public String getMotivoRemarcacao() {
        return motivoRemarcacao;
    }

    public void setMotivoRemarcacao(String motivoRemarcacao) {
        this.motivoRemarcacao = motivoRemarcacao;
    }

    public BigDecimal getPrecoCobrado() {
        return precoCobrado;
    }

    public void setPrecoCobrado(BigDecimal precoCobrado) {
        this.precoCobrado = precoCobrado;
    }

    public Set<Servico> getServicosAdicionais() {
        return servicosAdicionais;
    }

    public void setServicosAdicionais(Set<Servico> servicosAdicionais) {
        this.servicosAdicionais = servicosAdicionais != null ? servicosAdicionais : new HashSet<>();
    }
}
