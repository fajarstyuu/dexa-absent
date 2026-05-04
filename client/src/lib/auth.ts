import type { AuthResponse, AuthUser } from "@/types/auth";
export async function verifyAuth(): Promise<AuthUser | null> {
  try {
    const res = await fetch(`/api/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = (await res.json()) as AuthResponse;
    return data.data;
  } catch {
    return null;
  }
}
