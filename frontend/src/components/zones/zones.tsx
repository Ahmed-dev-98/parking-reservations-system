"use client";
import { useZones } from "@/services/queries";
import { useWebSocketContext } from "@/contexts/websocket-context";
import React from "react";
import { ZoneCard } from "./zone-card";
import { Zone } from "@/types/api";
import { useParams } from "next/navigation";

const Zones = () => {
  const { gateId } = useParams();
  const { data: zones, isLoading, error } = useZones(gateId as string);
  const { isConnected, subscribe, unsubscribe } = useWebSocketContext();

  // Subscribe to this gate's updates when component mounts
  React.useEffect(() => {
    if (gateId) {
      subscribe(gateId as string);
      console.log("Visitor subscribed to gate:", gateId);

      return () => {
        unsubscribe(gateId as string);
        console.log("Visitor unsubscribed from gate:", gateId);
      };
    }
  }, [gateId, subscribe, unsubscribe]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!zones) return <div>No zones found</div>;
  // Show message if no zones found for this gate
  if (zones.length === 0 && !isLoading) {
    return (
      <div className="space-y-4">
        {/* Real-time status indicator */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-blue-800">
              Real-time updates: {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <span className="text-xs text-blue-600">
            Live zone status and availability
          </span>
        </div>

        <div className="text-center py-8">
          <p className="text-gray-500">
            No parking zones available for this gate.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Gate information */}
      {zones && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">📍 {gateId}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {zones.length} parking zone{zones.length !== 1 ? "s" : ""} available
          </p>
        </div>
      )}

      {/* Real-time status indicator */}
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-blue-800">
            Real-time updates: {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <span className="text-xs text-blue-600">
          Live zone status, availability & pricing
        </span>
      </div>

      {/* Zones grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone: Zone) => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </div>
    </div>
  );
};

export default Zones;
