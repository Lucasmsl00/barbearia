-- Baseline: schema já existente em produção, criado originalmente pelo Hibernate ddl-auto=update.
-- A partir daqui, toda mudança de schema deve vir em uma nova migration (V2, V3, ...),
-- nunca voltando a usar ddl-auto=update.

CREATE TABLE barbeiro (
    id uuid NOT NULL,
    email varchar(255) NOT NULL,
    nome varchar(255) NOT NULL,
    senha_hash varchar(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_barbeiro_email UNIQUE (email)
);

CREATE TABLE cliente (
    id uuid NOT NULL,
    nome varchar(255) NOT NULL,
    telefone varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE servico (
    id uuid NOT NULL,
    duracao_minutos integer NOT NULL,
    nome varchar(255) NOT NULL,
    preco numeric(38,2) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE horario_funcionamento (
    id uuid NOT NULL,
    dia_semana varchar(255) NOT NULL
        CHECK (dia_semana IN ('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY')),
    folga boolean NOT NULL,
    hora_abertura time(0),
    hora_fechamento time(0),
    barbeiro_id uuid NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_horario_barbeiro FOREIGN KEY (barbeiro_id) REFERENCES barbeiro (id)
);

CREATE TABLE agendamento (
    id uuid NOT NULL,
    data date NOT NULL,
    hora_fim time(0) NOT NULL,
    hora_inicio time(0) NOT NULL,
    status varchar(255) NOT NULL
        CHECK (status IN ('PENDENTE','CONFIRMADO','CANCELADO','CONCLUIDO','REMARCADO')),
    agendamento_origem_id uuid,
    barbeiro_id uuid NOT NULL,
    cliente_id uuid NOT NULL,
    servico_id uuid NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_agendamento_origem FOREIGN KEY (agendamento_origem_id) REFERENCES agendamento (id),
    CONSTRAINT fk_agendamento_barbeiro FOREIGN KEY (barbeiro_id) REFERENCES barbeiro (id),
    CONSTRAINT fk_agendamento_cliente FOREIGN KEY (cliente_id) REFERENCES cliente (id),
    CONSTRAINT fk_agendamento_servico FOREIGN KEY (servico_id) REFERENCES servico (id)
);
