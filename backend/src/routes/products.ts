import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/errors.js";
import { requireAuth } from "../middleware/auth.js";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(80).optional(),
});

const createProductSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(140),
  description: z.string().trim().min(1).max(5000),
  priceCents: z.number().int().min(1).max(100_000_000),
  stock: z.number().int().min(0).max(1_000_000).default(0),
  imageUrl: z.string().url().max(2048).refine((value) => new URL(value).protocol === "https:", "A imagem deve usar HTTPS").nullable().optional(),
  categoryId: z.string().min(1).nullable().optional(),
});

export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) throw new HttpError(400, "Filtros de catálogo inválidos");
  const { page, limit, search, category } = parsed.data;
  const where = {
    active: true,
    ...(search ? { OR: [{ name: { contains: search } }, { description: { contains: search } }] } : {}),
    ...(category ? { category: { is: { slug: category } } } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);
  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

productsRouter.get("/:slug", async (req, res) => {
  const parsed = z.string().trim().min(1).max(140).safeParse(req.params.slug);
  if (!parsed.success) throw new HttpError(400, "Slug de produto inválido");
  const product = await prisma.product.findFirst({
    where: { slug: parsed.data, active: true },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
  if (!product) throw new HttpError(404, "Produto não encontrado");
  res.json({ product });
});

productsRouter.post("/", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! }, select: { role: true } });
  if (!user || user.role !== "ADMIN") throw new HttpError(403, "Apenas administradores podem cadastrar produtos");
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Dados de produto inválidos");
  try {
    const product = await prisma.product.create({
      data: parsed.data,
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    res.status(201).json({ product });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      throw new HttpError(409, "Já existe um produto com este slug");
    }
    throw error;
  }
});
