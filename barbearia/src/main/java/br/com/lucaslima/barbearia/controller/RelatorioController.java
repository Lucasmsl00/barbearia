package br.com.lucaslima.barbearia.controller;

import br.com.lucaslima.barbearia.dto.RelatorioResponseDTO;
import br.com.lucaslima.barbearia.model.Barbeiro;
import br.com.lucaslima.barbearia.security.CurrentUserService;
import br.com.lucaslima.barbearia.service.RelatorioService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;
    private final CurrentUserService currentUserService;

    public RelatorioController(RelatorioService relatorioService, CurrentUserService currentUserService) {
        this.relatorioService = relatorioService;
        this.currentUserService = currentUserService;
    }

    // protegido: barbeiro comum vê só o próprio relatório; o dono vê a barbearia inteira
    @GetMapping
    public ResponseEntity<RelatorioResponseDTO> gerar(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        Barbeiro autenticado = currentUserService.getBarbeiroAutenticado();
        RelatorioResponseDTO relatorio = autenticado.isDono()
                ? relatorioService.gerarGeral(dataInicio, dataFim)
                : relatorioService.gerar(autenticado.getId(), dataInicio, dataFim);
        return ResponseEntity.ok(relatorio);
    }
}
