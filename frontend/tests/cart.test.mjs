import test from "node:test";
import assert from "node:assert/strict";
import { addToCart, readCart, removePurchasedItems, setCartQuantity, subscribeToCart } from "../src/lib/cart.ts";

function cartWithStorage(initial) {
  const storage = new Map([["ecommerce-cart-v1", JSON.stringify(initial)]]);
  const state = { writable: true };
  const events = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => {
        if (!state.writable) throw new Error("Storage quota exceeded");
        storage.set(key, value);
      },
    },
    dispatchEvent: () => {},
    addEventListener: (name, listener) => events.set(name, listener),
    removeEventListener: (name) => events.delete(name),
  };
  return { addToCart, readCart, setCartQuantity, state, storage, events };
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

test("falha de gravação preserva o carrinho da sessão até a próxima gravação", () => {
  const cart = cartWithStorage([product("a", 2)]);
  cart.state.writable = false;
  cart.setCartQuantity("a", 3);
  const snapshot = cart.readCart();
  assert.equal(snapshot[0].quantity, 3);

  cart.addToCart(product("a"));
  assert.equal(snapshot[0].quantity, 3);
  assert.equal(cart.readCart()[0].quantity, 4);

  cart.state.writable = true;
  cart.addToCart(product("b"));
  assert.deepEqual(JSON.parse(cart.storage.get("ecommerce-cart-v1")), [product("a", 4), product("b")]);
});

test("confirmação do pedido preserva novos produtos e unidades adicionados durante a espera", () => {
  const cart = cartWithStorage([product("a", 2), product("b")]);
  const purchased = cart.readCart();
  cart.storage.set("ecommerce-cart-v1", JSON.stringify([product("a", 3), product("b"), product("c")]));
  assert.deepEqual(removePurchasedItems(purchased), [product("a"), product("c")]);
  assert.deepEqual(cart.readCart(), [product("a"), product("c")]);
  assert.deepEqual(purchased, [product("a", 2), product("b")]);
});

test("atualização entre abas ignora outras chaves e libera os ouvintes ao sair", () => {
  const cart = cartWithStorage([]);
  let updates = 0;
  const unsubscribe = subscribeToCart(() => updates++);
  cart.events.get("storage")({ key: "outra-chave" });
  cart.events.get("storage")({ key: "ecommerce-cart-v1" });
  cart.events.get("storage")({ key: null });
  cart.events.get("ecommerce-cart-updated")();
  unsubscribe();
  assert.equal(updates, 3);
  assert.equal(cart.events.size, 0);
});
