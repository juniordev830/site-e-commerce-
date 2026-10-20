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
