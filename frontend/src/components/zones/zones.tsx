"use client";
import { useZones } from "@/services/queries";
import React from "react";
import { ZoneCard } from "./zone-card";
import { Zone } from "@/types/api";

const Zones = () => {
  const { data: zones, isLoading, error } = useZones();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {zones?.map((zone: Zone) => (
        <ZoneCard key={zone.id} zone={zone} />
      ))}
    </div>
  );
};

export default Zones;
