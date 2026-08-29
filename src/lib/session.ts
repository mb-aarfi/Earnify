const SESSION_KEY = "earnify_session";

export interface MockSession {
  userId: string;
  role: "customer" | "provider";
  name?: string;
  phone?: string;
  locationAccess?: boolean;
}

export function getSession(): MockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MockSession;
  } catch {
    return null;
  }
}

export function setSession(session: MockSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function getDefaultUserId(role: "customer" | "provider"): string {
  return role === "customer" ? "user_customer_1" : "user_provider_1";
}
