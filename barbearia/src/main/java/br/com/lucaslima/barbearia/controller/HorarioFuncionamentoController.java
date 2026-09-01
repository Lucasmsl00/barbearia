package br.com.lucaslima.barbearia.controller;

import br.com.lucaslima.barbearia.dto.HorarioFuncionamentoRequestDTO;
import br.com.lucaslima.barbearia.model.HorarioFuncionamento;
import br.com.lucaslima.barbearia.service.HorarioFuncionamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/horarios-funcionamento")
public class HorarioFuncionamentoController {

    private final HorarioFuncionamentoService horarioFuncionamentoService;

    public HorarioFuncionamentoController(HorarioFuncionamentoService horarioFuncionamentoService) {
        this.horarioFuncionamentoService = horarioFuncionamentoService;
    }

    @GetMapping
    public ResponseEntity<List<HorarioFuncionamento>> listarPorBarbeiro(@RequestParam UUID barbeiroId) {
        return ResponseEntity.ok(horarioFuncionamentoService.listarPorBarbeiro(barbeiroId));
    }

    @PostMapping
    public ResponseEntity<HorarioFuncionamento> salvar(@Valid @RequestBody HorarioFuncionamentoRequestDTO dto) {
        HorarioFuncionamento horario = horarioFuncionamentoService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(horario);
    }
}
