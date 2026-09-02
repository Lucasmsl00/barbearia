package br.com.lucaslima.barbearia.security;

import br.com.lucaslima.barbearia.model.Barbeiro;
import br.com.lucaslima.barbearia.repository.BarbeiroRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final BarbeiroRepository barbeiroRepository;

    public CurrentUserService(BarbeiroRepository barbeiroRepository) {
        this.barbeiroRepository = barbeiroRepository;
    }

    public Barbeiro getBarbeiroAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return barbeiroRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Barbeiro autenticado não encontrado"));
    }
}
