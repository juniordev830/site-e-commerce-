export type CartProduct = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl: string | null;
};

export type CartItem = CartProduct & { quantity: number };
const STORAGE_KEY = "ecommerce-cart-v1";
const CART_EVENT = "ecommerce-cart-updated";
let memoryCart: CartItem[] = [];

export function readCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return memoryCart;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return memoryCart;
    const items = parsed.filter((item): item is CartItem =>
      item !== null &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.name === "string" &&
      typeof item.slug === "string" &&
      typeof item.priceCents === "number" &&
      Number.isSafeInteger(item.priceCents) &&
      item.priceCents >= 0 &&
      Number.isInteger(item.quantity) &&
      item.quantity >= 1 &&
      item.quantity <= 99 &&
      (item.imageUrl === null || typeof item.imageUrl === "string")
    );
    memoryCart = items;
    return items;
  } catch {
    return memoryCart;
  }
}

function persist(items: CartItem[]): void {
  memoryCart = items;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // The in-memory copy keeps the cart usable for this page session.
  }
  window.dispatchEvent(new Event(CART_EVENT));
}

export function addToCart(product: CartProduct): void {
  const items = readCart();
  const cartProduct: CartProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    priceCents: product.priceCents,
    imageUrl: product.imageUrl,
  };
  const existing = items.find((item) => item.id === product.id);
  if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
  else items.push({ ...cartProduct, quantity: 1 });
  persist(items);
}

export function setCartQuantity(productId: string, quantity: number): CartItem[] {
  const items = readCart().map((item) => item.id === productId
    ? { ...item, quantity: Math.max(1, Math.min(99, Math.trunc(quantity))) }
    : item);
  persist(items);
  return items;
}

export function removeFromCart(productId: string): CartItem[] {
  const items = readCart().filter((item) => item.id !== productId);
  persist(items);
  return items;
}

export function clearCart(): void {
  persist([]);
}

export const cartUpdatedEvent = CART_EVENT;
