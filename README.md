# Desing Matrix

## Descrição

Este projeto é uma plataforma de design de interiores que permite aos usuários criar e visualizar projetos de forma prática e eficiente. A plataforma oferece ferramentas de desenho para adicionar móveis, paredes e outros elementos ao design.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)

## Configuração do Banco de Dados

1. **Instalar o MySQL**:
   - Certifique-se de que o MySQL está instalado e em execução no seu sistema.

2. **Criar o Banco de Dados e Tabelas**:
   - Use o script SQL fornecido para criar o banco de dados e as tabelas necessárias.

   ```sql
   DROP DATABASE IF EXISTS desing_data;
   CREATE DATABASE desing_data;

   USE desing_data;

   DROP TABLE IF EXISTS `projetos`;

   CREATE TABLE `projetos` (
     `id` int NOT NULL AUTO_INCREMENT,
     `uuid` char(36) NOT NULL,
     `idUsuario` int NOT NULL,
     `data` json NOT NULL,
     `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
     `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     PRIMARY KEY (`id`),
     UNIQUE KEY `uuid` (`uuid`),
     KEY `idUsuario` (`idUsuario`),
     CONSTRAINT `projetos_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`)
   ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

   DROP TABLE IF EXISTS `usuario`;
   CREATE TABLE `usuario` (
     `idUsuario` int NOT NULL AUTO_INCREMENT,
     `user_name` varchar(150) NOT NULL,
     `email` varchar(150) NOT NULL,
     `senha` varchar(64) DEFAULT NULL,
     PRIMARY KEY (`idUsuario`),
     UNIQUE KEY `email` (`email`)
   ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


3. **Instale as depedencias**:
    - entre na pasta do projeto 
    - npm install

4. **inicialize o cervidor**
    - node index.js