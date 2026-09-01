package br.com.lucaslima.barbearia.repository;

import br.com.lucaslima.barbearia.model.HorarioFuncionamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface HorarioFuncionamentoRepository extends JpaRepository<HorarioFuncionamento, UUID> {

    Optional<HorarioFuncionamento> findByBarbeiroIdAndDiaSemana(UUID barbeiroId, DayOfWeek diaSemana);

    List<HorarioFuncionamento> findByBarbeiroId(UUID barbeiroId);
}
