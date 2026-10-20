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
