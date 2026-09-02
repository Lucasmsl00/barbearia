package br.com.lucaslima.barbearia.dto;

public class ServicoRankingDTO {
    private final String nome;
    private final long quantidade;

    public ServicoRankingDTO(String nome, long quantidade) {
        this.nome = nome;
        this.quantidade = quantidade;
    }

    public String getNome() {
        return nome;
    }

    public long getQuantidade() {
        return quantidade;
    }
}
