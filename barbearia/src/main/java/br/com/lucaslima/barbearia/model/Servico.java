package br.com.lucaslima.barbearia.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "servico")
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(name = "duracao_minutos", nullable = false)
    @Positive(message = "O serviço deve ter duração maior que zero")
    private int duracaoMinutos;

    @Column(nullable = false)
    @Positive(message = "O preço deve ser maior que zero")
    private BigDecimal preco;

    // preço cobrado nos dias listados em diasPrecoAlternativo; nos demais dias vale o preço padrão acima
    @Column(name = "preco_alternativo")
    private BigDecimal precoAlternativo;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "servico_dia_preco_alternativo", joinColumns = @JoinColumn(name = "servico_id"))
    @Column(name = "dia_semana")
    @Enumerated(EnumType.STRING)
    private Set<DayOfWeek> diasPrecoAlternativo = new HashSet<>();

    // true = oferecido como extra opcional no agendamento (ex: sobrancelha, pigmentação), não como serviço principal
    @Column(nullable = false)
    private boolean adicional;

    public Servico() {}

    public UUID getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getDuracaoMinutos() {
        return duracaoMinutos;
    }

    public void setDuracaoMinutos(int duracaoMinutos) {
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
        this.diasPrecoAlternativo = diasPrecoAlternativo != null ? diasPrecoAlternativo : new HashSet<>();
    }

    public BigDecimal precoParaData(LocalDate data) {
        if (precoAlternativo != null && data != null && diasPrecoAlternativo.contains(data.getDayOfWeek())) {
            return precoAlternativo;
        }
        return preco;
    }

    public boolean isAdicional() {
        return adicional;
    }

    public void setAdicional(boolean adicional) {
        this.adicional = adicional;
    }
}
