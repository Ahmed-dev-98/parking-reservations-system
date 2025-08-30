/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
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

interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: any;
}

interface AuditLogProps {
  webSocketConnection?: WebSocket | null;
}

const AuditLog: React.FC<AuditLogProps> = ({ webSocketConnection }) => {
  const [auditEntries, setAuditEntries] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    if (!webSocketConnection) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "admin-update") {
          const adminUpdate: AdminUpdateMessage = message;
          const newEntry: AuditLogEntry = {
            id: `${adminUpdate.payload.adminId}-${Date.now()}`,
            timestamp: adminUpdate.payload.timestamp,
            adminId: adminUpdate.payload.adminId,
            action: adminUpdate.payload.action,
            targetType: adminUpdate.payload.targetType,
            targetId: adminUpdate.payload.targetId,
            details: adminUpdate.payload.details,
          };

          setAuditEntries((prev) => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    webSocketConnection.addEventListener("message", handleMessage);
    return () => {
      webSocketConnection.removeEventListener("message", handleMessage);
    };
  }, [webSocketConnection]);

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
        </CardTitle>
        <CardDescription>
          Recent admin actions and system changes
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full flex justify-center items-center">
        <div className="space-y-3 ">
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
                className="flex items-center justify-between p-3 border rounded-lg"
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
