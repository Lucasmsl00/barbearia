package br.com.lucaslima.barbearia.dto;

import java.time.Instant;

public class ImagemSlotDTO {
    private final String slot;
    private final String label;
    private final boolean temImagem;
    private final Instant atualizadoEm;

    public ImagemSlotDTO(String slot, String label, boolean temImagem, Instant atualizadoEm) {
        this.slot = slot;
        this.label = label;
        this.temImagem = temImagem;
        this.atualizadoEm = atualizadoEm;
    }

    public String getSlot() {
        return slot;
    }

    public String getLabel() {
        return label;
    }

    public boolean isTemImagem() {
        return temImagem;
    }

    public Instant getAtualizadoEm() {
        return atualizadoEm;
    }
}
