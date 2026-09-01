package br.com.lucaslima.barbearia.controller;

import org.springframework.web.bind.annotation.*;

import br.com.lucaslima.barbearia.dto.ServicoRequestDTO;
import br.com.lucaslima.barbearia.model.Servico;
import br.com.lucaslima.barbearia.service.ServicoService;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/servicos")
public class ServicoController {
    private final ServicoService servicoService;

    public ServicoController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    @GetMapping
    public ResponseEntity<List<Servico>> listarServicos() {
        List<Servico> servico = servicoService.listarServicos();
        return ResponseEntity.ok(servico);
    }

    @PostMapping
    public ResponseEntity<Servico> criarServico(@Valid @RequestBody ServicoRequestDTO dto) {
        Servico novoServico = servicoService.criarServico(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoServico);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servico> atualizarServico(@PathVariable UUID id, @Valid @RequestBody ServicoRequestDTO dto) {
        Servico servicoAtualizado = servicoService.atualizarServico(id, dto);
        return ResponseEntity.ok(servicoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirServico(@PathVariable UUID id) {
        servicoService.excluirServico(id);
        return ResponseEntity.noContent().build();
    }
}
