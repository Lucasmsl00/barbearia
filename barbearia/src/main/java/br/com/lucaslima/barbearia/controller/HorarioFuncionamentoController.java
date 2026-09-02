package br.com.lucaslima.barbearia.controller;

import br.com.lucaslima.barbearia.dto.HorarioFuncionamentoRequestDTO;
import br.com.lucaslima.barbearia.dto.HorarioFuncionamentoResponseDTO;
import br.com.lucaslima.barbearia.model.HorarioFuncionamento;
import br.com.lucaslima.barbearia.security.CurrentUserService;
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
    private final CurrentUserService currentUserService;

    public HorarioFuncionamentoController(HorarioFuncionamentoService horarioFuncionamentoService, CurrentUserService currentUserService) {
        this.horarioFuncionamentoService = horarioFuncionamentoService;
        this.currentUserService = currentUserService;
    }

    // público: cliente pode consultar o expediente de qualquer barbeiro antes de agendar
    @GetMapping
    public ResponseEntity<List<HorarioFuncionamentoResponseDTO>> listarPorBarbeiro(@RequestParam UUID barbeiroId) {
        List<HorarioFuncionamentoResponseDTO> horarios = horarioFuncionamentoService.listarPorBarbeiro(barbeiroId)
                .stream()
                .map(HorarioFuncionamentoResponseDTO::new)
                .toList();
        return ResponseEntity.ok(horarios);
    }

    // protegido: só altera o horário do próprio barbeiro autenticado
    @PostMapping
    public ResponseEntity<HorarioFuncionamentoResponseDTO> salvar(@Valid @RequestBody HorarioFuncionamentoRequestDTO dto) {
        UUID barbeiroId = currentUserService.getBarbeiroAutenticado().getId();
        HorarioFuncionamento horario = horarioFuncionamentoService.salvar(barbeiroId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new HorarioFuncionamentoResponseDTO(horario));
    }
}
