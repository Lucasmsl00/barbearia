package br.com.lucaslima.barbearia.service;

import br.com.lucaslima.barbearia.dto.BarbeiroRegisterDTO;
import br.com.lucaslima.barbearia.exception.BusinessException;
import br.com.lucaslima.barbearia.model.Barbeiro;
import br.com.lucaslima.barbearia.repository.BarbeiroRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BarbeiroService {
    private final BarbeiroRepository barbeiroRepository;
    private final PasswordEncoder passwordEncoder;

    public BarbeiroService(BarbeiroRepository barbeiroRepository, PasswordEncoder passwordEncoder) {
        this.barbeiroRepository = barbeiroRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Barbeiro> listarBarbeiros() {
        return barbeiroRepository.findAll();
    }

    public Barbeiro registrar(BarbeiroRegisterDTO dto) {
        // só o primeiro cadastro (bootstrap do negócio) é público; depois disso,
        // só um barbeiro já autenticado pode cadastrar outro (ex: um funcionário novo)
        if (barbeiroRepository.count() > 0 && !existeUsuarioAutenticado()) {
            throw new AccessDeniedException("Cadastro de novos barbeiros requer login");
        }

        barbeiroRepository.findByEmail(dto.getEmail()).ifPresent(b -> {
            throw new BusinessException("Já existe um barbeiro cadastrado com este e-mail");
        });

        Barbeiro barbeiro = new Barbeiro();
        barbeiro.setNome(dto.getNome());
        barbeiro.setEmail(dto.getEmail());
        barbeiro.setSenhaHash(passwordEncoder.encode(dto.getSenha()));

        return barbeiroRepository.save(barbeiro);
    }

    private boolean existeUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken);
    }
}
