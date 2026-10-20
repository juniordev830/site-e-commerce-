import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <section className="hero">
      <h1>Sua loja começa aqui.</h1>
      <p className="lead">
        A estrutura está pronta: cadastro, login e sessão segura. Os produtos entram na próxima etapa do projeto.
      </p>
      {!loading && !user && (
        <div className="actions">
          <Link to="/cadastro" className="btn btn-primary">
            Criar conta
          </Link>
          <Link to="/entrar" className="btn btn-ghost">
            Já tenho conta
          </Link>
        </div>
      )}
      <div className="empty">
        <h2>Nenhum produto na vitrine</h2>
        <p>Quando o catálogo for cadastrado, os produtos aparecem nesta página.</p>
      </div>
    </section>
  );
}
