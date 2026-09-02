package br.com.lucaslima.barbearia.controller;

import br.com.lucaslima.barbearia.dto.RelatorioResponseDTO;
import br.com.lucaslima.barbearia.security.CurrentUserService;
import br.com.lucaslima.barbearia.service.RelatorioService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;
    private final CurrentUserService currentUserService;

    public RelatorioController(RelatorioService relatorioService, CurrentUserService currentUserService) {
        this.relatorioService = relatorioService;
        this.currentUserService = currentUserService;
    }

    // protegido: relatório é sempre do próprio barbeiro autenticado
    @GetMapping
    public ResponseEntity<RelatorioResponseDTO> gerar(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        UUID barbeiroId = currentUserService.getBarbeiroAutenticado().getId();
        return ResponseEntity.ok(relatorioService.gerar(barbeiroId, dataInicio, dataFim));
    }
}
