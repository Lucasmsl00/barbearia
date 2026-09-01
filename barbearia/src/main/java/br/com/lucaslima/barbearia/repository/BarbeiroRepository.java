package br.com.lucaslima.barbearia.repository;

import br.com.lucaslima.barbearia.model.Barbeiro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BarbeiroRepository extends JpaRepository<Barbeiro, UUID> {

    Optional<Barbeiro> findByEmail(String email);
}
