import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { api, ApiError } from "../lib/api";

type Product = { id: string; name: string; slug: string; description: string; priceCents: number; stock: number; imageUrl: string | null; category: { name: string; slug: string } | null };
type ProductResponse = { items: Product[]; pagination: { page: number; limit: number; total: number; pages: number } };
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function Home() {
  const { user, loading } = useAuth();
  const [catalog, setCatalog] = useState<ProductResponse | null>(null);
  const [catalogError, setCatalogError] = useState("");

  useEffect(() => {
    let active = true;
    api<ProductResponse>("/products?limit=12").then((data) => { if (active) setCatalog(data); }).catch((error: unknown) => {
      if (active) setCatalogError(error instanceof ApiError ? error.message : "Não foi possível carregar os produtos.");
    });
    return () => { active = false; };
  }, []);

  return (
    <section className="hero">
      <h1>Sua loja começa aqui.</h1>
      <p className="lead">Encontre os produtos disponíveis no catálogo da loja.</p>
      {loading && <div className="loading-state" role="status" aria-live="polite"><span className="loading-dot" aria-hidden="true" />Preparando sua experiência...</div>}
      {!loading && !user && <div className="actions"><Link to="/cadastro" className="btn btn-primary">Criar conta</Link><Link to="/entrar" className="btn btn-ghost">Já tenho conta</Link></div>}
      <div className="catalog-heading"><h2>Vitrine de produtos</h2>{catalog && <span>{catalog.pagination.total} produto(s)</span>}</div>
      {catalogError && <p className="error-message" role="alert">{catalogError}</p>}
      {!catalog && !catalogError && <p className="loading-state" role="status">Carregando catálogo...</p>}
      {catalog && catalog.items.length === 0 && <div className="empty"><h2>Catálogo em preparação</h2><p>Ainda não há produtos ativos. Um administrador pode cadastrá-los pela API.</p></div>}
      {catalog && catalog.items.length > 0 && <div className="product-grid">{catalog.items.map((product) => (
        <article className="product-card" key={product.id}>
          {product.imageUrl ? <img className="product-image" src={product.imageUrl} alt={product.name} loading="lazy" /> : <div className="product-image product-image-placeholder" aria-hidden="true">Sem imagem</div>}
          {product.category && <span className="product-category">{product.category.name}</span>}
          <h3>{product.name}</h3><p>{product.description}</p><strong className="product-price">{money.format(product.priceCents / 100)}</strong>
          <span className={product.stock > 0 ? "stock-available" : "stock-unavailable"}>{product.stock > 0 ? "Em estoque" : "Indisponível"}</span>
        </article>
      ))}</div>}
      <div className="hero-showcase" aria-label="Informações da loja"><article className="showcase-card"><span className="showcase-label">Compra segura</span><strong>Conta e sessão protegidas por autenticação.</strong></article><article className="showcase-card accent"><span className="showcase-label">Próxima etapa</span><strong>Carrinho, pedidos e checkout serão adicionados em etapas próprias.</strong></article></div>
    </section>
  );
}
