package br.com.lucaslima.barbearia.controller;

import br.com.lucaslima.barbearia.dto.AgendamentoRequestDTO;
import br.com.lucaslima.barbearia.dto.AgendamentoResponseDTO;
import br.com.lucaslima.barbearia.dto.RemarcarAgendamentoDTO;
import br.com.lucaslima.barbearia.model.Agendamento;
import br.com.lucaslima.barbearia.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    @GetMapping("/horarios-disponiveis")
    public ResponseEntity<List<LocalTime>> buscarHorariosDisponiveis(
            @RequestParam UUID barbeiroId,
            @RequestParam UUID servicoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        List<LocalTime> horarios = agendamentoService.buscarHorariosDisponiveis(barbeiroId, servicoId, data);
        return ResponseEntity.ok(horarios);
    }

    @GetMapping("/atendimentos")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarAgendamentosPorBarbeiroEData(
            @RequestParam UUID barbeiroId,
            @RequestParam LocalDate data) {
        List<AgendamentoResponseDTO> agendamentos = agendamentoService.listarAgendamentoPorBarbeiroEData(barbeiroId, data)
                .stream()
                .map(AgendamentoResponseDTO::new)
                .toList();
        return ResponseEntity.ok(agendamentos);
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<AgendamentoResponseDTO> cancelarAgendamento(@PathVariable UUID id) {
        Agendamento agendamento = agendamentoService.cancelarAgendamento(id);
        return ResponseEntity.ok(new AgendamentoResponseDTO(agendamento));
    }

    @PatchMapping("/{id}/remarcar")
    public ResponseEntity<AgendamentoResponseDTO> remarcarAgendamento(
            @PathVariable UUID id,
            @Valid @RequestBody RemarcarAgendamentoDTO dto) {
        Agendamento novoAgendamento = agendamentoService.remarcarAgendamento(id, dto.getNovaData(), dto.getNovaHoraInicio());
        return ResponseEntity.ok(new AgendamentoResponseDTO(novoAgendamento));
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> criarAgendamento(@Valid @RequestBody AgendamentoRequestDTO dto) {
        Agendamento novoAgendamento = agendamentoService.criarAgendamento(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AgendamentoResponseDTO(novoAgendamento));
    }
}
