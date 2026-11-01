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

export function readCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CartItem =>
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
  } catch {
    return [];
  }
}

function persist(items: CartItem[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Cart stays usable for the current page even when storage is unavailable.
  }
  window.dispatchEvent(new Event(CART_EVENT));
}

export function addToCart(product: CartProduct): void {
  const items = readCart();
  const existing = items.find((item) => item.id === product.id);
  if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
  else items.push({ ...product, quantity: 1 });
  persist(items);
}

export function setCartQuantity(productId: string, quantity: number): CartItem[] {
  const items = readCart()
    .map((item) => item.id === productId ? { ...item, quantity: Math.max(1, Math.min(99, Math.trunc(quantity))) } : item);
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
