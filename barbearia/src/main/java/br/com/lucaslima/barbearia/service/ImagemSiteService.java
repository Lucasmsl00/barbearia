package br.com.lucaslima.barbearia.service;

import br.com.lucaslima.barbearia.dto.ImagemSlotDTO;
import br.com.lucaslima.barbearia.exception.BusinessException;
import br.com.lucaslima.barbearia.exception.ResourceNotFoundException;
import br.com.lucaslima.barbearia.model.ImagemSite;
import br.com.lucaslima.barbearia.repository.ImagemSiteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ImagemSiteService {

    // slots válidos e o rótulo exibido no painel — mantidos em sincronia com a landing page
    public static final Map<String, String> SLOTS = new LinkedHashMap<>();
    static {
        SLOTS.put("sobre", "Foto da seção \"Sobre nós\"");
        SLOTS.put("galeria-1", "Galeria — foto 1");
        SLOTS.put("galeria-2", "Galeria — foto 2");
        SLOTS.put("galeria-3", "Galeria — foto 3");
        SLOTS.put("galeria-4", "Galeria — foto 4");
        SLOTS.put("galeria-5", "Galeria — foto 5");
        SLOTS.put("galeria-6", "Galeria — foto 6");
    }

    private static final long TAMANHO_MAXIMO = 4L * 1024 * 1024; // 4MB

    private final ImagemSiteRepository imagemSiteRepository;

    public ImagemSiteService(ImagemSiteRepository imagemSiteRepository) {
        this.imagemSiteRepository = imagemSiteRepository;
    }

    public List<ImagemSlotDTO> listarSlots() {
        Map<String, ImagemSite> existentes = imagemSiteRepository.findAllById(SLOTS.keySet())
                .stream()
                .collect(java.util.stream.Collectors.toMap(ImagemSite::getSlot, i -> i));

        return SLOTS.entrySet().stream()
                .map(e -> {
                    ImagemSite existente = existentes.get(e.getKey());
                    return new ImagemSlotDTO(
                            e.getKey(),
                            e.getValue(),
                            existente != null,
                            existente != null ? existente.getAtualizadoEm() : null
                    );
                })
                .toList();
    }

    public ImagemSite buscar(String slot) {
        return imagemSiteRepository.findById(slot)
                .orElseThrow(() -> new ResourceNotFoundException("Nenhuma imagem cadastrada para este espaço"));
    }

    @Transactional
    public void salvar(String slot, MultipartFile arquivo) {
        validarSlot(slot);

        if (arquivo == null || arquivo.isEmpty()) {
            throw new BusinessException("Selecione uma imagem");
        }
        if (arquivo.getSize() > TAMANHO_MAXIMO) {
            throw new BusinessException("A imagem deve ter no máximo 4MB");
        }

        byte[] bytes;
        try {
            bytes = arquivo.getBytes();
        } catch (IOException e) {
            throw new UncheckedIOException("Não foi possível ler o arquivo enviado", e);
        }

        // não confia no Content-Type que o cliente declarou: verifica a assinatura real dos bytes,
        // pra impedir que um arquivo disfarçado (ex: HTML/script renomeado) seja aceito como imagem
        String tipoReal = detectarTipoImagem(bytes);
        if (tipoReal == null) {
            throw new BusinessException("Formato inválido — envie uma imagem JPEG, PNG ou WEBP");
        }

        ImagemSite imagem = imagemSiteRepository.findById(slot).orElseGet(ImagemSite::new);
        imagem.setSlot(slot);
        imagem.setConteudo(bytes);
        imagem.setContentType(tipoReal);
        imagem.setAtualizadoEm(Instant.now());

        imagemSiteRepository.save(imagem);
    }

    // checa a assinatura (magic bytes) real do arquivo, ignorando o Content-Type declarado pelo cliente
    private String detectarTipoImagem(byte[] bytes) {
        if (bytes.length >= 8
                && (bytes[0] & 0xFF) == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47
                && bytes[4] == 0x0D && bytes[5] == 0x0A && bytes[6] == 0x1A && bytes[7] == 0x0A) {
            return "image/png";
        }
        if (bytes.length >= 3 && (bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xD8 && (bytes[2] & 0xFF) == 0xFF) {
            return "image/jpeg";
        }
        if (bytes.length >= 12
                && bytes[0] == 'R' && bytes[1] == 'I' && bytes[2] == 'F' && bytes[3] == 'F'
                && bytes[8] == 'W' && bytes[9] == 'E' && bytes[10] == 'B' && bytes[11] == 'P') {
            return "image/webp";
        }
        return null;
    }

    @Transactional
    public void remover(String slot) {
        validarSlot(slot);
        imagemSiteRepository.deleteById(slot);
    }

    private void validarSlot(String slot) {
        if (!SLOTS.containsKey(slot)) {
            throw new ResourceNotFoundException("Espaço de imagem desconhecido: " + slot);
        }
    }
}
