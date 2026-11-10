import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(new URL("../package.json", import.meta.url));
const ts = require("typescript");
const source = readFileSync(new URL("../src/lib/cart.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function cartWithStorage(initial) {
  const storage = new Map([["ecommerce-cart-v1", JSON.stringify(initial)]]);
  const exports = {};
  const window = {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    dispatchEvent: () => {},
  };
  new Function("exports", "window", "Event", code)(
    exports, window, class Event { constructor(name) { this.type = name; } }
  );
  return exports;
}

const product = (id, quantity = 1) => ({
  id, name: "Produto " + id, slug: id, priceCents: 100, imageUrl: null, quantity,
});

test("recuperação remove IDs duplicados e IDs vazios sem alterar quantidade válida", () => {
  const cart = cartWithStorage([product("a", 2), product("a", 3), product(" "), product("b")]);
  assert.deepEqual(cart.readCart().map(({id, quantity}) => ({id, quantity})), [
    {id: "a", quantity: 2}, {id: "b", quantity: 1},
  ]);
});

test("quantidade não finita falha sem alterar itens do carrinho", () => {
  const cart = cartWithStorage([product("a", 2)]);
  assert.throws(() => cart.setCartQuantity("a", Number.NaN), RangeError);
  assert.throws(() => cart.setCartQuantity("a", Number.POSITIVE_INFINITY), RangeError);
  assert.equal(cart.readCart()[0].quantity, 2);
  assert.equal(cart.setCartQuantity("a", 99)[0].quantity, 99);
});
