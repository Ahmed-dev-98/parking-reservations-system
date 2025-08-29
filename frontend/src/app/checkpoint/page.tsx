"use client";

import React from "react";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Car, Clock, MapPin } from "lucide-react";
import Gates from "@/components/gates/gates";
import Zones from "@/components/zones/zones";

const CheckpointPage = () => {
  return (
    <ProtectedRoute requiredRole="employee">
      <Layout title="Employee Checkpoint">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <User className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">Employee Checkpoint</h1>
              <p className="text-muted-foreground">Monitor and manage parking operations</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Occupancy</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156/200</div>
                <p className="text-xs text-muted-foreground">78% occupied</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Reservations</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">Next arrival in 15min</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Spots</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">44</div>
                <p className="text-xs text-muted-foreground">Across all zones</p>
              </CardContent>
            </Card>
          </div>

          {/* Gates Management */}
          <Card>
            <CardHeader>
              <CardTitle>Gate Management</CardTitle>
              <CardDescription>Monitor and control access gates</CardDescription>
            </CardHeader>
            <CardContent>
              <Gates />
            </CardContent>
          </Card>

          {/* Zones Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle>Zone Monitoring</CardTitle>
              <CardDescription>Real-time parking zone status and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <Zones />
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CheckpointPage;
