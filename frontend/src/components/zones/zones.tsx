"use client";
import { useZones } from "@/services/queries";
import {
  useWebSocketConnected,
  useWebSocketSubscribe,
  useWebSocketUnsubscribe,
} from "@/store/websocket-store";
import React from "react";
import { ZoneCard } from "./zone-card";
import { Zone } from "@/types/api";
import { useParams } from "next/navigation";
import { MapPin } from "lucide-react";

type TabType = "visitor" | "subscriber";

interface ZonesProps {
  activeTab?: TabType;
  verifiedSubscription?: any;
}

const Zones = ({ activeTab = "visitor", verifiedSubscription }: ZonesProps) => {
  const { gateId } = useParams();
  const { data: zones, isLoading, error } = useZones(gateId as string);
  const isConnected = useWebSocketConnected();
  const subscribe = useWebSocketSubscribe();
  const unsubscribe = useWebSocketUnsubscribe();

  // Subscribe to this gate's updates when component mounts
  React.useEffect(() => {
    if (gateId && isConnected) {
      subscribe(gateId as string);

      return () => {
        unsubscribe(gateId as string);
      };
    }
  }, [gateId, subscribe, unsubscribe, isConnected]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-lg border border-border animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-5 w-24 bg-muted rounded"></div>
              <div className="h-4 w-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card p-6 rounded-lg border border-border animate-pulse"
            >
              <div className="space-y-4">
                <div className="h-6 w-3/4 bg-muted rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-2/3 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Error Loading Zones
        </h3>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!zones) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Zones Found
        </h3>
        <p className="text-muted-foreground">
          No zones data available for this gate.
        </p>
      </div>
    );
  }
  // Show message if no zones found for this gate
  if (zones.length === 0 && !isLoading) {
    return (
      <div className="space-y-4">
        {/* Real-time status indicator */}
        <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full animate-pulse ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm font-medium text-foreground">
              Real-time updates: {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Live zone status and availability
          </span>
        </div>

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Zones Available
          </h3>
          <p className="text-muted-foreground">
            No parking zones available for this gate.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gate information */}
      {zones && (
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Gate {gateId}
              </h3>
              <p className="text-sm text-muted-foreground">
                {zones.length} parking zone{zones.length !== 1 ? "s" : ""}{" "}
                available
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Real-time status indicator */}
      <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full animate-pulse ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <div>
            <span className="text-sm font-medium text-foreground">
              Real-time updates: {isConnected ? "Connected" : "Disconnected"}
            </span>
            <p className="text-xs text-muted-foreground">
              Live zone status, availability & pricing
            </p>
          </div>
        </div>
      </div>

      {/* Zones grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone: Zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            activeTab={activeTab}
            verifiedSubscription={verifiedSubscription}
          />
        ))}
      </div>
    </div>
  );
};

export default Zones;
