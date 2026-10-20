import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AuthShell } from "../components/AuthShell";
import { Field } from "../components/Field";
import { ApiError } from "../lib/api";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});
    try {
      await register(name, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        // Erros de campo aparecem junto ao campo; os demais, no topo do formulário
        if (Object.keys(err.fields).length > 0) setFieldErrors(err.fields);
        else setFormError(err.message);
      } else {
        setFormError("Algo deu errado. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Crie sua conta" description="Leva menos de um minuto e deixa suas compras salvas.">
      <form onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}
        <Field
          id="name"
          label="Nome"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name?.[0]}
        />
        <Field
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email?.[0]}
        />
        <Field
          id="password"
          label="Senha"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="Mínimo de 8 caracteres"
          error={fieldErrors.password?.[0]}
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Criando conta..." : "Criar conta"}
        </button>
        <p className="switch">
          Já tem conta? <Link to="/entrar">Entrar</Link>
        </p>
      </form>
    </AuthShell>
  );
}
