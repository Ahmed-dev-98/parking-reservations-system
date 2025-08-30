/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useIsEmployee,
  useIsAdmin,
  useIsAuthenticated,
  useAuthLoading,
  useLogin,
} from "@/store/auth-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Car, Shield, User, AlertCircle } from "lucide-react";
import { EROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/loading-page";

//TODO: add loading page
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEmployee = useIsEmployee();
  const isAdmin = useIsAdmin();
  const isAuthenticated = useIsAuthenticated();
  const authLoading = useAuthLoading();
  const login = useLogin();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await login(username, password);
      if (isEmployee) {
        router.push(EROUTES.CHECKPOINT);
      } else if (isAdmin) {
        router.push(EROUTES.ADMIN);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        router.push(EROUTES.ADMIN);
      } else if (isEmployee) {
        router.push(EROUTES.CHECKPOINT);
      }
    }
  }, [isAuthenticated, isAdmin, isEmployee, router]);
  if (authLoading) {
    return <LoadingPage text="Checking authentication..." />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-secondary p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <Card className="w-full shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-2 ">
            <CardTitle className="text-2xl font-bold text-center text-card-foreground">
              Parking System
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="space-y-3">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-foreground"
                >
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-11 bg-background/50 border-border/70 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-background/50 border-border/70 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                    disabled={loading}
                  />
                </div>
              </div>
              {error && (
                <Alert
                  variant="destructive"
                  className="border-destructive/50 bg-destructive/10"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200 mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <Button
                onClick={() => router.push("/")}
                type="button"
                className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200 mt-4"
                disabled={loading}
              >
                Continue as Visitor
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-4 p-4 bg-muted/50 border border-border/50 rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Demo Credentials
              </h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center justify-between p-2 bg-background/50 rounded border border-border/30">
                  <span className="font-medium">Admin:</span>
                  <code className="text-xs bg-secondary/50 px-2 py-1 rounded text-foreground">
                    admin / adminpass
                  </code>
                </div>
                <div className="flex items-center justify-between p-2 bg-background/50 rounded border border-border/30">
                  <span className="font-medium">Employee:</span>
                  <code className="text-xs bg-secondary/50 px-2 py-1 rounded text-foreground">
                    emp1 / pass1
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
