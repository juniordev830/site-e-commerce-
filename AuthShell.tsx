import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="auth">
      <div className="auth-intro">
        <h1>{title}</h1>
        <p className="lead">{description}</p>
      </div>
      <div className="auth-card">{children}</div>
    </div>
  );
}
