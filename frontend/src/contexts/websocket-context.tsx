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
        console.log("Global WebSocket received message:", message);

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
              if (!oldData) return oldData;
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

          console.log("Zone updated globally:", updatedZone);
        } else if (message.type === "admin-update") {
          const adminUpdate = message;
          console.log("Global admin update:", adminUpdate);

          if (adminUpdate.payload?.action === "category-rates-changed") {
            const { targetId, details } = adminUpdate.payload;

            if (
              details &&
              (details.rateNormal !== undefined ||
                details.rateSpecial !== undefined)
            ) {
              console.log("Processing global category rate change:", {
                targetId,
                details,
              });

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

              console.log(
                "Category rates updated globally for category:",
                targetId
              );
            }
          } else if (
            adminUpdate.payload?.action === "zone-opened" ||
            adminUpdate.payload?.action === "zone-closed"
          ) {
            const { targetId, action } = adminUpdate.payload;
            const isOpen = action === "zone-opened";

            console.log("Processing global zone status change:", {
              targetId,
              action,
              isOpen,
            });

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

            console.log("Zone status updated globally for zone:", targetId);
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
      console.log("Creating global WebSocket connection...");
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log("Global WebSocket connected");
        reconnectAttemptsRef.current = 0;
        setIsConnected(true);
      };

      ws.onmessage = handleMessage;

      ws.onclose = () => {
        console.log("Global WebSocket disconnected");
        setIsConnected(false);

        // Attempt to reconnect if not manually closed
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(
            `Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else {
          console.log("Max reconnection attempts reached");
        }
      };

      ws.onerror = (error) => {
        console.error("Global WebSocket error:", error);
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Failed to create global WebSocket connection:", error);
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
      console.log("Subscribed to gate:", gateId);
    }
  }, []);

  const unsubscribe = useCallback((gateId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: "unsubscribe",
        payload: { gateId },
      };
      wsRef.current.send(JSON.stringify(message));
      console.log("Unsubscribed from gate:", gateId);
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
