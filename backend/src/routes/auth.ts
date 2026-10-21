import bcrypt from "bcryptjs";
import { Router, type RequestHandler, type Response } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { config } from "../config.js";
import { prisma } from "../lib/prisma.js";
import { COOKIE_NAME, requireAuth, signToken } from "../middleware/auth.js";
import { HttpError } from "../middleware/errors.js";

const BCRYPT_COST = 12;
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
  password: z.string().min(8, "A senha precisa ter ao menos 8 caracteres").max(72, "A senha pode ter no máximo 72 caracteres"),
});
const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, "Informe sua senha") });

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

function startSession(res: Response, userId: string) {
  res.cookie(COOKIE_NAME, signToken(userId), { ...cookieOptions, maxAge: config.JWT_EXPIRES_SECONDS * 1000 });
}

export const authRouter = Router();

authRouter.post("/register", sameOrigin, authLimiter, async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body);
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
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
  const passwordMatches = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !passwordMatches) throw new HttpError(401, "E-mail ou senha incorretos");
  startSession(res, user.id);
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt } });
});

authRouter.post("/logout", sameOrigin, (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.status(204).end();
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! }, select: publicUserSelect });
  if (!user) throw new HttpError(401, "Sessão expirada. Faça login novamente");
  res.json({ user });
});
