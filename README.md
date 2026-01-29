# Desafio de Pós-Graduação – Financy

O **Financy** é uma aplicação full-stack para gerenciamento de finanças pessoais, desenvolvida com foco em uma arquitetura moderna e escalável utilizando GraphQL.


## 💻 Tecnologias

Este repositório contém:

- **Backend**
  - Linguagem: TypeScript
  - Framework: Express
  - API: GraphQL (Type-GraphQL + Apollo Server)
  - ORM: Prisma
  - Banco de dados: SQLite
  - Autenticação: JWT

- **Frontend**
  - Framework: React (gerado com Vite)
  - Client GraphQL: Apollo Client
  - Gerenciamento de estado: Zustand
  - Estilização: Tailwind CSS + Shadcn/ui

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- Node.js (v18 ou superior)
- Yarn


## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd desafio
   ```

2. **Configure as variáveis de ambiente**
   Copie os arquivos `.env.example` e renomeie para `.env` no frontend e backend.

   **Backend (`backend/.env`):**
   ```env
   JWT_SECRET=seu_secret_key_aqui
   DATABASE_URL="file:./dev.db"
   ```

   **Frontend (`frontend/.env`):**
   ```env
   VITE_BACKEND_URL=http://localhost:4000/graphql
   ```

3. **Instale as dependências do Backend**
   ```bash
   cd backend
   yarn install
   ```

4. **Execute as migrations do banco de dados**
   ```bash
   yarn migrate
   ```

5. **Execute o seed (opcional)**
   Popula o banco com dados de exemplo.
   ```bash
   yarn seed
   ```

6. **Instale as dependências do Frontend**
   ```bash
   cd ../frontend
   yarn install
   ```

7. **Execute o projeto**
   Você precisará de dois terminais:

   **Terminal 1 (Backend):**
   ```bash
   cd backend
   yarn dev
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   yarn dev
   ```

   O backend estará disponível em: `http://localhost:4000/graphql`
   O frontend estará disponível em: `http://localhost:5173`
