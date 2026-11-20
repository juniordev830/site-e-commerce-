import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { api, ApiError } from "../lib/api";
import { readCart, removeFromCart, removePurchasedItems, setCartQuantity, subscribeToCart, type CartItem } from "../lib/cart";

type CreatedOrder = { id: string; status: string; totalCents: number };
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function Cart() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => readCart());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<CreatedOrder | null>(null);
  const checkoutPending = useRef(false);

  useEffect(() => {
    return subscribeToCart(() => setItems(readCart()));
  }, []);

  const totalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

  async function placeOrder() {
    if (!user || checkoutPending.current) return;
    const purchased = readCart().map(({ id, quantity }) => ({ id, quantity }));
    if (purchased.length === 0) {
      setItems([]);
      return;
    }
    checkoutPending.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await api<{ order: CreatedOrder }>("/orders", {
        method: "POST",
        body: { items: purchased.map(({ id, quantity }) => ({ productId: id, quantity })) },
      });
      setOrder(result.order);
      setItems(removePurchasedItems(purchased));
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Não foi possível registrar o pedido.");
    } finally {
      checkoutPending.current = false;
      setBusy(false);
    }
  }

  return (
    <section className="cart-page">
      <h1>Seu carrinho</h1>
      <p className="lead">Confira os itens antes de enviar seu pedido.</p>
      {error && <p className="error-message" role="alert">{error}</p>}
      {order && <div className="order-confirmation" role="status"><h2>Pedido registrado</h2><p>Número: {order.id}</p><p>Status: {order.status}</p><p>Total confirmado pelo servidor: {money.format(order.totalCents / 100)}</p><p>O pedido está pendente; nenhum pagamento foi processado.</p></div>}
      {!order && items.length === 0 && <div className="empty"><h2>Carrinho vazio</h2><p>Adicione produtos da vitrine para continuar.</p><Link to="/" className="btn btn-primary">Ver produtos</Link></div>}
      {items.length > 0 && <>
        <div className="cart-items">
          {items.map((item) => <article className="cart-item" key={item.id}>
            {item.imageUrl ? <img src={item.imageUrl} alt="" loading="lazy" /> : <div className="cart-image-placeholder" aria-hidden="true">Sem imagem</div>}
            <div className="cart-item-info"><h2>{item.name}</h2><p>{money.format(item.priceCents / 100)} cada</p><strong>{money.format(item.priceCents * item.quantity / 100)}</strong></div>
            <div className="cart-controls"><button type="button" className="btn btn-ghost" aria-label={"Diminuir quantidade de " + item.name} disabled={busy || item.quantity <= 1} onClick={() => setItems(setCartQuantity(item.id, item.quantity - 1))}>−</button><span aria-label="Quantidade">{item.quantity}</span><button type="button" className="btn btn-ghost" aria-label={"Aumentar quantidade de " + item.name} disabled={busy || item.quantity >= 99} onClick={() => setItems(setCartQuantity(item.id, item.quantity + 1))}>+</button><button type="button" className="btn btn-ghost" disabled={busy} onClick={() => setItems(removeFromCart(item.id))}>Remover</button></div>
          </article>)}
        </div>
        <div className="cart-summary"><p><span>Subtotal estimado</span><strong>{money.format(totalCents / 100)}</strong></p><small>O preço e o estoque serão validados novamente pelo servidor ao registrar o pedido.</small>
          {!user ? <p><Link to="/entrar" className="btn btn-primary">Entre para finalizar o pedido</Link></p> : <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void placeOrder()}>{busy ? "Registrando pedido..." : "Registrar pedido"}</button>}
        </div>
      </>}
    </section>
  );
}
