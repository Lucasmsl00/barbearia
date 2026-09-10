CREATE TABLE imagem_site (
    slot varchar(50) NOT NULL,
    conteudo bytea NOT NULL,
    content_type varchar(100) NOT NULL,
    atualizado_em timestamp NOT NULL,
    PRIMARY KEY (slot)
);
