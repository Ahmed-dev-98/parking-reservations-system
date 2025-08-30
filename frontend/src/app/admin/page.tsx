"use client";

import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Users,
  Car,
  BarChart3,
  Settings,
  ClipboardList,
} from "lucide-react";
import EmployeesManagement from "@/components/admin/employees-management";
import ParkingStateReport from "@/components/admin/parking-state-report";
import ControlPanel from "@/components/admin/control-panel";
import AuditLog from "@/components/admin/audit-log";
import { useGates, useParkingStateReport } from "@/services/queries";
import { useWebSocketContext } from "@/contexts/websocket-context";

type AdminView = "dashboard" | "employees" | "parking-state" | "control-panel";

const AdminPage = () => {
  const [activeView, setActiveView] = useState<AdminView>("dashboard");

  // Data for dashboard stats
  const { data: gates } = useGates();
  const { data: parkingStates } = useParkingStateReport();

  // Use global WebSocket connection
  const { connection, isConnected } = useWebSocketContext();

  const totalSlots =
    parkingStates?.reduce((sum, zone) => sum + zone.totalSlots, 0) || 0;
  const totalOccupied =
    parkingStates?.reduce((sum, zone) => sum + zone.occupied, 0) || 0;
  const occupancyRate =
    totalSlots > 0 ? ((totalOccupied / totalSlots) * 100).toFixed(1) : "0";
  const activeGates = gates?.length || 0;

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
                  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                  <p className="text-muted-foreground">
                    Manage and monitor the parking system
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Gates
                  </CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeGates}</div>
                  <p className="text-xs text-muted-foreground">
                    All operational
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Occupancy Rate
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{occupancyRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Current utilization
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Slots
                  </CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSlots}</div>
                  <p className="text-xs text-muted-foreground">
                    Parking capacity
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions and Audit Log */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveView("parking-state")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      <span>Parking State Report</span>
                    </CardTitle>
                    <CardDescription>
                      Monitor real-time parking utilization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Real-time occupancy data</li>
                        <li>• Zone-by-zone breakdown</li>
                        <li>• Availability metrics</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveView("control-panel")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-purple-600" />
                      <span>Control Panel</span>
                    </CardTitle>
                    <CardDescription>
                      Configure system settings and rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Open/close zones</li>
                        <li>• Update pricing rates</li>
                        <li>• Manage rush hours</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <AuditLog webSocketConnection={connection} />
              </div>
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
          <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.key}
                  variant={activeView === item.key ? "default" : "ghost"}
                  onClick={() => setActiveView(item.key as AdminView)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminPage;
