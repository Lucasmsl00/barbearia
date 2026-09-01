package br.com.lucaslima.barbearia.repository;

import br.com.lucaslima.barbearia.model.Agendamento;
import br.com.lucaslima.barbearia.model.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AgendamentoRepository extends JpaRepository<Agendamento, UUID> {

    List<Agendamento> findByBarbeiroIdAndDataAndStatusNot(UUID barbeiroId, LocalDate data, StatusAgendamento status);

    List<Agendamento> findByBarbeiroIdAndData(UUID barbeiroId, LocalDate data);
}
