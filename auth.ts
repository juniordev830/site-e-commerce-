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
