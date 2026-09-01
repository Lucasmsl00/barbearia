package br.com.lucaslima.barbearia.dto;

import br.com.lucaslima.barbearia.model.Barbeiro;

import java.util.UUID;

public class BarbeiroResponseDTO {

    private UUID id;
    private String nome;
    private String email;

    public BarbeiroResponseDTO() {}

    public BarbeiroResponseDTO(Barbeiro barbeiro) {
        this.id = barbeiro.getId();
        this.nome = barbeiro.getNome();
        this.email = barbeiro.getEmail();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
