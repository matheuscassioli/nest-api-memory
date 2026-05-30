<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" />
</p>

# Nest API Memory

> Sistema de Autenticação e Cadastro de Usuários construído com NestJS, TypeORM e PostgreSQL.

Este projeto é uma API RESTful robusta desenvolvida para consolidar conceitos de arquitetura em camadas, validação de fronteira (DTOs), segurança com criptografia de senhas e geração de tokens de acesso.

---

## 🚀 Tecnologias e Ferramentas

* **NestJS** (Framework opinativo para Node.js)
* **TypeScript** (Tipagem estática)
* **TypeORM** (ORM/Mapeamento Objeto-Relacional)
* **PostgreSQL** (Banco de dados relacional rodando via Docker)
* **Class-Validator & Class-Transformer** (Validação e blindagem de DTOs)
* **Bcrypt** (Algoritmo de hash para criptografia de senhas)
* **JWT (JSON Web Token)** (Autenticação baseada em tokens stateless)
* **Axios (via HttpModule)** (Consumo de APIs externas)

---

## 📐 Arquitetura do Projeto

A aplicação segue rigorosamente a divisão de responsabilidades em camadas proposta pelo NestJS:

* **Controllers:** Portas de entrada da API. Capturam as requisições, definem status HTTP e delegam a execução para os Services.
* **DTOs (Data Transfer Objects):** Camada de fronteira encarregada de interceptar, validar e tipar os dados que chegam do cliente antes de entrar no sistema.
* **Services:** Centralizam as regras e a lógica de negócio (como checagem de e-mails duplicados, hashes de senhas e integração com serviços externos).
* **Entities:** Modelagem das tabelas do banco de dados relacional mapeadas via TypeORM.

```text
src/
├── app.module.ts
├── auth/
│   ├── dto/
│   │   └── login.dto.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/
│   ├── dto/
│   │   └── create-user.dto.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
└── integration/
    └── external-api.service.ts
