package br.com.lucaslima.barbearia.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.lucaslima.barbearia.dto.BarbeiroRegisterDTO;
import br.com.lucaslima.barbearia.dto.BarbeiroResponseDTO;
import br.com.lucaslima.barbearia.dto.TrocarSenhaDTO;
import br.com.lucaslima.barbearia.model.Barbeiro;
import br.com.lucaslima.barbearia.security.CurrentUserService;
import br.com.lucaslima.barbearia.service.BarbeiroService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/barbeiros")
public class BarbeiroController {
    private final BarbeiroService barbeiroService;
    private final CurrentUserService currentUserService;

    public BarbeiroController(BarbeiroService barbeiroService, CurrentUserService currentUserService) {
        this.barbeiroService = barbeiroService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public ResponseEntity<List<BarbeiroResponseDTO>> listarBarbeiros() {
        List<BarbeiroResponseDTO> barbeiros = barbeiroService.listarBarbeiros().stream()
                .map(BarbeiroResponseDTO::new)
                .toList();
        return ResponseEntity.ok(barbeiros);
    }

    @PostMapping("/registrar")
    public ResponseEntity<BarbeiroResponseDTO> registrar(@Valid @RequestBody BarbeiroRegisterDTO dto) {
        Barbeiro barbeiro = barbeiroService.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new BarbeiroResponseDTO(barbeiro));
    }

    // protegido: só troca a própria senha, nunca a de outro barbeiro
    @PatchMapping("/senha")
    public ResponseEntity<Void> trocarSenha(@Valid @RequestBody TrocarSenhaDTO dto) {
        var barbeiroId = currentUserService.getBarbeiroAutenticado().getId();
        barbeiroService.trocarSenha(barbeiroId, dto);
        return ResponseEntity.noContent().build();
    }
}
