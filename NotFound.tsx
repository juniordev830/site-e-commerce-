import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="hero">
      <h1>Página não encontrada</h1>
      <p className="lead">O endereço digitado não existe ou foi movido.</p>
      <div className="actions">
        <Link to="/" className="btn btn-primary">
          Voltar para a vitrine
        </Link>
      </div>
    </section>
  );
}
