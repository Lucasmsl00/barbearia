package br.com.lucaslima.barbearia.dto;

import java.util.UUID;

public class LoginResponseDTO {

    private final String token;
    private final String tipo = "Bearer";
    private final UUID barbeiroId;
    private final String nome;
    private final boolean dono;

    public LoginResponseDTO(String token, UUID barbeiroId, String nome, boolean dono) {
        this.token = token;
        this.barbeiroId = barbeiroId;
        this.nome = nome;
        this.dono = dono;
    }

    public String getToken() {
        return token;
    }

    public String getTipo() {
        return tipo;
    }

    public UUID getBarbeiroId() {
        return barbeiroId;
    }

    public String getNome() {
        return nome;
    }

    public boolean isDono() {
        return dono;
    }
}
