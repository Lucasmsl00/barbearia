package br.com.lucaslima.barbearia.dto;

import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class HorarioFuncionamentoRequestDTO {

    @NotNull(message = "O dia da semana é obrigatório")
    private DayOfWeek diaSemana;

    private LocalTime horaAbertura;

    private LocalTime horaFechamento;

    private boolean folga;

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

    public boolean isFolga() {
        return folga;
    }

    public void setFolga(boolean folga) {
        this.folga = folga;
    }
}
