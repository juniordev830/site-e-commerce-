import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { STORE_NAME } from "../lib/api";

export function Layout() {
  const { user, loading, logout } = useAuth();

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="wordmark">
            {STORE_NAME}
          </Link>
          <nav className="nav" aria-label="Conta">
            {loading ? null : user ? (
              <>
                <span className="nav-user">Olá, {user.name.split(" ")[0]}</span>
                <button type="button" className="btn btn-ghost" onClick={() => void logout()}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/entrar" className="nav-link">
                  Entrar
                </Link>
                <Link to="/cadastro" className="btn btn-primary">
                  Criar conta
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>{STORE_NAME}</span>
          <span>Uma experiência de compra simples e segura.</span>
        </div>
      </footer>
    </>
  );
}
