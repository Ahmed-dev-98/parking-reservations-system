/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Plus,
  Edit,
} from "lucide-react";
import {
  useCategories,
  useUpdateCategory,
  useCreateRushHour,
  useCreateVacation,
  useUpdateZoneOpen,
  useZones,
} from "@/services/queries";

import {
  CreateCategoryRequest,
  CreateRushHourRequest,
  CreateVacationRequest,
  Category,
} from "@/types/api";
import { toast } from "sonner";
import { CategoryForm, RushHourForm, VacationForm } from "./forms";
import { NotificationToast } from "@/components/ui/notification-toast";

interface ControlPanelProps {
  webSocketConnection?: WebSocket | null;
}

const ControlPanel = ({ webSocketConnection }: ControlPanelProps) => {
  const { data: categories } = useCategories();
  const { data: allZones } = useZones();
  const updateCategoryMutation = useUpdateCategory();
  const createRushHourMutation = useCreateRushHour();
  const createVacationMutation = useCreateVacation();
  const updateZoneOpenMutation = useUpdateZoneOpen();

  // Use the WebSocket connection status
  const isConnected = webSocketConnection?.readyState === WebSocket.OPEN;

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreatingRushHour, setIsCreatingRushHour] = useState<boolean>(false);
  const [createVacation, setCreateVacation] = useState<boolean>(false);

  // State for real-time notifications
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "info" | "warning" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const resetForms = () => {
    setEditingCategory(null);
    setIsCreatingRushHour(false);
    setCreateVacation(false);
  };

  const handleCategorySubmit = async (
    data: CreateCategoryRequest,
    categoryId?: string
  ) => {
    try {
      if (categoryId) {
        await updateCategoryMutation.mutateAsync({
          id: categoryId,
          request: data,
        });

        setNotification({
          show: true,
          message: `Category "${data.name}" updated successfully`,
          type: "success",
        });
      }
    } catch {
      setNotification({
        show: true,
        message: "Failed to update category",
        type: "error",
      });
    }
  };

  const handleRushHourSubmit = async (data: CreateRushHourRequest) => {
    try {
      await createRushHourMutation.mutateAsync(data);
      setNotification({
        show: true,
        message: "Rush hour schedule created successfully",
        type: "success",
      });
    } catch {
      setNotification({
        show: true,
        message: "Failed to create rush hour schedule",
        type: "error",
      });
    }
  };

  const handleVacationSubmit = async (data: CreateVacationRequest) => {
    try {
      await createVacationMutation.mutateAsync(data);
      setNotification({
        show: true,
        message: `Vacation period "${data.name}" created successfully`,
        type: "success",
      });
    } catch {
      setNotification({
        show: true,
        message: "Failed to create vacation period",
        type: "error",
      });
    }
  };

  const handleToggleZone = async (zoneId: string, currentState: boolean) => {
    try {
      await updateZoneOpenMutation.mutateAsync({
        id: zoneId,
        request: { open: !currentState },
      });

      const zoneName = allZones?.find((z) => z.id === zoneId)?.name || "Zone";
      const action = !currentState ? "opened" : "closed";

      toast.success(`Zone ${action} successfully`);

      // Show real-time notification
      setNotification({
        show: true,
        message: `${zoneName} has been ${action}`,
        type: "success",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update zone");
      setNotification({
        show: true,
        message: "Failed to update zone",
        type: "error",
      });
    }
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
  };
  if (!allZones) return <div>Loading...</div>;
  if (allZones.length === 0) return <div>No zones found</div>;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="w-6 h-6 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-white">Control Panel</h1>

            <p className="text-muted-foreground">
              Manage and monitor Zones, Categories, Rush Hours, and Vacation
            </p>
          </div>
        </div>

        {/* Real-time status indicator for admin */}
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

      {/* Zone Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Zone Management</span>
          </CardTitle>
          <CardDescription>
            Open or close parking zones organized by gates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Zones for this gate */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-4">
            {allZones.map((zone) => (
              <div
                key={zone.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{zone.name}</h4>
                  <p className="text-sm text-gray-500">
                    {zone.totalSlots} slots
                  </p>
                  <p className="text-xs text-gray-400">
                    Available: {zone.availableForVisitors || 0}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={zone.open ? "default" : "destructive"}>
                    {zone.open ? "Open" : "Closed"}
                  </Badge>
                  <Button
                    size="sm"
                    variant={zone.open ? "destructive" : "default"}
                    onClick={() => handleToggleZone(zone.id, zone.open)}
                    disabled={updateZoneOpenMutation.isPending}
                  >
                    {zone.open ? "Close" : "Open"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Show message if no zones are loaded */}
        </CardContent>
      </Card>

      {/* Category Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Category & Rate Management</span>
              </CardTitle>
              <CardDescription>
                Manage parking categories and their rates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editingCategory && (
            <CategoryForm
              editingCategory={editingCategory}
              onSubmit={handleCategorySubmit}
              onCancel={resetForms}
              isLoading={updateCategoryMutation.isPending}
            />
          )}

          <div className="space-y-2">
            {categories?.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{category.name}</h4>

                  <div className="flex space-x-4 text-sm">
                    <span>Normal: ${category.rateNormal}</span>
                    <span>Special: ${category.rateSpecial}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditCategory(category)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rush Hours Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Rush Hours</span>
              </CardTitle>
              <CardDescription>NO API FOR LISTING</CardDescription>
            </div>
            <Button onClick={() => setIsCreatingRushHour(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Rush Hour
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isCreatingRushHour && (
            <RushHourForm
              onSubmit={handleRushHourSubmit}
              onCancel={resetForms}
              isLoading={createRushHourMutation.isPending}
            />
          )}
        </CardContent>
      </Card>

      {/* Vacations Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Vacation Periods</span>
              </CardTitle>
              <CardDescription>NO API FOR LISTING</CardDescription>
            </div>
            <Button onClick={() => setCreateVacation(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vacation
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {createVacation && (
            <VacationForm
              onSubmit={handleVacationSubmit}
              onCancel={resetForms}
              isLoading={createVacationMutation.isPending}
            />
          )}
        </CardContent>
      </Card>

      {/* Real-time notification toast */}
      <NotificationToast
        message={notification.message}
        type={notification.type}
        isConnected={isConnected}
        show={notification.show}
        onHide={() => setNotification((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default ControlPanel;
