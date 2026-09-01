package br.com.lucaslima.barbearia.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class RemarcarAgendamentoDTO {

    @NotNull(message = "A nova data é obrigatória")
    private LocalDate novaData;

    @NotNull(message = "A nova hora de início é obrigatória")
    private LocalTime novaHoraInicio;

    public LocalDate getNovaData() {
        return novaData;
    }

    public void setNovaData(LocalDate novaData) {
        this.novaData = novaData;
    }

    public LocalTime getNovaHoraInicio() {
        return novaHoraInicio;
    }

    public void setNovaHoraInicio(LocalTime novaHoraInicio) {
        this.novaHoraInicio = novaHoraInicio;
    }
}
