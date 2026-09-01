package br.com.lucaslima.barbearia.repository;

import br.com.lucaslima.barbearia.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    Optional<Cliente> findByTelefone(String telefone);
}
