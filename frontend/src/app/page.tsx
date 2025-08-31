"use client";

import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { EROUTES } from "@/constants/routes";
import {
  Clock,
  Shield,
  Smartphone,
  Users,
  CheckCircle,
  MapPin,
  Receipt,
} from "lucide-react";
import Image from "next/image";

const HomePage = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push(EROUTES.LOGIN);
  };

  return (
    <Layout title="WeLink Cargo Parking System">
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-background overflow-hidden">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                    Smart Parking
                    <span className="block text-blue-500">Made Simple</span>
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                    Experience seamless parking management with real-time
                    availability, instant reservations, and automated
                    check-in/check-out for WeLink Cargo facilities.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleGetStarted}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border text-foreground px-8 py-3 text-lg font-semibold rounded-lg hover:bg-muted"
                  >
                    Learn More
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-8 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      24/7
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Available
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      Real-time
                    </div>
                    <div className="text-sm text-muted-foreground">Updates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      Secure
                    </div>
                    <div className="text-sm text-muted-foreground">Access</div>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="bg-muted rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                  width={400}
                  height={500}
                    src="/Subtract.png"
                    alt="Modern parking facility with organized parking spaces"
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                  />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-card rounded-lg shadow-lg p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-foreground">
                      Live Status Updates
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50 rounded-2xl">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Everything You Need for Efficient Parking
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our comprehensive parking management system serves visitors,
                employees, and administrators with powerful tools for seamless
                operations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-border shadow-lg bg-card">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Real-Time Availability
                  </h3>
                  <p className="text-muted-foreground">
                    See live parking space availability across all zones and
                    gates. No more driving around looking for spots.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-lg bg-card">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Easy Check-in/Check-out
                  </h3>
                  <p className="text-muted-foreground">
                    Simple digital tickets for visitors and seamless
                    subscription-based access for regular users.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-lg bg-card">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Secure Access Control
                  </h3>
                  <p className="text-muted-foreground">
                    Role-based access for employees and administrators with
                    comprehensive security features.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-lg bg-card">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Invoicing System
                  </h3>
                  <p className="text-muted-foreground">
                    We provide invoicing system to print your invoices.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-lg bg-card">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Automated Billing
                  </h3>
                  <p className="text-muted-foreground">
                    Smart rate calculation with normal and special pricing,
                    including rush hour and vacation adjustments.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-lg bg-card">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Multiple Zones & Gates
                  </h3>
                  <p className="text-muted-foreground">
                    Support for different parking categories like Economy,
                    Premium, and VIP with zone-specific pricing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* User Roles Section */}
        <section className="py-16 bg-background">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Built for Everyone
              </h2>
              <p className="text-xl text-muted-foreground">
                Whether you&apos;re a visitor, employee, or administrator,
                we&apos;ve got you covered.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center space-y-6 p-6">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full mx-auto flex items-center justify-center">
                  <Users className="w-10 h-10 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">
                    Visitors
                  </h3>
                  <p className="text-muted-foreground">
                    Quick and easy check-in at any available gate. View
                    real-time availability and get instant digital tickets.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-6 p-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full mx-auto flex items-center justify-center">
                  <Shield className="w-10 h-10 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">
                    Employees
                  </h3>
                  <p className="text-muted-foreground">
                    Manage checkpoint operations, process ticket checkouts, and
                    handle visitor-to-subscriber conversions.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-6 p-6">
                <div className="w-20 h-20 bg-purple-500/20 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-purple-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">
                    Administrators
                  </h3>
                  <p className="text-muted-foreground">
                    Full control over rates, zones, employee management, and
                    comprehensive reporting and analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/50 rounded-2xl">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Ready to Transform Your Parking Experience?
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Join WeLink Cargo&apos;s modern parking management system and
                experience the future of efficient space management.
              </p>
              <Button
                onClick={handleGetStarted}
                className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-700 dark:hover:bg-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
