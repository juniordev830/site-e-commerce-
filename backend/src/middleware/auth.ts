import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "./errors.js";

export const COOKIE_NAME = "token";

const JWT_ISSUER = "site-e-commerce";
const JWT_AUDIENCE = "site-e-commerce-api";

export function signToken(userId: string, tokenVersion = 0): string {
  return jwt.sign({ ver: tokenVersion }, config.JWT_SECRET, {
    subject: userId,
    expiresIn: config.JWT_EXPIRES_SECONDS,
    algorithm: "HS256",
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
}

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const token: unknown = req.cookies?.[COOKIE_NAME];
  if (typeof token !== "string") {
    throw new HttpError(401, "Faça login para continuar");
  }

  let userId: string | undefined;
  let tokenVersion = 0;
  try {
    const payload = jwt.verify(token, config.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    if (typeof payload !== "string") {
      userId = payload.sub;
      const version = payload.ver ?? 0;
      if (!Number.isSafeInteger(version) || version < 0) userId = undefined;
      else tokenVersion = version;
    }
  } catch {
    userId = undefined;
  }

  if (!userId) {
    throw new HttpError(401, "Sessão expirada. Faça login novamente");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tokenVersion: true },
  });
  if (!user || user.tokenVersion !== tokenVersion) {
    throw new HttpError(401, "Sessão revogada. Faça login novamente");
  }

  req.userId = userId;
  next();
};
