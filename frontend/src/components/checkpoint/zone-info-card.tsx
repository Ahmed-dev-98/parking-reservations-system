"use client";

import React from "react";
import { MapPin, Users, DollarSign, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ZoneState {
  name: string;
  occupied: number;
  totalSlots: number;
  free: number;
  reserved: number;
  open: boolean;
  rateNormal: number;
  rateSpecial: number;
}

interface ZoneInfoCardProps {
  zoneState: ZoneState;
  formatCurrency: (value: number) => string;
}

export const ZoneInfoCard: React.FC<ZoneInfoCardProps> = ({
  zoneState,
  formatCurrency,
}) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Zone Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Zone Name</p>
              <p className="font-semibold">{zoneState.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Users className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Capacity</p>
              <p className="font-semibold">
                {zoneState.occupied}/{zoneState.totalSlots} occupied
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <DollarSign className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Normal Rate</p>
              <p className="font-semibold">
                {formatCurrency(zoneState.rateNormal)}/hr
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <DollarSign className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Special Rate</p>
              <p className="font-semibold">
                {formatCurrency(zoneState.rateSpecial)}/hr
              </p>
            </div>
          </div>
        </div>

        {/* Zone Status and Availability */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Available
              </span>
            </div>
            <p className="text-lg font-bold text-green-700 dark:text-green-300">
              {zoneState.free}
            </p>
          </div>

          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Reserved
              </span>
            </div>
            <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
              {zoneState.reserved}
            </p>
          </div>

          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Status
              </span>
            </div>
            <p
              className={`text-lg font-bold ${
                zoneState.open
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {zoneState.open ? "Open" : "Closed"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
