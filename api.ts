const BASE_URL = (import.meta.env.VITE_API_URL ?? "") + "/api";

export const STORE_NAME: string = import.meta.env.VITE_STORE_NAME || "Minha Loja";

export class ApiError extends Error {
  readonly status: number;
  readonly fields: Record<string, string[]>;

  constructor(status: number, message: string, fields: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

type RequestOptions = { method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; body?: unknown };

export async function api<T = void>(path: string, { method = "GET", body }: RequestOptions = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(BASE_URL + path, {
      method,
      credentials: "include",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor. Verifique sua conexão e tente de novo.");
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.error ?? "Algo deu errado. Tente novamente.",
      data?.fields ?? {},
    );
  }

  return data as T;
}
