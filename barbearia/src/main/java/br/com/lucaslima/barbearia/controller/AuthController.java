package br.com.lucaslima.barbearia.controller;

import br.com.lucaslima.barbearia.dto.LoginRequestDTO;
import br.com.lucaslima.barbearia.dto.LoginResponseDTO;
import br.com.lucaslima.barbearia.model.Barbeiro;
import br.com.lucaslima.barbearia.repository.BarbeiroRepository;
import br.com.lucaslima.barbearia.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final BarbeiroRepository barbeiroRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, BarbeiroRepository barbeiroRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.barbeiroRepository = barbeiroRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getSenha())
        );

        Barbeiro barbeiro = barbeiroRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalStateException("Barbeiro autenticado não encontrado"));

        String token = jwtService.gerarToken(barbeiro.getEmail());

        return ResponseEntity.ok(new LoginResponseDTO(token, barbeiro.getId(), barbeiro.getNome()));
    }
}
