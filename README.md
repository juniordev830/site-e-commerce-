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
- ### `package.json`

```json
{
  "name": "ecommerce",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "backend",
    "frontend"
  ],
  "engines": {
    "node": ">=20.19"
  },
  "scripts": {
    "dev": "concurrently -k -n api,web -c green,cyan \"npm run dev -w backend\" \"npm run dev -w frontend\"",
    "build": "npm run build -w backend && npm run build -w frontend",
    "typecheck": "npm run typecheck -w backend && npm run typecheck -w frontend",
    "db:migrate": "npm run db:migrate -w backend",
    "db:seed": "npm run db:seed -w backend",
    "db:studio": "npm run db:studio -w backend"
  },
  "devDependencies": {
    "concurrently": "^10.0.6"
  }
}
```

### `.gitignore`

```gitignore
node_modules/
dist/
build/
.env
.env.*
!.env.example
*.db
*.db-journal
*.log
.DS_Store
.vscode/*
!.vscode/extensions.json
```

### `backend/package.json`

```json
{
  "name": "ecommerce-backend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.build.json",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit",
    "postinstall": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/adapter-better-sqlite3": "^6.19.3",
    "@prisma/client": "^6.19.3",
    "bcryptjs": "^3.0.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^18.0.8",
    "express": "^5.3.0",
    "express-rate-limit": "^8.7.1",
    "helmet": "^8.3.0",
    "jsonwebtoken": "^9.0.3",
    "zod": "^4.6.7"
  },
  "devDependencies": {
    "@types/cookie-parser": "^1.4.10",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/node": "^22.20.5",
    "prisma": "^6.19.3",
    "tsx": "^4.23.15",
    "typescript": "^7.0.2"
  },
  "engines": {
    "node": ">=20.19"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### `backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node"],
    "noEmit": true
  },
  "include": ["src", "prisma/seed.ts"]
}
```

### `backend/tsconfig.build.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "rootDir": "src",
    "outDir": "dist",
    "sourceMap": true
  },
  "include": ["src"]
}
```

### `backend/.env.example`

```ini
# Copie para .env e ajuste os valores: cp .env.example .env
NODE_ENV=development
PORT=3333

# SQLite em desenvolvimento. Caminhos relativos partem da pasta backend/prisma.
DATABASE_URL="file:./dev.db"

# Gere uma chave real com: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRET="troque-por-uma-chave-longa-e-aleatoria"
JWT_EXPIRES_SECONDS=604800

# Origem(ns) permitidas no CORS, separadas por vírgula
CORS_ORIGIN="http://localhost:5173"

# Usado apenas por "npm run db:seed" para criar o primeiro administrador
SEED_ADMIN_EMAIL="admin@loja.local"
SEED_ADMIN_PASSWORD="troque-esta-senha"
```

### `backend/prisma/schema.prisma`

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Papéis: CUSTOMER | ADMIN
model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         String   @default("CUSTOMER")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  orders       Order[]
}

model Category {
  id       String    @id @default(cuid())
  name     String    @unique
  slug     String    @unique
  products Product[]
}

// Valores em centavos (Int) para evitar erros de arredondamento com dinheiro.
model Product {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String
  priceCents  Int
  stock       Int         @default(0)
  imageUrl    String?
  active      Boolean     @default(true)
  categoryId  String?
  category    Category?   @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  items       OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

// Status: PENDING | PAID | SHIPPED | DELIVERED | CANCELED
model Order {
  id         String      @id @default(cuid())
  userId     String
  user       User        @relation(fields: [userId], references: [id])
  status     String      @default("PENDING")
  totalCents Int
  items      OrderItem[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

model OrderItem {
  id             String  @id @default(cuid())
  orderId        String
  order          Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId      String
  product        Product @relation(fields: [productId], references: [id])
  quantity       Int
  unitPriceCents Int
}
```

### `backend/prisma/seed.ts`

```ts
import bcrypt from "bcryptjs";
import "../src/config.js";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD não definidos no .env. Nada a fazer.");
    return;
  }

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Administrador",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });

  console.log(`Administrador pronto: ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
```

### `backend/src/server.ts`

```ts
import { createApp } from "./app.js";
import { config } from "./config.js";
import { prisma } from "./lib/prisma.js";

const app = createApp();

const server = app.listen(config.PORT, () => {
  console.log(`API rodando em http://localhost:${config.PORT}`);
});

async function shutdown() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
```

### `backend/src/app.ts`

```ts
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { config } from "./config.js";
import { prisma } from "./lib/prisma.js";
import { errorHandler, notFound } from "./middleware/errors.js";
import { authRouter } from "./routes/auth.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: config.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  app.get("/api/health", async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: "ok" });
    } catch {
      res.status(503).json({ status: "error", error: "Banco de dados indisponível" });
    }
  });

  app.use("/api/auth", authRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
```

### `backend/src/config.ts`

```ts
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ quiet: true });

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3333),
    DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
    JWT_SECRET: z.string().min(16, "JWT_SECRET precisa ter ao menos 16 caracteres"),
    JWT_EXPIRES_SECONDS: z.coerce.number().int().positive().default(60 * 60 * 24 * 7),
    CORS_ORIGIN: z.string().default("http://localhost:5173"),
  })
  .refine((env) => env.NODE_ENV !== "production" || !env.JWT_SECRET.startsWith("troque"), {
    path: ["JWT_SECRET"],
    message: "Defina um JWT_SECRET real em produção",
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Variáveis de ambiente inválidas. Confira o arquivo backend/.env:");
  console.error(z.flattenError(parsed.error).fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
```

### `backend/src/lib/prisma.ts`

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { config } from "../config.js";

const prismaDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../prisma");

// A CLI do Prisma resolve "file:./dev.db" a partir da pasta do schema (backend/prisma),
// mas o adapter resolve a partir do diretório atual. Alinhamos os dois aqui.
function resolveSqliteUrl(url: string): string {
  if (!url.startsWith("file:")) return url;
  const filePath = url.slice("file:".length);
  return path.isAbsolute(filePath) ? url : `file:${path.resolve(prismaDir, filePath)}`;
}

const adapter = new PrismaBetterSQLite3({ url: resolveSqliteUrl(config.DATABASE_URL) });

export const prisma = new PrismaClient({ adapter });
```

### `backend/src/middleware/auth.ts`

```ts
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { HttpError } from "./errors.js";

export const COOKIE_NAME = "token";

export function signToken(userId: string): string {
  return jwt.sign({}, config.JWT_SECRET, {
    subject: userId,
    expiresIn: config.JWT_EXPIRES_SECONDS,
    algorithm: "HS256",
  });
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const token: unknown = req.cookies?.[COOKIE_NAME];
  if (typeof token !== "string") {
    throw new HttpError(401, "Faça login para continuar");
  }

  let userId: string | undefined;
  try {
    const payload = jwt.verify(token, config.JWT_SECRET, { algorithms: ["HS256"] });
    userId = typeof payload === "string" ? undefined : payload.sub;
  } catch {
    userId = undefined;
  }

  if (!userId) {
    throw new HttpError(401, "Sessão expirada. Faça login novamente");
  }

  req.userId = userId;
  next();
};
```

### `backend/src/middleware/errors.ts`

```ts
import type { ErrorRequestHandler, RequestHandler } from "express";
import { z } from "zod";

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({ error: "Dados inválidos", fields: z.flattenError(err).fieldErrors });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  // JSON malformado no corpo da requisição
  if (typeof err === "object" && err !== null && "type" in err && err.type === "entity.parse.failed") {
    res.status(400).json({ error: "JSON inválido" });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
};
```

### `backend/src/routes/auth.ts`

```ts
import bcrypt from "bcryptjs";
import { Router, type Response } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { config } from "../config.js";
import { prisma } from "../lib/prisma.js";
import { COOKIE_NAME, requireAuth, signToken } from "../middleware/auth.js";
import { HttpError } from "../middleware/errors.js";

const BCRYPT_COST = 12;
// Usado para gastar o mesmo tempo quando o e-mail não existe (evita revelar contas pela latência)
const DUMMY_HASH = bcrypt.hashSync("senha-ficticia", BCRYPT_COST);

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

const emailSchema = z.string().trim().toLowerCase().pipe(z.email("E-mail inválido"));

const registerSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(80, "O nome pode ter no máximo 80 caracteres"),
  email: emailSchema,
  // bcrypt só considera os primeiros 72 bytes da senha
  password: z
    .string()
    .min(8, "A senha precisa ter ao menos 8 caracteres")
    .max(72, "A senha pode ter no máximo 72 caracteres"),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe sua senha"),
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: () => config.NODE_ENV === "test",
  message: { error: "Muitas tentativas. Tente novamente em alguns minutos" },
});

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: config.NODE_ENV === "production",
  path: "/",
} as const;

function startSession(res: Response, userId: string) {
  res.cookie(COOKIE_NAME, signToken(userId), {
    ...cookieOptions,
    maxAge: config.JWT_EXPIRES_SECONDS * 1000,
  });
}

export const authRouter = Router();

authRouter.post("/register", authLimiter, async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    throw new HttpError(409, "Este e-mail já está cadastrado");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  try {
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: publicUserSelect,
    });
    startSession(res, user.id);
    res.status(201).json({ user });
  } catch (err) {
    // Dois cadastros simultâneos com o mesmo e-mail: a restrição unique do banco barra o segundo
    if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
      throw new HttpError(409, "Este e-mail já está cadastrado");
    }
    throw err;
  }
});

authRouter.post("/login", authLimiter, async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  const passwordMatches = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !passwordMatches) {
    throw new HttpError(401, "E-mail ou senha incorretos");
  }

  startSession(res, user.id);
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
  });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.status(204).end();
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! }, select: publicUserSelect });
  if (!user) {
    throw new HttpError(401, "Sessão expirada. Faça login novamente");
  }
  res.json({ user });
});
```

### `backend/src/types/express.d.ts`

```ts
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};
```

### `frontend/package.json`

```json
{
  "name": "ecommerce-frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.3.1",
    "react-dom": "^19.3.1",
    "react-router-dom": "^7.18.4"
  },
  "devDependencies": {
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.1.2",
    "typescript": "^7.0.2",
    "vite": "^8.3.4"
  }
}
```

### `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["src", "vite.config.ts"]
}
```

### `frontend/vite.config.ts`

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Em desenvolvimento, /api é encaminhado para a API: o navegador enxerga uma única origem
    proxy: { "/api": "http://localhost:3333" },
  },
});
```

### `frontend/index.html`

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Minha Loja</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Figtree:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `frontend/.env.example`

```ini
# Nome exibido no topo do site
VITE_STORE_NAME="Minha Loja"

# Só é necessário se a API estiver em outro domínio. Em desenvolvimento, deixe vazio:
# o Vite encaminha /api para o backend.
VITE_API_URL=
```

### `frontend/src/main.tsx`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
```

### `frontend/src/App.tsx`

```tsx
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="entrar" element={<Login />} />
        <Route path="cadastro" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
```

### `frontend/src/styles.css`

```css
:root {
  --paper: #f2f4f1;
  --surface: #ffffff;
  --ink: #1d2a26;
  --muted: #566660;
  --line: #d5dbd6;
  --brand: #0b6e4f;
  --brand-strong: #08523b;
  --danger: #b3261e;
  --danger-bg: #fbeceb;

  --font-display: "Bricolage Grotesque", "Segoe UI", system-ui, sans-serif;
  --font-body: "Figtree", "Segoe UI", system-ui, sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 1.0625rem;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

h1,
h2 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -0.02em;
}

h1 {
  font-size: clamp(2.25rem, 6.5vw, 4.25rem);
  line-height: 1.04;
}

h2 {
  font-size: 1.25rem;
  line-height: 1.25;
}

p {
  margin: 0;
}

a {
  color: var(--brand);
  text-underline-offset: 3px;
}

:focus-visible {
  outline: 3px solid var(--brand);
  outline-offset: 2px;
}

.container {
  width: min(100% - 2.5rem, 68rem);
  margin-inline: auto;
}

/* Cabeçalho */
.site-header {
  border-bottom: 1px solid var(--line);
  background: var(--surface);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4.25rem;
}

.wordmark {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
  text-decoration: none;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.nav-link {
  color: var(--ink);
  font-weight: 500;
}

.nav-user {
  color: var(--muted);
}

.main {
  padding-block: clamp(2.5rem, 8vw, 5.5rem);
}

/* Botões */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.15rem;
  border: 1.5px solid transparent;
  border-radius: 10px;
  font: inherit;
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none;
  cursor: pointer;
}

.btn-primary {
  background: var(--brand);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: var(--brand-strong);
}

.btn-ghost {
  background: transparent;
  border-color: var(--line);
  color: var(--ink);
}

.btn-ghost:hover:not(:disabled) {
  border-color: var(--ink);
}

.btn:disabled {
  opacity: 0.65;
  cursor: progress;
}

.btn-block {
  width: 100%;
  margin-top: 0.5rem;
}

/* Página inicial */
.hero {
  display: grid;
  gap: 1.25rem;
  justify-items: start;
  max-width: 44rem;
}

.lead {
  max-width: 38rem;
  color: var(--muted);
  font-size: 1.2rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.empty {
  width: 100%;
  margin-top: 2rem;
  padding: 2rem;
  border: 1.5px dashed var(--line);
  border-radius: 6px;
  color: var(--muted);
}

.empty h2 {
  margin-bottom: 0.35rem;
  color: var(--ink);
}

/* Login e cadastro */
.auth {
  display: grid;
  gap: 2.5rem;
  align-items: start;
}

.auth-intro {
  display: grid;
  gap: 1rem;
}

.auth-card {
  padding: 1.75rem;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
}

@media (min-width: 56rem) {
  .auth {
    grid-template-columns: 1fr minmax(20rem, 26rem);
    gap: 5rem;
  }
}

.field {
  display: grid;
  gap: 0.35rem;
  margin-bottom: 1.1rem;
}

.field label {
  font-weight: 600;
}

.field input {
  width: 100%;
  padding: 0.7rem 0.85rem;
  border: 1.5px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
  color: var(--ink);
  font: inherit;
}

.field input:hover {
  border-color: var(--muted);
}

.field input[aria-invalid="true"] {
  border-color: var(--danger);
}

.field-hint {
  color: var(--muted);
  font-size: 0.9rem;
}

.field-error {
  color: var(--danger);
  font-size: 0.9rem;
}

.form-error {
  margin-bottom: 1.1rem;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  background: var(--danger-bg);
  color: var(--danger);
}

.switch {
  margin-top: 1.25rem;
  color: var(--muted);
  font-size: 0.95rem;
  text-align: center;
}
```

### `frontend/src/vite-env.d.ts`

```ts
/// <reference types="vite/client" />
```

### `frontend/src/lib/api.ts`

```ts
const BASE_URL = (import.meta.env.VITE_API_URL ?? "") + "/api";

export const STORE_NAME: string = import.meta.env.VITE_STORE_NAME || "Minha Loja";

export class ApiError extends Error {
  readonly status: number;
  readonly fields: Record<string, string[]>;

  constructor(status: number, message: string, fields: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

type RequestOptions = { method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; body?: unknown };

export async function api<T = void>(path: string, { method = "GET", body }: RequestOptions = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(BASE_URL + path, {
      method,
      credentials: "include",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor. Verifique sua conexão e tente de novo.");
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.error ?? "Algo deu errado. Tente novamente.",
      data?.fields ?? {},
    );
  }

  return data as T;
}
```

### `frontend/src/auth/AuthContext.tsx`

```tsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, ApiError } from "../lib/api";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  createdAt: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao abrir o site, descobre se já existe uma sessão (cookie) válida
  useEffect(() => {
    api<{ user: User }>("/auth/me")
      .then((data) => setUser(data.user))
      .catch((err: unknown) => {
        if (!(err instanceof ApiError && err.status === 401)) console.error(err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api<{ user: User }>("/auth/login", { method: "POST", body: { email, password } });
    setUser(data.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await api<{ user: User }>("/auth/register", { method: "POST", body: { name, email, password } });
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return context;
}
```

### `frontend/src/components/Layout.tsx`

```tsx
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { STORE_NAME } from "../lib/api";

export function Layout() {
  const { user, loading, logout } = useAuth();

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="wordmark">
            {STORE_NAME}
          </Link>
          <nav className="nav" aria-label="Conta">
            {loading ? null : user ? (
              <>
                <span className="nav-user">Olá, {user.name.split(" ")[0]}</span>
                <button type="button" className="btn btn-ghost" onClick={() => void logout()}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/entrar" className="nav-link">
                  Entrar
                </Link>
                <Link to="/cadastro" className="btn btn-primary">
                  Criar conta
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container main">
        <Outlet />
      </main>
    </>
  );
}
```

### `frontend/src/components/AuthShell.tsx`

```tsx
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="auth">
      <div className="auth-intro">
        <h1>{title}</h1>
        <p className="lead">{description}</p>
      </div>
      <div className="auth-card">{children}</div>
    </div>
  );
}
```

### `frontend/src/components/Field.tsx`

```tsx
import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string;
};

export function Field({ id, label, error, hint, ...input }: FieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...input} />
      {hint && !error && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

### `frontend/src/pages/Home.tsx`

```tsx
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <section className="hero">
      <h1>Sua loja começa aqui.</h1>
      <p className="lead">
        A estrutura está pronta: cadastro, login e sessão segura. Os produtos entram na próxima etapa do projeto.
      </p>
      {!loading && !user && (
        <div className="actions">
          <Link to="/cadastro" className="btn btn-primary">
            Criar conta
          </Link>
          <Link to="/entrar" className="btn btn-ghost">
            Já tenho conta
          </Link>
        </div>
      )}
      <div className="empty">
        <h2>Nenhum produto na vitrine</h2>
        <p>Quando o catálogo for cadastrado, os produtos aparecem nesta página.</p>
      </div>
    </section>
  );
}
```

### `frontend/src/pages/Login.tsx`

```tsx
import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AuthShell } from "../components/AuthShell";
import { Field } from "../components/Field";
import { ApiError } from "../lib/api";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={from} replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        setFieldErrors(err.fields);
      } else {
        setFormError("Algo deu errado. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Entre na sua conta" description="Acompanhe seus pedidos e finalize compras mais rápido.">
      <form onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}
        <Field
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email?.[0]}
        />
        <Field
          id="password"
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password?.[0]}
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </button>
        <p className="switch">
          Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
        </p>
      </form>
    </AuthShell>
  );
}
```

### `frontend/src/pages/Register.tsx`

```tsx
import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AuthShell } from "../components/AuthShell";
import { Field } from "../components/Field";
import { ApiError } from "../lib/api";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});
    try {
      await register(name, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        // Erros de campo aparecem junto ao campo; os demais, no topo do formulário
        if (Object.keys(err.fields).length > 0) setFieldErrors(err.fields);
        else setFormError(err.message);
      } else {
        setFormError("Algo deu errado. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Crie sua conta" description="Leva menos de um minuto e deixa suas compras salvas.">
      <form onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}
        <Field
          id="name"
          label="Nome"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name?.[0]}
        />
        <Field
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email?.[0]}
        />
        <Field
          id="password"
          label="Senha"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="Mínimo de 8 caracteres"
          error={fieldErrors.password?.[0]}
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Criando conta..." : "Criar conta"}
        </button>
        <p className="switch">
          Já tem conta? <Link to="/entrar">Entrar</Link>
        </p>
      </form>
    </AuthShell>
  );
}
```

### `frontend/src/pages/NotFound.tsx`

```tsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="hero">
      <h1>Página não encontrada</h1>
      <p className="lead">O endereço digitado não existe ou foi movido.</p>
      <div className="actions">
        <Link to="/" className="btn btn-primary">
          Voltar para a vitrine
        </Link>
      </div>
    </section>
  );
}
```
