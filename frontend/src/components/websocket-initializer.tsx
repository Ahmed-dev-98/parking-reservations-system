"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useWebSocketConnect,
  useWebSocketDisconnect,
} from "@/store/websocket-store";

export function WebSocketInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const connect = useWebSocketConnect();
  const disconnect = useWebSocketDisconnect();

  useEffect(() => {
    connect(queryClient);
    return () => {
      disconnect();
    };
  }, [connect, disconnect, queryClient]);

  return <>{children}</>;
}
