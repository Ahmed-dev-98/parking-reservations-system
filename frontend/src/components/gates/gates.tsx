"use client";
import { useGates } from "@/services/queries";
import React from "react";
import GateCard from "./_components/gate-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, MapPin } from "lucide-react";

const Gates = () => {
  const { data: gates, isLoading, error } = useGates();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-5 w-24 bg-muted rounded" />
                    <div className="h-4 w-32 bg-muted rounded" />
                  </div>
                </div>
                <div className="w-4 h-4 bg-muted rounded" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-muted rounded" />
                  <div className="h-4 w-20 bg-muted rounded" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-6 w-16 bg-muted rounded-full" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Error Loading Gates
              </h3>
              <p className="text-muted-foreground">{error.message}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!gates || gates.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Gates Available
              </h3>
              <p className="text-muted-foreground">
                There are currently no parking gates configured in the system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gates.map((gate) => (
        <GateCard key={gate.id} gate={gate} />
      ))}
    </div>
  );
};

export default Gates;
