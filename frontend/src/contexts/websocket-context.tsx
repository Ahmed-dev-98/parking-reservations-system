/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { Zone } from "@/types/api";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000/api/v1/ws";

interface WebSocketContextType {
  connection: WebSocket | null;
  isConnected: boolean;
  subscribe: (gateId: string) => void;
  unsubscribe: (gateId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const queryClient = useQueryClient();
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;
  const [isConnected, setIsConnected] = React.useState(false);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "zone-update") {
          const zoneUpdate = message;
          const updatedZone = zoneUpdate.payload;

          // Update all zone queries (both base and gate-specific)
          const queryCache = queryClient.getQueryCache();
          const zoneQueries = queryCache.findAll({
            queryKey: QUERY_KEYS.zones,
            exact: false,
          });

          zoneQueries.forEach((query) => {
            if (query.state.data) {
              queryClient.setQueryData(query.queryKey, (oldData: Zone[]) => {
                if (!oldData) return oldData;
                return oldData.map((zone) =>
                  zone.id === updatedZone.id ? updatedZone : zone
                );
              });
            }
          });

          // Also update parking state report cache
          queryClient.setQueryData(
            QUERY_KEYS.adminParkingState,
            (oldData: any[]) => {
              if (!oldData) {
                queryClient.invalidateQueries({
                  queryKey: QUERY_KEYS.adminParkingState,
                });
                return oldData;
              }
              return oldData.map((zone) =>
                zone.id === updatedZone.id
                  ? {
                      ...zone,
                      ...updatedZone,
                    }
                  : zone
              );
            }
          );

          // Also invalidate to ensure fresh data on next access
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.adminParkingState,
          });
        } else if (message.type === "admin-update") {
          const adminUpdate = message;

          if (adminUpdate.payload?.action === "category-rates-changed") {
            const { targetId, details } = adminUpdate.payload;

            if (
              details &&
              (details.rateNormal !== undefined ||
                details.rateSpecial !== undefined)
            ) {
              // Update all zone queries that belong to this category
              const queryCache = queryClient.getQueryCache();
              const zoneQueries = queryCache.findAll({
                queryKey: QUERY_KEYS.zones,
                exact: false,
              });

              zoneQueries.forEach((query) => {
                if (query.state.data) {
                  queryClient.setQueryData(
                    query.queryKey,
                    (oldData: Zone[]) => {
                      if (!oldData) return oldData;
                      return oldData.map((zone) =>
                        zone.categoryId === targetId
                          ? {
                              ...zone,
                              rateNormal: details.rateNormal ?? zone.rateNormal,
                              rateSpecial:
                                details.rateSpecial ?? zone.rateSpecial,
                            }
                          : zone
                      );
                    }
                  );
                }
              });

              // Also update parking state report cache
              queryClient.setQueryData(
                QUERY_KEYS.adminParkingState,
                (oldData: any[]) => {
                  if (!oldData) return oldData;
                  return oldData.map((zone: any) =>
                    zone.categoryId === targetId
                      ? {
                          ...zone,
                          rateNormal: details.rateNormal ?? zone.rateNormal,
                          rateSpecial: details.rateSpecial ?? zone.rateSpecial,
                        }
                      : zone
                  );
                }
              );
            }
          } else if (
            adminUpdate.payload?.action === "zone-opened" ||
            adminUpdate.payload?.action === "zone-closed"
          ) {
            const { targetId, action } = adminUpdate.payload;
            const isOpen = action === "zone-opened";

            // Update all zone queries
            const queryCache = queryClient.getQueryCache();
            const zoneQueries = queryCache.findAll({
              queryKey: QUERY_KEYS.zones,
              exact: false,
            });

            zoneQueries.forEach((query) => {
              if (query.state.data) {
                queryClient.setQueryData(query.queryKey, (oldData: Zone[]) => {
                  if (!oldData) return oldData;
                  return oldData.map((zone) =>
                    zone.id === targetId ? { ...zone, open: isOpen } : zone
                  );
                });
              }
            });

            // Also update parking state report cache
            queryClient.setQueryData(
              QUERY_KEYS.adminParkingState,
              (oldData: any[]) => {
                if (!oldData) return oldData;
                return oldData.map((zone: any) =>
                  zone.id === targetId ? { ...zone, open: isOpen } : zone
                );
              }
            );
          }
        }
      } catch (error) {
        console.error("Error parsing global WebSocket message:", error);
      }
    },
    [queryClient]
  );

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        reconnectAttemptsRef.current = 0;
        setIsConnected(true);
      };

      ws.onmessage = handleMessage;

      ws.onclose = () => {
        setIsConnected(false);

        // Attempt to reconnect if not manually closed
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        }
      };

      ws.onerror = () => {
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch {
      // Silent error handling
    }
  }, [handleMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      // Prevent reconnection by setting attempts to max
      reconnectAttemptsRef.current = maxReconnectAttempts;
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const subscribe = useCallback((gateId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: "subscribe",
        payload: { gateId },
      };
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const unsubscribe = useCallback((gateId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: "unsubscribe",
        payload: { gateId },
      };
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  // Connect when component mounts
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const contextValue: WebSocketContextType = {
    connection: wsRef.current,
    isConnected,
    subscribe,
    unsubscribe,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
