/**
 * Optional API client — routes requests to the manual Express backend
 * if VITE_API_BASE_URL is set, otherwise the rest of the app continues
 * to use Supabase directly (the default in Lovable preview).
 *
 * Usage:
 *   import { api } from "@/lib/api-client";
 *   const { reports } = await api.get("/reports");
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "");

export const isManualBackendEnabled = Boolean(BASE_URL);

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  if (!BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not set. The manual backend is disabled.");
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${method} ${path} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
