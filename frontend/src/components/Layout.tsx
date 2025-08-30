"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { EROUTES } from "@/constants/routes";
import {
  useUser,
  useIsAuthenticated,
  useIsAdmin,
  useIsEmployee,
  useLogout,
} from "@/store/auth-store";
import { LogOut, User, Shield } from "lucide-react";

export function Layout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const router = useRouter();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();
  const isEmployee = useIsEmployee();
  const logout = useLogout();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    router.push(EROUTES.LOGIN);
  };

  const renderAuthenticatedNav = () => (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        {isAdmin ? (
          <Shield className="w-4 h-4" />
        ) : (
          <User className="w-4 h-4" />
        )}
        <span>{user?.username}</span>
        <span className="text-xs bg-muted px-2 py-1 rounded-full">
          {user?.role}
        </span>
      </div>

      {/* Role-based navigation */}
      {isAdmin && (
        <Button variant="outline" onClick={() => handleNavigate(EROUTES.ADMIN)}>
          Admin Dashboard
        </Button>
      )}
      {isEmployee && (
        <Button
          variant="outline"
          onClick={() => handleNavigate(EROUTES.CHECKPOINT)}
        >
          Checkpoint
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="text-muted-foreground hover:text-foreground"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );

  const renderUnauthenticatedNav = () => (
    <div className="flex items-center space-x-4">
      <Button variant="default" onClick={() => handleNavigate(EROUTES.LOGIN)}>
        Sign In
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-foreground">
                Parking System
              </Link>
            </div>
            {isAuthenticated
              ? renderAuthenticatedNav()
              : renderUnauthenticatedNav()}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
