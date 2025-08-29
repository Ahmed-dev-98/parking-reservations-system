"use client";

import Gates from "@/components/gates/gates";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { EROUTES } from "@/constants/routes";
import { Car, Shield, User, ArrowRight } from "lucide-react";
import React from "react";

const HomePage = () => {
  const { isAuthenticated, isAdmin, isEmployee } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (isAdmin) {
        router.push(EROUTES.ADMIN);
      } else if (isEmployee) {
        router.push(EROUTES.CHECKPOINT);
      }
    } else {
      router.push(EROUTES.LOGIN);
    }
  };

  return (
    <Layout title="Parking Reservation System">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="text-center py-12 px-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full">
              <Car className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Parking Reservation System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Modern, real-time parking management solution for efficient space
            allocation and reservation tracking.
          </p>
        </div>

        {/* Gates Section */}
        <div className="px-4">
          <h2 className="text-2xl font-bold mb-6">Available Gates</h2>
          <Gates />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
