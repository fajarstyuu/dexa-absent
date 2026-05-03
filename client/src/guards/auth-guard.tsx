import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { verifyAuth} from "@/lib/auth";


type AuthGuardProps = {
  children: ReactNode;
};
export function AuthGuard({ children }: AuthGuardProps) {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    verifyAuth().then((authUser) => {
      if (cancelled) return;
      if (authUser) {
        setUser(authUser);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

import { createContext, useContext } from "react";
import type { AuthUser } from "@/types/auth";

const AuthContext = createContext<AuthUser | null>(null);

export function useAuthUser(): AuthUser {
  const user = useContext(AuthContext);
  if (!user) {
    throw new Error("useAuthUser must be used within an AuthGuard");
  }
  return user;
}
