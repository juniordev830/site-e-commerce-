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
