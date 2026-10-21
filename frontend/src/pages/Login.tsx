import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AuthShell } from "../components/AuthShell";
import { Field } from "../components/Field";
import { ApiError } from "../lib/api";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={from} replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        setFieldErrors(err.fields);
      } else {
        setFormError("Algo deu errado. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Entre na sua conta" description="Acompanhe seus pedidos e finalize compras mais rápido.">
      <form onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}
        <Field
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email?.[0]}
        />
        <Field
          id="password"
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password?.[0]}
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </button>
        <p className="switch">
          Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
        </p>
      </form>
    </AuthShell>
  );
}
