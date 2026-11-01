# Minha Loja — E-commerce Full Stack

Projeto de portfólio desenvolvido por etapas para praticar uma aplicação web com frontend React e API Node.js. A fase atual estabelece a base do projeto, configuração do banco e autenticação inicial; catálogo, carrinho, checkout e pagamentos devem ser considerados concluídos somente quando implementados e testados no código.

## Stack

| Camada | Tecnologias |
|---|---|
| Frontend | React, TypeScript, Vite, React Router |
| Backend | Node.js, Express, TypeScript, Zod |
| Persistência | Prisma ORM e SQLite para desenvolvimento |
| Autenticação | JWT em cookie `httpOnly`, hash de senha com bcrypt |
| Qualidade | TypeScript, scripts de build e typecheck |

## Requisitos

- Node.js **20.19 ou superior**
- npm

## Instalação

Na raiz do repositório:

```bash
npm ci
```

Configure as variáveis de ambiente a partir dos exemplos existentes em `backend/.env.example` e `frontend/.env.example`. Use valores locais e nunca publique arquivos `.env` reais.

## Desenvolvimento

```bash
npm run dev
```

O comando raiz inicia os workspaces de backend e frontend em paralelo. Consulte as mensagens de inicialização para confirmar as portas usadas localmente.

## Catálogo

A API pública oferece `GET /api/products` (paginação e filtros `search`/`category`) e `GET /api/products/:slug`. Administradores autenticados podem cadastrar produtos com `POST /api/products`; o corpo aceita `name`, `slug`, `description`, `priceCents`, `stock` e campos opcionais `imageUrl` (HTTPS) e `categoryId`. Valores monetários são informados em centavos. O catálogo mostra apenas produtos ativos.

## Verificações

```bash
npm run typecheck
npm run build
```

Para preparar ou atualizar o banco local, confira primeiro a configuração do backend e execute os comandos necessários:

```bash
npm run db:migrate
npm run db:seed
```

Use `npm run db:studio` para inspecionar o banco quando a configuração local estiver pronta.

## Estrutura

```text
.
├── backend/
│   ├── prisma/          # Schema e seed do banco
│   └── src/             # Configuração, middleware e rotas da API
├── frontend/
│   └── src/             # Aplicação React e cliente HTTP
├── package.json         # Workspaces e comandos compartilhados
└── package-lock.json
```

## Segurança

- Nunca versionar segredos, tokens, bancos locais com dados pessoais ou arquivos `.env`.
- Usar HTTPS e configuração segura de cookies em ambientes publicados.
- Validar autorização no backend, não apenas na interface.
- Usar dados fictícios durante desenvolvimento.
- Revisar autenticação, autorização, migrações e fluxo de erros antes de produção.

## Estado e próximas etapas

Este projeto está em desenvolvimento. As próximas etapas devem ser implementadas de forma incremental, com testes e documentação: completar as jornadas de produto, adicionar testes automatizados, documentar endpoints e definir uma estratégia de implantação.

## Autor

João Junior — [GitHub](https://github.com/juniordev830)
