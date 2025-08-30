/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useCallback } from 'react';
import { WSSubscribeMessage } from '@/types/api';



const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/api/v1/ws';

export interface WebSocketCallbacks {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Event) => void;
    onMessage?: (message: any) => void;
}
export const useWebSocket = (callbacks: WebSocketCallbacks = {}) => {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const callbacksRef = useRef(callbacks);
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000;

    // Update callbacks ref when they change
    useEffect(() => {
        callbacksRef.current = callbacks;
    }, [callbacks]);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            const ws = new WebSocket(WS_URL);

            ws.onopen = () => {
                console.log('WebSocket connected');
                reconnectAttemptsRef.current = 0;
                callbacksRef.current.onConnect?.();
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    callbacksRef.current.onMessage?.(message);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };


            ws.onclose = () => {
                console.log('WebSocket disconnected');
                callbacksRef.current.onDisconnect?.();

                // Attempt to reconnect if not manually closed
                if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current++;
                    console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, reconnectDelay);
                } else {
                    console.log('Max reconnection attempts reached');
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                callbacksRef.current.onError?.(error);
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
        }
    }, []);

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
        }
    }, []);

    const subscribe = useCallback((gateId: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const message: WSSubscribeMessage = {
                type: 'subscribe',
                payload: { gateId },
            };
            wsRef.current.send(JSON.stringify(message));
        }
    }, []);

    const unsubscribe = useCallback((gateId: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const message: WSSubscribeMessage = {
                type: 'unsubscribe',
                payload: { gateId },
            };
            wsRef.current.send(JSON.stringify(message));
        }
    }, []);

    const isConnected = wsRef.current?.readyState === WebSocket.OPEN;

    return {
        connect,
        disconnect,
        subscribe,
        unsubscribe,
        isConnected,
        connection: wsRef.current,
    };
};