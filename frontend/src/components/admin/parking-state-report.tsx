"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Car, Users, MapPin } from "lucide-react";
import { useParkingStateReport } from "@/services/queries";
import { Badge } from "../ui/badge";

interface ParkingStateReportProps {
  webSocketConnection?: WebSocket | null;
}

const ParkingStateReport = ({
  webSocketConnection,
}: ParkingStateReportProps) => {
  const { data: parkingStates, isLoading, isError } = useParkingStateReport();

  // Use the WebSocket connection status
  const isConnected = webSocketConnection?.readyState === WebSocket.OPEN;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="w-12 h-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error loading parking state
          </h3>
          <p className="text-gray-500 text-center">
            Unable to fetch parking state data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalSlots =
    parkingStates?.reduce((sum, zone) => sum + zone.totalSlots, 0) || 0;
  const totalOccupied =
    parkingStates?.reduce((sum, zone) => sum + zone.occupied, 0) || 0;
  const totalFree =
    parkingStates?.reduce((sum, zone) => sum + zone.free, 0) || 0;
  const totalReserved =
    parkingStates?.reduce((sum, zone) => sum + zone.reserved, 0) || 0;

  const occupancyRate =
    totalSlots > 0 ? ((totalOccupied / totalSlots) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-white">
              Parking State Report
            </h1>
            <p className="text-muted-foreground">Monitor the parking system</p>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSlots}</div>
            <p className="text-xs text-muted-foreground">Across all zones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Car className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalOccupied}
            </div>
            <p className="text-xs text-muted-foreground">Currently parked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Car className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalFree}</div>
            <p className="text-xs text-muted-foreground">Free spaces</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalReserved}
            </div>
            <p className="text-xs text-muted-foreground">For subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Occupancy Rate
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {occupancyRate}%
            </div>
            <p className="text-xs text-muted-foreground">Current utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Zone Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {parkingStates?.map((zone) => {
          const zoneOccupancyRate =
            zone.totalSlots > 0
              ? ((zone.occupied / zone.totalSlots) * 100).toFixed(1)
              : "0";

          return (
            <Card key={zone.zoneId} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>{zone.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={zone.open ? "default" : "destructive"}>
                      {zone.open ? "Open" : "Closed"}
                    </Badge>
                    <Badge variant="outline">
                      {zoneOccupancyRate}% occupied
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  Category: {zone.categoryId} • {zone.subscriberCount}{" "}
                  subscribers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Occupancy</span>
                    <span>
                      {zone.occupied}/{zone.totalSlots}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${zoneOccupancyRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Total Slots:
                      </span>
                      <span className="font-medium">{zone.totalSlots}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Occupied:</span>
                      <span className="font-medium text-red-600">
                        {zone.occupied}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Free:</span>
                      <span className="font-medium text-green-600">
                        {zone.free}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Reserved:</span>
                      <span className="font-medium text-blue-600">
                        {zone.reserved}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        For Visitors:
                      </span>
                      <span className="font-medium">
                        {zone.availableForVisitors}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        For Subscribers:
                      </span>
                      <span className="font-medium">
                        {zone.availableForSubscribers}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {parkingStates?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No parking data available
            </h3>
            <p className="text-gray-500 text-center">
              Parking state data will appear here once zones are configured and
              active.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParkingStateReport;
