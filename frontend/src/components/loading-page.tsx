"use client";

import React from "react";
import { Car, MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface LoadingPageProps {
  text?: string;
  showLogo?: boolean;
  subtitle?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  text = "Loading...",
  showLogo = false,
  subtitle,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <Card className="w-full max-w-md border-0 bg-gradient-to-br from-background to-muted/30">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Logo Section */}
            {showLogo && (
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <Car className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-orange-100 p-1 rounded-full">
                    <MapPin className="w-3 h-3 text-orange-600" />
                  </div>
                </div>
                <div className="text-center">
                  <h1 className="text-xl font-bold text-foreground">
                    ParkSmart
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Parking System
                  </p>
                </div>
              </div>
            )}

            {/* Loading Animation */}
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center space-y-2">
                <span className="text-lg font-medium text-foreground">
                  {text}
                </span>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-2">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full animate-pulse origin-left transform scale-x-75"></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Initializing...</span>
                <span>Please wait</span>
              </div>
            </div>

            {/* Dots Animation */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingPage;
