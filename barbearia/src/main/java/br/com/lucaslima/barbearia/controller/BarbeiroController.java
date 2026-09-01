package br.com.lucaslima.barbearia.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.lucaslima.barbearia.dto.BarbeiroRegisterDTO;
import br.com.lucaslima.barbearia.dto.BarbeiroResponseDTO;
import br.com.lucaslima.barbearia.model.Barbeiro;
import br.com.lucaslima.barbearia.service.BarbeiroService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/barbeiros")
public class BarbeiroController {
    private final BarbeiroService barbeiroService;

    public BarbeiroController(BarbeiroService barbeiroService) {
        this.barbeiroService = barbeiroService;
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
}
