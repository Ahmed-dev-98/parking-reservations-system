/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WebSocketProvider } from "@/contexts/websocket-context";
import { Toaster } from "@/components/ui/sonner";
import { AuthInitializer } from "@/components/auth-initializer";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              // Don't retry on 401/403 errors
              if (
                error?.response?.status === 401 ||
                error?.response?.status === 403 ||
                error?.response?.status === 404
              ) {
                return false;
              }
              return failureCount < 3;
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <WebSocketProvider>{children}</WebSocketProvider>
        <Toaster />
      </AuthInitializer>
    </QueryClientProvider>
  );
}
