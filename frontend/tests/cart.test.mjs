import test from "node:test";
import assert from "node:assert/strict";
import { readCart, setCartQuantity } from "../src/lib/cart.ts";

function cartWithStorage(initial) {
  const storage = new Map([["ecommerce-cart-v1", JSON.stringify(initial)]]);
  globalThis.window = {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    dispatchEvent: () => {},
  };
  return { readCart, setCartQuantity };
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
