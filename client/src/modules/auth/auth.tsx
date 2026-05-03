import type { CreateAuthDto } from "@/modules/auth/dto/login";

export const login = async (payload: CreateAuthDto) => {
  const res = await fetch(`/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export const logout = async () => {
  const res = await fetch(`/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  console.log(res);

  return res.json();
}