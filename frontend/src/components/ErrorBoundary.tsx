import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erro não tratado na interface", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="container main">
          <section className="hero" role="alert">
            <h1>Algo deu errado.</h1>
            <p className="lead">Recarregue a página para tentar novamente.</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Recarregar
            </button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
