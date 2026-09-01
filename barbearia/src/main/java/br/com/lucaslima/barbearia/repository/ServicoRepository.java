package br.com.lucaslima.barbearia.repository;

import br.com.lucaslima.barbearia.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ServicoRepository extends JpaRepository<Servico, UUID> {
}
