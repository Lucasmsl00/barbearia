package br.com.lucaslima.barbearia.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.util.Set;

public class ServicoRequestDTO {

    @NotBlank(message = "O nome do serviço é obrigatório")
    private String nome;

    @NotNull(message = "A duração é obrigatória")
    @Positive(message = "A duração deve ser maior que zero")
    private Integer duracaoMinutos;

    @NotNull(message = "O preço é obrigatório")
    @Positive(message = "O preço deve ser maior que zero")
    private BigDecimal preco;

    @Positive(message = "O preço alternativo deve ser maior que zero")
    private BigDecimal precoAlternativo;

    private Set<DayOfWeek> diasPrecoAlternativo;

    private boolean adicional;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getDuracaoMinutos() {
        return duracaoMinutos;
    }

    public void setDuracaoMinutos(Integer duracaoMinutos) {
        this.duracaoMinutos = duracaoMinutos;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public BigDecimal getPrecoAlternativo() {
        return precoAlternativo;
    }

    public void setPrecoAlternativo(BigDecimal precoAlternativo) {
        this.precoAlternativo = precoAlternativo;
    }

    public Set<DayOfWeek> getDiasPrecoAlternativo() {
        return diasPrecoAlternativo;
    }

    public void setDiasPrecoAlternativo(Set<DayOfWeek> diasPrecoAlternativo) {
        this.diasPrecoAlternativo = diasPrecoAlternativo;
    }

    public boolean isAdicional() {
        return adicional;
    }

    public void setAdicional(boolean adicional) {
        this.adicional = adicional;
    }
}
