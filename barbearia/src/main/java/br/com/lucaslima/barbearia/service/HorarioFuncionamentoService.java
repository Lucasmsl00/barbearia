package br.com.lucaslima.barbearia.service;

import br.com.lucaslima.barbearia.dto.HorarioFuncionamentoRequestDTO;
import br.com.lucaslima.barbearia.exception.BusinessException;
import br.com.lucaslima.barbearia.exception.ResourceNotFoundException;
import br.com.lucaslima.barbearia.model.Barbeiro;
import br.com.lucaslima.barbearia.model.HorarioFuncionamento;
import br.com.lucaslima.barbearia.repository.BarbeiroRepository;
import br.com.lucaslima.barbearia.repository.HorarioFuncionamentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class HorarioFuncionamentoService {

    private final HorarioFuncionamentoRepository horarioFuncionamentoRepository;
    private final BarbeiroRepository barbeiroRepository;

    public HorarioFuncionamentoService(HorarioFuncionamentoRepository horarioFuncionamentoRepository, BarbeiroRepository barbeiroRepository) {
        this.horarioFuncionamentoRepository = horarioFuncionamentoRepository;
        this.barbeiroRepository = barbeiroRepository;
    }

    public List<HorarioFuncionamento> listarPorBarbeiro(UUID barbeiroId) {
        return horarioFuncionamentoRepository.findByBarbeiroId(barbeiroId);
    }

    // Cria o horário do dia se não existir, ou atualiza se já existir (upsert por barbeiro + dia da semana)
    // barbeiroId vem do barbeiro autenticado, nunca do corpo da requisição — evita alterar horário de outro barbeiro
    @Transactional
    public HorarioFuncionamento salvar(UUID barbeiroId, HorarioFuncionamentoRequestDTO dto) {
        Barbeiro barbeiro = barbeiroRepository.findById(barbeiroId)
                .orElseThrow(() -> new ResourceNotFoundException("Barbeiro não encontrado"));

        HorarioFuncionamento horario = horarioFuncionamentoRepository
                .findByBarbeiroIdAndDiaSemana(barbeiroId, dto.getDiaSemana())
                .orElseGet(HorarioFuncionamento::new);

        if (!dto.isFolga() && dto.getHoraAlmocoInicio() != null && dto.getHoraAlmocoFim() != null) {
            boolean intervaloValido = dto.getHoraAlmocoInicio().isBefore(dto.getHoraAlmocoFim())
                    && !dto.getHoraAlmocoInicio().isBefore(dto.getHoraAbertura())
                    && !dto.getHoraAlmocoFim().isAfter(dto.getHoraFechamento());
            if (!intervaloValido) {
                throw new BusinessException("Horário de almoço inválido: precisa estar dentro do expediente e ter início antes do fim");
            }
        }

        horario.setBarbeiro(barbeiro);
        horario.setDiaSemana(dto.getDiaSemana());
        horario.setHoraAbertura(dto.getHoraAbertura());
        horario.setHoraFechamento(dto.getHoraFechamento());
        horario.setHoraAlmocoInicio(dto.isFolga() ? null : dto.getHoraAlmocoInicio());
        horario.setHoraAlmocoFim(dto.isFolga() ? null : dto.getHoraAlmocoFim());
        horario.setFolga(dto.isFolga());

        return horarioFuncionamentoRepository.save(horario);
    }
}
