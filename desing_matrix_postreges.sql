-- Remover a tabela 'projetos' se existir
DROP TABLE IF EXISTS projetos;

-- Criar tabela 'projetos' no PostgreSQL
CREATE TABLE projetos (
  id SERIAL PRIMARY KEY,                      -- SERIAL em vez de AUTO_INCREMENT
  idUsuario INT NOT NULL,                     -- Tipo de dado INT igual
  data JSONB NOT NULL,                        -- 'json' se torna 'JSONB' para melhor performance
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 'timestamp' e 'CURRENT_TIMESTAMP' iguais
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 'updatedAt' com 'CURRENT_TIMESTAMP'
  CONSTRAINT fk_projetos_usuario FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
);

-- Adicionar um índice na coluna 'idUsuario'
CREATE INDEX idx_idUsuario ON projetos(idUsuario);

-- Remover a tabela 'usuario' se existir
DROP TABLE IF EXISTS usuario;

-- Criar tabela 'usuario' no PostgreSQL
CREATE TABLE usuario (
  idUsuario SERIAL PRIMARY KEY,          -- 'SERIAL' para auto incremento
  user_name VARCHAR(150) NOT NULL,       -- 'VARCHAR' mantém a mesma
  email VARCHAR(150) NOT NULL,           -- 'VARCHAR' mantém a mesma
  senha VARCHAR(64) DEFAULT NULL,        -- 'VARCHAR' mantém a mesma
  CONSTRAINT unique_email UNIQUE (email) -- 'UNIQUE' para garantir a unicidade do email
);

-- Função para atualizar o campo 'updatedAt'
CREATE OR REPLACE FUNCTION update_projetos_updatedAt()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = CURRENT_TIMESTAMP;  -- Atualiza o 'updatedAt' com o timestamp atual
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Gatilho para a tabela 'projetos'
CREATE TRIGGER trigger_update_projetos_updatedAt
BEFORE UPDATE ON projetos
FOR EACH ROW
EXECUTE FUNCTION update_projetos_updatedAt();
