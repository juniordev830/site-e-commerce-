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

## Pedidos

Usuários autenticados podem criar pedidos com `POST /api/orders` enviando uma lista de `items` (`productId` e `quantity`). O servidor calcula o total usando os preços do banco, registra o preço unitário no item e decrementa o estoque dentro de uma transação com verificação condicional para evitar estoque negativo. `GET /api/orders` e `GET /api/orders/:id` retornam apenas pedidos do usuário autenticado. A listagem aceita `page` (padrão 1, máximo 100.000) e `limit` (padrão 20, máximo 50), ordena por data e ID e devolve `{ orders, pagination: { page, limit, total, pages } }`. Valores fora desses limites retornam HTTP 400. Os pedidos ficam com status `PENDING`; gateway de pagamento, entrega e fluxo completo de checkout ainda não estão implementados.

## Frontend: carrinho e pedidos

A página inicial permite adicionar produtos ao carrinho, que é guardado localmente no navegador. A rota `/carrinho` permite ajustar quantidades, remover itens e enviar um pedido autenticado para `POST /api/orders`. O servidor recalcula o total, valida o estoque e registra o pedido como `PENDING`. Não há gateway de pagamento, cobrança ou entrega real nesta versão.

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
- A API não confia em cabeçalhos encaminhados por proxy por padrão. Se estiver atrás de um reverse proxy conhecido, configure `TRUST_PROXY_HOPS` com o número exato de saltos confiáveis; não habilite confiança genérica em `X-Forwarded-For`.
- Com `TRUST_PROXY_HOPS=0`, a limitação de tentativas usa o endereço da conexão direta. Em hospedagem atrás de proxy, configure o número correto para que os limites por IP funcionem sem permitir que clientes falsifiquem o IP encaminhado.

## Estado e próximas etapas

Este projeto está em desenvolvimento. As próximas etapas devem ser implementadas de forma incremental, com testes e documentação: completar as jornadas de produto, adicionar testes automatizados, documentar endpoints e definir uma estratégia de implantação.

## Autor

João Junior — [GitHub](https://github.com/juniordev830)

## Validação e manutenção

Para revisar alterações neste projeto, consulte o [guia técnico de validação](docs/GUIA_DE_VALIDACAO.md), com comandos, cenários de regressão e próximos incrementos.
