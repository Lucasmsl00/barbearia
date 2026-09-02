package br.com.lucaslima.barbearia.dto;

import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

public class HorarioFuncionamentoRequestDTO {

    // opcional: só o dono pode usar isto pra configurar o horário de outro barbeiro;
    // se vazio (ou se quem está autenticado não for dono), vale sempre o próprio barbeiro logado
    private UUID barbeiroId;

    @NotNull(message = "O dia da semana é obrigatório")
    private DayOfWeek diaSemana;

    private LocalTime horaAbertura;

    private LocalTime horaFechamento;

    private LocalTime horaAlmocoInicio;

    private LocalTime horaAlmocoFim;

    private boolean folga;

    public UUID getBarbeiroId() {
        return barbeiroId;
    }

    public void setBarbeiroId(UUID barbeiroId) {
        this.barbeiroId = barbeiroId;
    }

    public DayOfWeek getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(DayOfWeek diaSemana) {
        this.diaSemana = diaSemana;
    }

    public LocalTime getHoraAbertura() {
        return horaAbertura;
    }

    public void setHoraAbertura(LocalTime horaAbertura) {
        this.horaAbertura = horaAbertura;
    }

    public LocalTime getHoraFechamento() {
        return horaFechamento;
    }

    public void setHoraFechamento(LocalTime horaFechamento) {
        this.horaFechamento = horaFechamento;
    }

    public LocalTime getHoraAlmocoInicio() {
        return horaAlmocoInicio;
    }

    public void setHoraAlmocoInicio(LocalTime horaAlmocoInicio) {
        this.horaAlmocoInicio = horaAlmocoInicio;
    }

    public LocalTime getHoraAlmocoFim() {
        return horaAlmocoFim;
    }

    public void setHoraAlmocoFim(LocalTime horaAlmocoFim) {
        this.horaAlmocoFim = horaAlmocoFim;
    }

    public boolean isFolga() {
        return folga;
    }

    public void setFolga(boolean folga) {
        this.folga = folga;
    }
}
