import bcrypt from "bcryptjs";
import "../src/config.js";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD não definidos no .env. Nada a fazer.");
    return;
  }

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Administrador",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });

  console.log(`Administrador pronto: ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
