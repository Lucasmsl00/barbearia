package br.com.lucaslima.barbearia.dto;

import br.com.lucaslima.barbearia.model.HorarioFuncionamento;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

public class HorarioFuncionamentoResponseDTO {

    private final UUID id;
    private final DayOfWeek diaSemana;
    private final LocalTime horaAbertura;
    private final LocalTime horaFechamento;
    private final LocalTime horaAlmocoInicio;
    private final LocalTime horaAlmocoFim;
    private final boolean folga;

    public HorarioFuncionamentoResponseDTO(HorarioFuncionamento horario) {
        this.id = horario.getId();
        this.diaSemana = horario.getDiaSemana();
        this.horaAbertura = horario.getHoraAbertura();
        this.horaFechamento = horario.getHoraFechamento();
        this.horaAlmocoInicio = horario.getHoraAlmocoInicio();
        this.horaAlmocoFim = horario.getHoraAlmocoFim();
        this.folga = horario.isFolga();
    }

    public UUID getId() {
        return id;
    }

    public DayOfWeek getDiaSemana() {
        return diaSemana;
    }

    public LocalTime getHoraAbertura() {
        return horaAbertura;
    }

    public LocalTime getHoraFechamento() {
        return horaFechamento;
    }

    public LocalTime getHoraAlmocoInicio() {
        return horaAlmocoInicio;
    }

    public LocalTime getHoraAlmocoFim() {
        return horaAlmocoFim;
    }

    public boolean isFolga() {
        return folga;
    }
}
