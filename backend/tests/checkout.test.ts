import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { randomBytes } from "node:crypto";
import { once } from "node:events";

test("checkout enforces sessions, ownership, stock and monetary bounds", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "checkout-"));
  const db = path.join(dir, "test.db");
  process.env.DATABASE_URL = "file:" + db;
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = randomBytes(32).toString("hex");
  const migration = readFileSync(new URL("../prisma/migrations/0001_init/migration.sql", import.meta.url), "utf8");
  const setup = new DatabaseSync(db);
  setup.exec(migration);
  setup.close();
  const {createApp} = await import("../src/app.js");
  const {prisma} = await import("../src/lib/prisma.js");
  const server = createApp().listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert(address && typeof address !== "string");
  const base = "http://127.0.0.1:" + address.port + "/api";
  const request = (route: string, body?: unknown, cookie = "") => fetch(base + route, {
    method: body === undefined ? "GET" : "POST",
    headers: {"Content-Type": "application/json", Cookie: cookie},
    ...(body === undefined ? {} : {body: JSON.stringify(body)})
  });
  try {
    assert.equal((await request("/orders")).status, 401);
    const signup = await request("/auth/register", {name: "Alice", email: "alice@example.com", password: "safe-password-123"});
    assert.equal(signup.status, 201);
    const cookie = signup.headers.get("set-cookie")!.split(";")[0];
    assert.equal((await request("/auth/me", undefined, cookie)).status, 200);
    const other = await request("/auth/register", {name: "Bob", email: "bob@example.com", password: "safe-password-123"});
    const otherCookie = other.headers.get("set-cookie")!.split(";")[0];
    const product = await prisma.product.create({data: {name: "Produto", slug: "produto", description: "Teste", stock: 2, priceCents: 1000}});
    const payload = {items: [{productId: product.id, quantity: 1}]};
    const checkout = await request("/orders", payload, cookie);
    assert.equal(checkout.status, 201);
    const {order} = await checkout.json();
    assert.equal(order.totalCents, 1000);
    assert.equal((await prisma.product.findUniqueOrThrow({where: {id: product.id}})).stock, 1);
    assert.equal((await request("/orders/" + order.id, undefined, otherCookie)).status, 404);
    assert.equal((await request("/orders", {items: [{productId: product.id, quantity: 2}]}, cookie)).status, 409);
    await prisma.product.update({where: {id: product.id}, data: {priceCents: 100000000, stock: 99}});
    assert.equal((await request("/orders", {items: [{productId: product.id, quantity: 99}]}, cookie)).status, 400);
    assert.equal((await prisma.product.findUniqueOrThrow({where: {id: product.id}})).stock, 99);
    assert.equal((await prisma.order.count()).valueOf(), 1);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
    await prisma.$disconnect();
    rmSync(dir, {recursive: true, force: true});
  }
});
