ALTER TABLE servico ADD COLUMN preco_alternativo numeric(10,2);

CREATE TABLE servico_dia_preco_alternativo (
    servico_id uuid NOT NULL REFERENCES servico(id) ON DELETE CASCADE,
    dia_semana varchar(20) NOT NULL,
    PRIMARY KEY (servico_id, dia_semana)
);
