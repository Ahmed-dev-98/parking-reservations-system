import { Layout } from "@/components/Layout";
import React from "react";

const GatesLoading = () => {
  return (
    <Layout title="Gates Dashboard">
      <div className="space-y-8">
        {/* Header Section Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted rounded-md animate-pulse"></div>
              <div className="h-5 w-96 bg-muted rounded-md animate-pulse"></div>
            </div>
          </div>

          {/* Gates Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 space-y-4 animate-pulse"
              >
                {/* Gate Header */}
                <div className="flex items-center justify-between">
                  <div className="h-6 w-24 bg-muted rounded-md"></div>
                  <div className="h-5 w-16 bg-muted rounded-full"></div>
                </div>

                {/* Gate Description */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded-md"></div>
                  <div className="h-4 w-3/4 bg-muted rounded-md"></div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="h-3 w-16 bg-muted rounded-md"></div>
                    <div className="h-6 w-12 bg-muted rounded-md"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 w-20 bg-muted rounded-md"></div>
                    <div className="h-6 w-16 bg-muted rounded-md"></div>
                  </div>
                </div>

                {/* Button */}
                <div className="h-10 w-full bg-muted rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GatesLoading;
