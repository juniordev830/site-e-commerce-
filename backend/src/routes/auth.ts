import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { Router, type RequestHandler, type Response } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { config } from "../config.js";
import { prisma } from "../lib/prisma.js";
import { COOKIE_NAME, requireAuth, signToken } from "../middleware/auth.js";
import { HttpError } from "../middleware/errors.js";

const BCRYPT_COST = 12;
const PASSWORD_HASH_PREFIX = "v2$";
const MAX_PASSWORD_BYTES = 1024;

function passwordMaterial(password: string): string {
  return "sha256:" + createHash("sha256").update(password, "utf8").digest("hex");
}

async function hashPassword(password: string): Promise<string> {
  return PASSWORD_HASH_PREFIX + await bcrypt.hash(passwordMaterial(password), BCRYPT_COST);
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (storedHash.startsWith(PASSWORD_HASH_PREFIX)) {
    return bcrypt.compare(passwordMaterial(password), storedHash.slice(PASSWORD_HASH_PREFIX.length));
  }
  // Legacy bcrypt hashes truncate after 72 bytes. Reject ambiguous long inputs.
  if (Buffer.byteLength(password, "utf8") > 72) return false;
  return bcrypt.compare(password, storedHash);
}

const DUMMY_HASH = PASSWORD_HASH_PREFIX + bcrypt.hashSync(passwordMaterial("senha-ficticia"), BCRYPT_COST);

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
  password: z.string().min(8, "A senha precisa ter ao menos 8 caracteres")
    .max(72, "A senha pode ter no máximo 72 caracteres")
    .refine((value) => Buffer.byteLength(value, "utf8") <= MAX_PASSWORD_BYTES, "A senha excede o limite seguro de bytes"),
});
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe sua senha")
    .max(72, "A senha pode ter no máximo 72 caracteres")
    .refine((value) => Buffer.byteLength(value, "utf8") <= MAX_PASSWORD_BYTES, "A senha excede o limite seguro de bytes"),
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

const sameOrigin: RequestHandler = (req, _res, next) => {
  const origin = req.get("origin");
  if (!origin) return next();
  const allowed = config.CORS_ORIGIN.split(",").map((value) => value.trim()).filter(Boolean);
  if (!allowed.includes(origin)) throw new HttpError(403, "Origem não autorizada");
  next();
};

function startSession(res: Response, userId: string, tokenVersion = 0) {
  res.cookie(COOKIE_NAME, signToken(userId, tokenVersion), { ...cookieOptions, maxAge: config.JWT_EXPIRES_SECONDS * 1000 });
}

export const authRouter = Router();

authRouter.post("/register", sameOrigin, authLimiter, async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body);
  const passwordHash = await hashPassword(password);
  try {
    const user = await prisma.user.create({ data: { name, email, passwordHash }, select: publicUserSelect });
    startSession(res, user.id);
    res.status(201).json({ user });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      throw new HttpError(409, "Este e-mail já está cadastrado");
    }
    throw error;
  }
});

authRouter.post("/login", sameOrigin, authLimiter, async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  const storedHash = user?.passwordHash ?? DUMMY_HASH;
  const passwordMatches = await verifyPassword(password, storedHash);
  if (!user || !passwordMatches) throw new HttpError(401, "E-mail ou senha incorretos");
  if (!user.passwordHash.startsWith(PASSWORD_HASH_PREFIX)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(password) },
    });
  }
  startSession(res, user.id, user.tokenVersion);
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt } });
});

authRouter.post("/logout", sameOrigin, requireAuth, async (req, res) => {
  await prisma.user.update({
    where: { id: req.userId! },
    data: { tokenVersion: { increment: 1 } },
  });
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.status(204).end();
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! }, select: publicUserSelect });
  if (!user) throw new HttpError(401, "Sessão expirada. Faça login novamente");
  res.json({ user });
});
