"use client";

import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Shield, Users, BarChart3, Settings } from "lucide-react";
import EmployeesManagement from "@/components/admin/employees-management";
import ParkingStateReport from "@/components/admin/parking-state-report";
import ControlPanel from "@/components/admin/control-panel";
import AuditLog from "@/components/admin/audit-log";
import { useGates } from "@/services/queries";
import {
  useWebSocketConnection,
  useWebSocketConnected,
  useWebSocketSubscribe,
  useWebSocketUnsubscribe,
} from "@/store/websocket-store";

type AdminView = "dashboard" | "employees" | "parking-state" | "control-panel";

const AdminPage = () => {
  const [activeView, setActiveView] = useState<AdminView>("dashboard");

  // Data for dashboard stats
  const { data: gates } = useGates();

  // Use global WebSocket connection
  const connection = useWebSocketConnection();
  const isConnected = useWebSocketConnected();
  const subscribe = useWebSocketSubscribe();
  const unsubscribe = useWebSocketUnsubscribe();

  // Subscribe to all gates for comprehensive real-time updates
  React.useEffect(() => {
    if (gates && gates.length > 0) {
      // Subscribe to all gates to receive comprehensive real-time updates
      gates.forEach((gate) => {
        subscribe(gate.id);
      });

      return () => {
        gates.forEach((gate) => {
          unsubscribe(gate.id);
        });
      };
    }
  }, [gates, subscribe, unsubscribe]);

  const navigationItems = [
    { key: "dashboard", label: "Dashboard", icon: Shield },
    { key: "parking-state", label: "Parking State", icon: BarChart3 },
    { key: "control-panel", label: "Control Panel", icon: Settings },
    { key: "employees", label: "Employees", icon: Users },
  ];

  const renderContent = () => {
    switch (activeView) {
      case "employees":
        return <EmployeesManagement />;
      case "parking-state":
        return <ParkingStateReport webSocketConnection={connection} />;
      case "control-panel":
        return <ControlPanel webSocketConnection={connection} />;
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-purple-600" />
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Admin Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    Manage and monitor the parking system
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-muted/50 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-xs text-white">
                  Real-time: {isConnected ? "Active" : "Offline"}
                </span>
              </div>
            </div>

            {/* Quick Actions and Audit Log */}
            <div className="w-full h-full">
              <AuditLog />
            </div>
          </div>
        );
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout title="Admin Dashboard">
        <div className="space-y-6">
          {/* Navigation */}
          <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.key}
                  variant={activeView === item.key ? "outline" : "ghost"}
                  onClick={() => setActiveView(item.key as AdminView)}
                  className="flex items-center space-x-2 text-white"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Content */}
          {renderContent()}

          {/* Hidden audit log component that's always mounted to capture events */}
          {activeView !== "dashboard" && (
            <div className="hidden">
              <AuditLog />
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminPage;
