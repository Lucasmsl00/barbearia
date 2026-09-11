package br.com.lucaslima.barbearia.controller;

import br.com.lucaslima.barbearia.dto.AgendamentoRequestDTO;
import br.com.lucaslima.barbearia.dto.AgendamentoResponseDTO;
import br.com.lucaslima.barbearia.dto.RemarcarAgendamentoDTO;
import br.com.lucaslima.barbearia.model.Agendamento;
import br.com.lucaslima.barbearia.model.Barbeiro;
import br.com.lucaslima.barbearia.security.CurrentUserService;
import br.com.lucaslima.barbearia.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;
    private final CurrentUserService currentUserService;

    public AgendamentoController(AgendamentoService agendamentoService, CurrentUserService currentUserService) {
        this.agendamentoService = agendamentoService;
        this.currentUserService = currentUserService;
    }

    // público: cliente vê horários livres antes de agendar
    @GetMapping("/horarios-disponiveis")
    public ResponseEntity<List<LocalTime>> buscarHorariosDisponiveis(
            @RequestParam UUID barbeiroId,
            @RequestParam UUID servicoId,
            @RequestParam(required = false) Set<UUID> adicionaisIds,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        List<LocalTime> horarios = agendamentoService.buscarHorariosDisponiveis(barbeiroId, servicoId, adicionaisIds, data);
        return ResponseEntity.ok(horarios);
    }

    // protegido: agenda do próprio barbeiro logado; o dono vê a agenda de todos
    @GetMapping("/atendimentos")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarAgendamentosPorBarbeiroEData(
            @RequestParam LocalDate data) {
        Barbeiro autenticado = currentUserService.getBarbeiroAutenticado();
        List<Agendamento> lista = autenticado.isDono()
                ? agendamentoService.listarAgendamentoPorData(data)
                : agendamentoService.listarAgendamentoPorBarbeiroEData(autenticado.getId(), data);
        List<AgendamentoResponseDTO> agendamentos = lista.stream()
                .map(AgendamentoResponseDTO::new)
                .toList();
        return ResponseEntity.ok(agendamentos);
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<AgendamentoResponseDTO> cancelarAgendamento(@PathVariable UUID id) {
        Barbeiro autenticado = currentUserService.getBarbeiroAutenticado();
        Agendamento agendamento = agendamentoService.cancelarAgendamento(id, autenticado);
        return ResponseEntity.ok(new AgendamentoResponseDTO(agendamento));
    }

    @PatchMapping("/{id}/concluir")
    public ResponseEntity<AgendamentoResponseDTO> concluirAgendamento(@PathVariable UUID id) {
        Barbeiro autenticado = currentUserService.getBarbeiroAutenticado();
        Agendamento agendamento = agendamentoService.concluirAgendamento(id, autenticado);
        return ResponseEntity.ok(new AgendamentoResponseDTO(agendamento));
    }

    @PatchMapping("/{id}/remarcar")
    public ResponseEntity<AgendamentoResponseDTO> remarcarAgendamento(
            @PathVariable UUID id,
            @Valid @RequestBody RemarcarAgendamentoDTO dto) {
        Barbeiro autenticado = currentUserService.getBarbeiroAutenticado();
        Agendamento novoAgendamento = agendamentoService.remarcarAgendamento(id, dto.getNovaData(), dto.getNovaHoraInicio(), dto.getMotivo(), autenticado);
        return ResponseEntity.ok(new AgendamentoResponseDTO(novoAgendamento));
    }

    // público: cliente cria seu próprio agendamento, sem login
    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> criarAgendamento(@Valid @RequestBody AgendamentoRequestDTO dto) {
        Agendamento novoAgendamento = agendamentoService.criarAgendamento(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AgendamentoResponseDTO(novoAgendamento));
    }
}
