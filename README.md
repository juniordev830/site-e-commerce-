# Minha Loja

Plataforma de e-commerce full-stack, construída em fases. Cada fase entrega algo que roda e pode ser testado.

**Status atual: Fase 1 concluída** (base do projeto, banco de dados e autenticação).

## Stack

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 19, Vite, TypeScript, React Router |
| API | Node.js, Express 5, TypeScript, Zod (validação) |
| Banco de dados | Prisma ORM + SQLite (desenvolvimento) |
| Autenticação | JWT em cookie `httpOnly`, senhas com bcrypt |

## Estrutura

```
.
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Modelos: User, Category, Product, Order, OrderItem
│   │   └── seed.ts            # Cria o primeiro administrador
│   └── src/
│       ├── config.ts          # Lê e valida as variáveis de ambiente
│       ├── app.ts             # Monta o Express (helmet, CORS, rotas, erros)
│       ├── server.ts          # Inicia o servidor
│       ├── lib/prisma.ts      # Cliente do banco
│       ├── middleware/        # auth.ts (sessão) e errors.ts (tratamento de erros)
│       └── routes/auth.ts     # Cadastro, login, logout e usuário atual
└── frontend/
    └── src/
        ├── auth/              # AuthContext: estado de login para o app todo
        ├── components/        # Layout, Field, AuthShell
        ├── lib/api.ts         # Cliente HTTP da API
        └── pages/             # Home, Login, Register, NotFound
```

## Arquivos do projeto

Cada arquivo abaixo tem link direto para o código no repositório.

### Raiz

| Arquivo | Função |
| --- | --- |
| [package.json](package.json) | Scripts do projeto e configuração dos workspaces (backend e frontend) |
| [package-lock.json](package-lock.json) | Versões exatas das dependências instaladas |
| [.gitignore](.gitignore) | Arquivos que não vão para o GitHub (`node_modules`, `.env`, bancos locais) |

### Backend

| Arquivo | Função |
| --- | --- |
| [backend/package.json](backend/package.json) | Dependências e scripts da API |
| [backend/tsconfig.json](backend/tsconfig.json) | Configuração do TypeScript e verificação de tipos |
| [backend/tsconfig.build.json](backend/tsconfig.build.json) | Configuração usada para compilar a API para a pasta `dist` |
| [backend/.env.example](backend/.env.example) | Modelo das variáveis de ambiente da API |
| [backend/prisma/schema.prisma](backend/prisma/schema.prisma) | Modelos do banco: User, Category, Product, Order e OrderItem |
| [backend/prisma/seed.ts](backend/prisma/seed.ts) | Cria o primeiro administrador |
| [backend/src/server.ts](backend/src/server.ts) | Inicia o servidor e encerra com segurança |
| [backend/src/app.ts](backend/src/app.ts) | Monta o Express: segurança, CORS, rotas e tratamento de erros |
| [backend/src/config.ts](backend/src/config.ts) | Lê e valida as variáveis de ambiente |
| [backend/src/lib/prisma.ts](backend/src/lib/prisma.ts) | Conexão com o banco de dados |
| [backend/src/middleware/auth.ts](backend/src/middleware/auth.ts) | Cria e verifica a sessão (token no cookie) |
| [backend/src/middleware/errors.ts](backend/src/middleware/errors.ts) | Respostas de erro padronizadas |
| [backend/src/routes/auth.ts](backend/src/routes/auth.ts) | Cadastro, login, logout e usuário atual |
| [backend/src/types/express.d.ts](backend/src/types/express.d.ts) | Adiciona `userId` ao tipo `Request` do Express |

### Frontend

| Arquivo | Função |
| --- | --- |
| [frontend/package.json](frontend/package.json) | Dependências e scripts do site |
| [frontend/tsconfig.json](frontend/tsconfig.json) | Configuração do TypeScript |
| [frontend/vite.config.ts](frontend/vite.config.ts) | Configuração do Vite, incluindo o encaminhamento de `/api` para a API |
| [frontend/index.html](frontend/index.html) | Página base do site (título e fontes) |
| [frontend/.env.example](frontend/.env.example) | Modelo das variáveis de ambiente do site |
| [frontend/src/main.tsx](frontend/src/main.tsx) | Ponto de entrada do React |
| [frontend/src/App.tsx](frontend/src/App.tsx) | Rotas do site |
| [frontend/src/styles.css](frontend/src/styles.css) | Estilos globais |
| [frontend/src/vite-env.d.ts](frontend/src/vite-env.d.ts) | Tipos das variáveis `VITE_*` |
| [frontend/src/lib/api.ts](frontend/src/lib/api.ts) | Cliente HTTP para falar com a API |
| [frontend/src/auth/AuthContext.tsx](frontend/src/auth/AuthContext.tsx) | Estado de login compartilhado por todo o site |
| [frontend/src/components/Layout.tsx](frontend/src/components/Layout.tsx) | Cabeçalho e estrutura comum das páginas |
| [frontend/src/components/AuthShell.tsx](frontend/src/components/AuthShell.tsx) | Moldura das páginas de login e cadastro |
| [frontend/src/components/Field.tsx](frontend/src/components/Field.tsx) | Campo de formulário com rótulo e mensagem de erro |
| [frontend/src/pages/Home.tsx](frontend/src/pages/Home.tsx) | Página inicial |
| [frontend/src/pages/Login.tsx](frontend/src/pages/Login.tsx) | Página de login |
| [frontend/src/pages/Register.tsx](frontend/src/pages/Register.tsx) | Página de cadastro |
| [frontend/src/pages/NotFound.tsx](frontend/src/pages/NotFound.tsx) | Página para endereços inexistentes |

## Requisitos

- Node.js 20.19 ou superior (22 recomendado)
- npm 10 ou superior

## Como rodar

```bash
# 1. Instalar dependências (frontend e backend de uma vez)
npm install

# 2. Criar o arquivo de configuração da API
cp backend/.env.example backend/.env
#    Edite backend/.env e troque JWT_SECRET por uma chave real:
#    node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

# 3. Criar o banco de dados (quando pedir um nome para a migração, digite: init)
npm run db:migrate

# 4. (Opcional) Criar o administrador definido em SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
npm run db:seed

# 5. Iniciar API e frontend juntos
npm run dev
```

- Site: http://localhost:5173
- API: http://localhost:3333/api/health

No GitHub Codespaces, abra a porta 5173 na aba **Portas**. O frontend encaminha `/api` para o backend, então o navegador só conversa com uma origem e o cookie de sessão funciona sem configuração extra.

Depois do primeiro `db:migrate`, faça commit da pasta `backend/prisma/migrations`: ela é o histórico versionado do banco.

## Variáveis de ambiente

### `backend/.env`

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `NODE_ENV` | `development`, `test` ou `production` | `development` |
| `PORT` | Porta da API | `3333` |
| `DATABASE_URL` | Caminho do banco. Em SQLite, caminhos relativos partem de `backend/prisma` | obrigatória |
| `JWT_SECRET` | Chave que assina os tokens (mínimo 16 caracteres; em produção não aceita o valor de exemplo) | obrigatória |
| `JWT_EXPIRES_SECONDS` | Duração da sessão | `604800` (7 dias) |
| `CORS_ORIGIN` | Origens permitidas, separadas por vírgula | `http://localhost:5173` |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | Usados só pelo `db:seed`. Use uma senha forte fora do desenvolvimento | opcionais |

### `frontend/.env` (opcional)

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `VITE_STORE_NAME` | Nome da loja exibido no topo | `Minha Loja` |
| `VITE_API_URL` | Só necessária se a API estiver em outro domínio | vazio |

## API (Fase 1)

| Método | Rota | Corpo | Respostas |
| --- | --- | --- | --- |
| GET | `/api/health` | | 200 `{ status }`, 503 se o banco estiver indisponível |
| POST | `/api/auth/register` | `name`, `email`, `password` | 201 `{ user }` e cookie de sessão, 400 dados inválidos, 409 e-mail já cadastrado |
| POST | `/api/auth/login` | `email`, `password` | 200 `{ user }` e cookie de sessão, 400, 401 credenciais incorretas |
| POST | `/api/auth/logout` | | 204 |
| GET | `/api/auth/me` | | 200 `{ user }`, 401 sem sessão válida |

Erros seguem o formato `{ "error": "mensagem" }`. Erros de validação trazem também `fields`, com a mensagem de cada campo.

## Decisões técnicas

- **Sessão em cookie `httpOnly`**: o JavaScript da página não consegue ler o token, o que reduz o estrago de uma falha de XSS. O cookie usa `SameSite=Lax` e `Secure` em produção.
- **Senhas com bcrypt (custo 12)**, limitadas a 72 caracteres, que é o limite real do algoritmo. No login, o tempo de resposta é o mesmo para e-mails existentes e inexistentes.
- **Limite de tentativas**: 20 requisições a cada 15 minutos por IP em cadastro e login.
- **Valores em centavos (`Int`)** no banco, para evitar erros de arredondamento com dinheiro.
- **Papéis e status como texto** (`CUSTOMER`/`ADMIN`; `PENDING`/`PAID`/`SHIPPED`/`DELIVERED`/`CANCELED`), validados no código, porque o SQLite não tem enums nativos.
- **Prisma com driver adapter** (`engineType = "client"`): o cliente fala direto com o SQLite, sem o binário de consulta do Prisma. Em `lib/prisma.ts`, o caminho do banco é resolvido a partir de `backend/prisma`, para que a CLI e a API usem o mesmo arquivo.

## Roadmap

- [x] **Fase 1: Base.** Estrutura, banco, cadastro, login e sessão.
- [ ] **Fase 2: Catálogo.** Produtos, categorias, busca e página de detalhes.
- [ ] **Fase 3: Compra.** Carrinho, checkout, pedidos e pagamento (Pix e cartão).
- [ ] **Fase 4: Administração.** Painel para produtos, estoque e pedidos.
- [ ] **Fase 5: Entrega.** Testes automatizados, Docker, PostgreSQL em produção, serviço em C#/.NET (cálculo de frete) e documentação final.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | API e frontend juntos, com recarga automática |
| `npm run build` | Compila backend e frontend |
| `npm run typecheck` | Verifica os tipos do TypeScript nos dois projetos |
| `npm run db:migrate` | Cria e aplica migrações no banco de desenvolvimento |
| `npm run db:seed` | Cria o administrador |
| `npm run db:studio` | Abre o Prisma Studio para ver os dados |

## Observações

- O `npm audit` aponta 3 vulnerabilidades de severidade alta, todas na mesma cadeia: `prisma` (CLI) → `@prisma/config` → `deepmerge-ts`. É uma dependência de desenvolvimento, usada só pela linha de comando do Prisma, e não entra no código que roda na API. A correção exige a atualização para o Prisma 7, que muda a configuração do projeto e fica para uma fase posterior.
