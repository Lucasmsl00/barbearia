package br.com.lucaslima.barbearia.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.lucaslima.barbearia.dto.ServicoRequestDTO;
import br.com.lucaslima.barbearia.exception.ResourceNotFoundException;
import br.com.lucaslima.barbearia.model.Servico;
import br.com.lucaslima.barbearia.repository.ServicoRepository;

@Service
public class ServicoService {
    private final ServicoRepository servicoRepository;

    public ServicoService(ServicoRepository servicoRepository) {
        this.servicoRepository = servicoRepository;
    }

    public List<Servico> listarServicos() {
        return servicoRepository.findAll();
    }

    @Transactional
    public Servico criarServico(ServicoRequestDTO dto) {
        Servico servico = new Servico();
        servico.setNome(dto.getNome());
        servico.setDuracaoMinutos(dto.getDuracaoMinutos());
        servico.setPreco(dto.getPreco());
        return servicoRepository.save(servico);
    }

    @Transactional
    public Servico atualizarServico(UUID id, ServicoRequestDTO dto) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado"));

        servico.setNome(dto.getNome());
        servico.setDuracaoMinutos(dto.getDuracaoMinutos());
        servico.setPreco(dto.getPreco());

        return servicoRepository.save(servico);
    }

    @Transactional
    public void excluirServico(UUID id) {
        if (!servicoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Serviço não encontrado");
        }
        servicoRepository.deleteById(id);
    }
}
