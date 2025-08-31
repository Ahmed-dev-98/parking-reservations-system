/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { QUERY_KEYS } from '@/constants/query-keys';
import { Zone } from '@/types/api';
import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/api/v1/ws';

interface WebSocketState {
    connection: WebSocket | null;
    isConnected: boolean;
    connectionError: string | null;
    recentEventIds?: string[]; // Track recent events to prevent duplicates
}

interface WebSocketActions {
    setConnection: (connection: WebSocket | null) => void;
    setIsConnected: (isConnected: boolean) => void;
    setConnectionError: (error: string | null) => void;
    connect: (queryClient: QueryClient) => void;
    disconnect: () => void;
    subscribe: (gateId: string) => void;
    unsubscribe: (gateId: string) => void;
    handleMessage: (event: MessageEvent, queryClient: QueryClient) => void;
}

type WebSocketStore = WebSocketState & WebSocketActions;

export const useWebSocketStore = create<WebSocketStore>()(
    devtools(
        (set, get) => {
            let wsRef: WebSocket | null = null;
            let reconnectTimeoutRef: NodeJS.Timeout | null = null;
            let reconnectAttemptsRef = 0;
            const maxReconnectAttempts = 5;
            const reconnectDelay = 3000;

            const handleMessage = (event: MessageEvent, queryClient: QueryClient) => {
                try {
                    const message = JSON.parse(event.data);

                    if (message.type === 'zone-update') {
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

                    } else if (message.type === 'admin-update') {
                        const adminUpdate = message;

                        // Dispatch custom event for audit log (only once per message)
                        const eventId = `${message.payload?.adminId}-${message.payload?.action}-${message.payload?.targetId}-${Date.now()}`;

                        // Check if we've already dispatched this event recently
                        if (!get().recentEventIds?.includes(eventId)) {
                            window.dispatchEvent(new CustomEvent('websocket-message', {
                                detail: message
                            }));

                            // Track recent event IDs to prevent duplicates
                            set((state) => ({
                                recentEventIds: [...(state.recentEventIds || []).slice(-10), eventId]
                            }));
                        }

                        if (adminUpdate.payload?.action === 'category-rates-changed') {
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
                            adminUpdate.payload?.action === 'zone-opened' ||
                            adminUpdate.payload?.action === 'zone-closed'
                        ) {
                            const { targetId, action } = adminUpdate.payload;
                            const isOpen = action === 'zone-opened';

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
                    console.error('Error parsing global WebSocket message:', error);
                }
            };

            const connect = (queryClient: QueryClient) => {
                if (wsRef?.readyState === WebSocket.OPEN) {
                    return;
                }

                try {
                    const ws = new WebSocket(WS_URL);

                    ws.onopen = () => {
                        console.log('WebSocket connected successfully');
                        const wasReconnecting = reconnectAttemptsRef > 0;
                        reconnectAttemptsRef = 0;
                        set({ isConnected: true, connectionError: null });

                        // Show success notification only after reconnection
                        if (wasReconnecting) {
                            toast.success('Connection restored');
                        }
                    };

                    ws.onmessage = (event) => {
                        try {
                            handleMessage(event, queryClient);
                        } catch (error) {
                            console.error('Error processing WebSocket message:', error);
                            set({ connectionError: 'Failed to process server message' });
                        }
                    };

                    ws.onclose = (event) => {
                        const reason = event.reason || 'Connection lost';
                        console.log(`WebSocket closed: ${reason} (Code: ${event.code})`);
                        set({ isConnected: false, connectionError: reason });

                        // Only show disconnection toast if it wasn't a normal closure
                        if (event.code !== 1000 && reconnectAttemptsRef === 0) {
                            toast.error('Connection lost. Attempting to reconnect...');
                        }

                        // Attempt to reconnect if not manually closed
                        if (reconnectAttemptsRef < maxReconnectAttempts) {
                            reconnectAttemptsRef++;
                            console.log(`Attempting to reconnect... (${reconnectAttemptsRef}/${maxReconnectAttempts})`);

                            reconnectTimeoutRef = setTimeout(() => {
                                connect(queryClient);
                            }, reconnectDelay);
                        } else {
                            toast.error('Failed to reconnect. Please refresh the page.');
                            set({ connectionError: 'Maximum reconnection attempts reached' });
                        }
                    };

                    ws.onerror = (error) => {
                        console.error('WebSocket error:', error);
                        const errorMessage = 'WebSocket connection error occurred';
                        set({ isConnected: false, connectionError: errorMessage });

                        // Only show error toast if this is the first error
                        if (reconnectAttemptsRef === 0) {
                            toast.error('Connection failed. Retrying...');
                        }
                    };

                    wsRef = ws;
                    set({ connection: ws });
                } catch (error) {
                    const errorMessage = `Failed to create WebSocket connection: ${error}`;
                    console.error(errorMessage);
                    set({ connectionError: errorMessage, isConnected: false });
                    toast.error('Failed to connect to server');
                }
            };

            const disconnect = () => {
                if (reconnectTimeoutRef) {
                    clearTimeout(reconnectTimeoutRef);
                    reconnectTimeoutRef = null;
                }

                if (wsRef) {
                    // Prevent reconnection by setting attempts to max
                    reconnectAttemptsRef = maxReconnectAttempts;
                    wsRef.close();
                    wsRef = null;
                    set({ connection: null, isConnected: false });
                }
            };

            const subscribe = (gateId: string) => {
                if (wsRef?.readyState === WebSocket.OPEN) {
                    try {
                        const message = {
                            type: 'subscribe',
                            payload: { gateId },
                        };
                        wsRef.send(JSON.stringify(message));
                        console.log(`Subscribed to gate: ${gateId}`);
                    } catch (error) {
                        console.error(`Failed to subscribe to gate ${gateId}:`, error);
                        set({ connectionError: 'Failed to subscribe to updates' });
                    }
                } else {
                    console.warn(`Cannot subscribe to gate ${gateId}: WebSocket not connected`);
                }
            };

            const unsubscribe = (gateId: string) => {
                if (wsRef?.readyState === WebSocket.OPEN) {
                    try {
                        const message = {
                            type: 'unsubscribe',
                            payload: { gateId },
                        };
                        wsRef.send(JSON.stringify(message));
                        console.log(`Unsubscribed from gate: ${gateId}`);
                    } catch (error) {
                        console.error(`Failed to unsubscribe from gate ${gateId}:`, error);
                        set({ connectionError: 'Failed to unsubscribe from updates' });
                    }
                } else {
                    console.warn(`Cannot unsubscribe from gate ${gateId}: WebSocket not connected`);
                }
            };

            return {
                // Initial state
                connection: null,
                isConnected: false,
                connectionError: null,
                recentEventIds: [],

                // Actions
                setConnection: (connection: WebSocket | null) => set({ connection }),
                setIsConnected: (isConnected: boolean) => set({ isConnected }),
                setConnectionError: (error: string | null) => set({ connectionError: error }),
                connect,
                disconnect,
                subscribe,
                unsubscribe,
                handleMessage,
            };
        },
        {
            name: 'websocket-store',
        }
    )
);

// Selector hooks for better performance
export const useWebSocketConnection = () => useWebSocketStore((state) => state.connection);
export const useWebSocketConnected = () => useWebSocketStore((state) => state.isConnected);
export const useWebSocketError = () => useWebSocketStore((state) => state.connectionError);

// Action hooks - separate to avoid infinite loops
export const useWebSocketConnect = () => useWebSocketStore((state) => state.connect);
export const useWebSocketDisconnect = () => useWebSocketStore((state) => state.disconnect);
export const useWebSocketSubscribe = () => useWebSocketStore((state) => state.subscribe);
export const useWebSocketUnsubscribe = () => useWebSocketStore((state) => state.unsubscribe);
