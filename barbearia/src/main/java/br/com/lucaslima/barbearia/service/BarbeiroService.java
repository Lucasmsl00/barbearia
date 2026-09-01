package br.com.lucaslima.barbearia.service;

import br.com.lucaslima.barbearia.dto.BarbeiroRegisterDTO;
import br.com.lucaslima.barbearia.exception.BusinessException;
import br.com.lucaslima.barbearia.model.Barbeiro;
import br.com.lucaslima.barbearia.repository.BarbeiroRepository;
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
        barbeiroRepository.findByEmail(dto.getEmail()).ifPresent(b -> {
            throw new BusinessException("Já existe um barbeiro cadastrado com este e-mail");
        });

        Barbeiro barbeiro = new Barbeiro();
        barbeiro.setNome(dto.getNome());
        barbeiro.setEmail(dto.getEmail());
        barbeiro.setSenhaHash(passwordEncoder.encode(dto.getSenha()));

        return barbeiroRepository.save(barbeiro);
    }
}
