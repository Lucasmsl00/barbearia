package br.com.lucaslima.barbearia.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "imagem_site")
public class ImagemSite {

    @Id
    private String slot;

    @Column(nullable = false)
    private byte[] conteudo;

    @Column(name = "content_type", nullable = false)
    private String contentType;

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm;

    public ImagemSite() {}

    public String getSlot() {
        return slot;
    }

    public void setSlot(String slot) {
        this.slot = slot;
    }

    public byte[] getConteudo() {
        return conteudo;
    }

    public void setConteudo(byte[] conteudo) {
        this.conteudo = conteudo;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Instant getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(Instant atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}
