CREATE DATABASE IF NOT EXISTS urna_master
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE urna_master;

DROP TABLE IF EXISTS votos;
DROP TABLE IF EXISTS candidatos;

CREATE TABLE candidatos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero CHAR(5) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    slogan VARCHAR(255) NULL
) ENGINE=InnoDB;

CREATE TABLE votos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidato_numero CHAR(5) NULL,
    tipo ENUM('CANDIDATO', 'BRANCO') NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_votos_candidato
        FOREIGN KEY (candidato_numero)
        REFERENCES candidatos(numero)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO candidatos (numero, nome, slogan) VALUES
('13000', 'LulaTron', 'Bio Picanha — a carne artificial do futuro'),
('14000', 'Renan Tigrinho', 'Tecnologia, velocidade e memes'),
('22000', 'CyberNaro', 'Mais bytes, menos burocracia');
