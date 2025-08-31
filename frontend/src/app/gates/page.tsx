import Gates from "@/components/gates/gates";
import { Layout } from "@/components/Layout";
import React from "react";

const DashboardPage = () => {
  return (
    <Layout title="Gates Dashboard">
      <div className="space-y-8">
        {/* Gates Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Available Gates
              </h2>
              <p className="text-muted-foreground">
                Choose a gate to view parking zones and availability
              </p>
            </div>
          </div>
          <Gates />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
