import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, ApiError } from "../lib/api";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  createdAt: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao abrir o site, descobre se já existe uma sessão (cookie) válida
  useEffect(() => {
    api<{ user: User }>("/auth/me")
      .then((data) => setUser(data.user))
      .catch((err: unknown) => {
        if (!(err instanceof ApiError && err.status === 401)) console.error(err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api<{ user: User }>("/auth/login", { method: "POST", body: { email, password } });
    setUser(data.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await api<{ user: User }>("/auth/register", { method: "POST", body: { name, email, password } });
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return context;
}
