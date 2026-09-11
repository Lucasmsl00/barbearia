ALTER TABLE servico ADD COLUMN adicional boolean NOT NULL DEFAULT false;

CREATE TABLE agendamento_servico_adicional (
    agendamento_id uuid NOT NULL REFERENCES agendamento(id) ON DELETE CASCADE,
    servico_id uuid NOT NULL REFERENCES servico(id),
    PRIMARY KEY (agendamento_id, servico_id)
);
