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
    // Trust only the explicitly configured number of reverse-proxy hops.
    TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(5).default(0),
  })
  .refine(
    (env) =>
      env.NODE_ENV !== "production" ||
      (env.JWT_SECRET.length >= 32 && !/^(troque|change[-_ ]?me|changeme|secret|your[-_ ]?jwt)/i.test(env.JWT_SECRET)),
    {
      path: ["JWT_SECRET"],
      message:
        "Em produção, JWT_SECRET deve ter pelo menos 32 caracteres e não pode ser um valor de exemplo.",
    },
  );

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Variáveis de ambiente inválidas. Confira o arquivo backend/.env:");
  console.error(z.flattenError(parsed.error).fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
