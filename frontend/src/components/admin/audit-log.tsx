/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Activity } from "lucide-react";
import { AdminUpdateMessage } from "@/types/api";
import { useWebSocketConnected } from "@/store/websocket-store";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: any;
}

const AuditLog: React.FC = () => {
  // Initialize audit entries from localStorage
  const [auditEntries, setAuditEntries] = useState<AuditLogEntry[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("admin-audit-log");
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error("Error loading audit log from localStorage:", error);
        return [];
      }
    }
    return [];
  });
  const processedEventIdsRef = useRef<Map<string, number>>(new Map());
  const isConnected = useWebSocketConnected();

  // Stable event handler using useCallback
  const handleWebSocketMessage = useCallback((event: CustomEvent) => {
    try {
      const message = event.detail;

      if (message.type === "admin-update") {
        const adminUpdate: AdminUpdateMessage = message;

        // Create a unique event ID to prevent duplicates
        const eventId = `${adminUpdate.payload.adminId}-${adminUpdate.payload.action}-${adminUpdate.payload.targetId}`;

        // Check if we've already processed this event recently
        const now = Date.now();
        if (processedEventIdsRef.current.has(eventId)) {
          const lastProcessed = processedEventIdsRef.current.get(eventId)!;
          if (now - lastProcessed < 5000) {
            // Ignore duplicates within 5 seconds
            return;
          }
        }

        // Mark this event as processed with timestamp
        processedEventIdsRef.current.set(eventId, now);

        const newEntry: AuditLogEntry = {
          id: `${adminUpdate.payload.adminId}-${Date.now()}`,
          timestamp: adminUpdate.payload.timestamp || new Date().toISOString(),
          adminId: adminUpdate.payload.adminId,
          action: adminUpdate.payload.action,
          targetType: adminUpdate.payload.targetType || "zone",
          targetId: adminUpdate.payload.targetId,
          details: adminUpdate.payload.details,
        };

        setAuditEntries((prev) => {
          const updated = [newEntry, ...prev.slice(0, 9)]; // Keep last 10 entries
          // Persist to localStorage
          try {
            localStorage.setItem("admin-audit-log", JSON.stringify(updated));
          } catch (error) {
            console.error("Error saving audit log to localStorage:", error);
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  }, []);

  // Stable event handler wrapper
  const eventHandler = useCallback(
    (event: any) => {
      if (event.detail) {
        handleWebSocketMessage(event);
      }
    },
    [handleWebSocketMessage]
  );

  useEffect(() => {
    window.addEventListener("websocket-message", eventHandler);

    // Cleanup old processed event IDs periodically to prevent memory leaks
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const cleaned = new Map();
      processedEventIdsRef.current.forEach((timestamp, id) => {
        if (now - timestamp < 300000) {
          // Keep entries for 5 minutes
          cleaned.set(id, timestamp);
        }
      });
      processedEventIdsRef.current = cleaned;

      // Also cleanup old entries from localStorage (keep entries from last 24 hours)
      setAuditEntries((prev) => {
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        const filtered = prev.filter((entry) => {
          const entryTime = new Date(entry.timestamp).getTime();
          return entryTime > oneDayAgo;
        });

        if (filtered.length !== prev.length) {
          try {
            localStorage.setItem("admin-audit-log", JSON.stringify(filtered));
          } catch (error) {
            console.error("Error updating audit log in localStorage:", error);
          }
        }

        return filtered;
      });
    }, 60000); // Clean up every minute

    return () => {
      window.removeEventListener("websocket-message", eventHandler);
      clearInterval(cleanupInterval);
    };
  }, [eventHandler]); // Now depends on the stable eventHandler

  const formatAction = (action: string) => {
    return action
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getActionColor = (action: string) => {
    if (action.includes("opened") || action.includes("added")) return "default";
    if (action.includes("closed") || action.includes("deleted"))
      return "destructive";
    if (action.includes("changed") || action.includes("updated"))
      return "secondary";
    return "outline";
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <span>Live Audit Log</span>
          <div className="flex items-center space-x-2 ml-auto">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-gray-500">
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          Recent admin actions and system changes
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full flex justify-center items-center">
        <div className="space-y-3 w-full">
          {auditEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <p>No recent admin actions</p>
              <p className="text-sm">Activity will appear here as it happens</p>
            </div>
          ) : (
            auditEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 w-full border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getActionColor(entry.action)}>
                      {formatAction(entry.action)}
                    </Badge>
                    <span className="text-sm font-medium">
                      {entry.targetType}: {entry.targetId}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    By {entry.adminId} • {formatTimestamp(entry.timestamp)}
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>Live</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLog;
