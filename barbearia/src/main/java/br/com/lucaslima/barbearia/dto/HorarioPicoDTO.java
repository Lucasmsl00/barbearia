package br.com.lucaslima.barbearia.dto;

public class HorarioPicoDTO {
    private final String hora;
    private final long quantidade;

    public HorarioPicoDTO(String hora, long quantidade) {
        this.hora = hora;
        this.quantidade = quantidade;
    }

    public String getHora() {
        return hora;
    }

    public long getQuantidade() {
        return quantidade;
    }
}
