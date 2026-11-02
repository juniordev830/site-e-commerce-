import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/errors.js";
import { requireAuth } from "../middleware/auth.js";

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().trim().min(1).max(100),
    quantity: z.number().int().min(1).max(99),
  })).min(1).max(50),
}).superRefine((value, context) => {
  const ids = value.items.map((item) => item.productId);
  if (new Set(ids).size !== ids.length) {
    context.addIssue({ code: "custom", path: ["items"], message: "Não repita o mesmo produto; ajuste a quantidade." });
  }
});

const ordersListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(100_000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const ordersRouter = Router();
ordersRouter.use(requireAuth);

ordersRouter.get("/", async (req, res) => {
  const parsed = ordersListQuerySchema.safeParse(req.query);
  if (!parsed.success) throw new HttpError(400, "Paginação de pedidos inválida");
  const { page, limit } = parsed.data;
  const where = { userId: req.userId! };
  // Cap response size and keep every query scoped to the authenticated owner.
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: { include: { product: { select: { id: true, name: true, slug: true, imageUrl: true } } } } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);
  res.json({ orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

ordersRouter.get("/:id", async (req, res) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, userId: req.userId! },
    include: { items: { include: { product: { select: { id: true, name: true, slug: true, imageUrl: true } } } } },
  });
  if (!order) throw new HttpError(404, "Pedido não encontrado");
  res.json({ order });
});

ordersRouter.post("/", async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Itens do pedido inválidos");

  const order = await prisma.$transaction(async (tx) => {
    let totalCents = 0;
    const orderItems: { productId: string; quantity: number; unitPriceCents: number }[] = [];

    for (const item of parsed.data.items) {
      const product = await tx.product.findFirst({ where: { id: item.productId, active: true } });
      if (!product) throw new HttpError(404, "Um dos produtos não está disponível");
      if (product.stock < item.quantity) throw new HttpError(409, `Estoque insuficiente para ${product.name}`);

      // Atualização condicional evita vender estoque negativo em requisições concorrentes.
      const stockUpdate = await tx.product.updateMany({
        where: { id: product.id, active: true, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (stockUpdate.count !== 1) throw new HttpError(409, `Estoque insuficiente para ${product.name}`);

      // Prisma Int/SQLite INTEGER is a signed 32-bit value; reject totals that
      // cannot be persisted instead of allowing an overflow at order creation.
      const lineTotalCents = product.priceCents * item.quantity;
      const maxPersistableCents = 2_147_483_647;
      if (
        !Number.isSafeInteger(lineTotalCents) ||
        totalCents > maxPersistableCents - lineTotalCents
      ) {
        throw new HttpError(400, "Valor total do pedido excede o limite permitido");
      }

      totalCents += lineTotalCents;
      orderItems.push({ productId: product.id, quantity: item.quantity, unitPriceCents: product.priceCents });
    }

    return tx.order.create({
      data: { userId: req.userId!, status: "PENDING", totalCents, items: { create: orderItems } },
      include: { items: { include: { product: { select: { id: true, name: true, slug: true, imageUrl: true } } } } },
    });
  });

  res.status(201).json({ order });
});
