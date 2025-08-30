"use client";

import { useAuth } from "@/contexts/auth-context";
import { LoadingPage } from "@/components/ui/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { EROUTES } from "@/constants/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "employee";
  fallbackRoute?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallbackRoute,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        console.log(
          "====================redirecting to login reason not authenticated ===================="
        );
        router.push(EROUTES.LOGIN);
        return;
      }

      // Check role-based access
      if (requiredRole && user?.role !== requiredRole) {
        const redirectRoute =
          fallbackRoute ||
          (user?.role === "admin" ? EROUTES.ADMIN : EROUTES.CHECKPOINT);
        router.push(redirectRoute);
        return;
      }
    }
  }, [loading, isAuthenticated, user, requiredRole, fallbackRoute, router]);

  // Show loading while checking authentication
  if (loading) {
    return <LoadingPage text="Checking authentication..." />;
  }

  // Don't render if not authenticated or wrong role
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return <LoadingPage text="Redirecting..." />;
  }

  return <>{children}</>;
}
