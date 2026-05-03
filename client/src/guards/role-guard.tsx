import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthUser } from "./auth-guard";

type RoleGuardProps = {
  /** List of allowed roleIds that can access the wrapped route */
  allowedRoleIds: number[];
  children: ReactNode;
  /** Where to redirect when unauthorized. Defaults to "/" */
  redirectTo?: string;
};

/**
 * RoleGuard – protects routes that require specific roles.
 * Must be nested inside an AuthGuard so the user context is available.
 *
 * Usage:
 * ```tsx
 * <AuthGuard>
 *   <RoleGuard allowedRoleIds={[1]}>
 *     <EmployeePage />
 *   </RoleGuard>
 * </AuthGuard>
 * ```
 */
export function RoleGuard({
  allowedRoleIds,
  children,
  redirectTo = "/",
}: RoleGuardProps) {
  const user = useAuthUser();

  if (!allowedRoleIds.includes(user.roleId)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
