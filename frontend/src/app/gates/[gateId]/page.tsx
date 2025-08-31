"use client";

import { Layout } from "@/components/Layout";
import Zones from "@/components/zones/zones";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  MapPin,
  UserCheck,
  User,
  AlertCircle,
  Car,
  Calendar,
  Clock,
  Shield,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import subscriptionService from "@/services/subscription.service";
import { toast } from "sonner";
import { Subscription } from "@/types/api";

type TabType = "visitor" | "subscriber";

const GatePage = () => {
  const { gateId } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("visitor");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [verifiedSubscription, setVerifiedSubscription] =
    useState<Subscription | null>(null);
  const [subscriptionError, setSubscriptionError] = useState("");

  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const handleGoBack = () => {
    router.push("/");
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Reset subscription data when switching tabs
    if (tab === "visitor") {
      setSubscriptionId("");
      setVerifiedSubscription(null);
      setSubscriptionError("");
    }
  };

  const handleVerifySubscription = async () => {
    if (!subscriptionId.trim()) {
      setSubscriptionError("Please enter a subscription ID");
      toast.error("Please enter a subscription ID");
      return;
    }

    setSubscriptionLoading(true);
    setSubscriptionError("");
    setVerifiedSubscription(null);

    try {
      // Manually fetch subscription data
      const subscriptionData = await subscriptionService.getSubscription(
        subscriptionId.trim()
      );

      if (subscriptionData.active) {
        setVerifiedSubscription(subscriptionData);
        toast.success(`Subscription verified for ${subscriptionData.userName}`);
      } else {
        setSubscriptionError("Subscription is not active");
        toast.error("Subscription is not active");
      }
    } catch {
      setVerifiedSubscription(null);
      setSubscriptionError("Subscription not found");
      toast.error("Subscription not found");
    } finally {
      setSubscriptionLoading(false);
    }
  };

  return (
    <Layout title={`Gate ${gateId} - Parking Zones`}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gates
          </Button>
        </div>

        {/* Tab Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Check-in Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
              <Button
                variant={activeTab === "visitor" ? "default" : "ghost"}
                onClick={() => handleTabChange("visitor")}
                className="flex-1 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Visitor
              </Button>
              <Button
                variant={activeTab === "subscriber" ? "default" : "ghost"}
                onClick={() => handleTabChange("subscriber")}
                className="flex-1 flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Subscriber
              </Button>
            </div>

            {/* Subscriber ID Input */}
            {activeTab === "subscriber" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subscriptionId">Subscription ID</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="subscriptionId"
                      type="text"
                      placeholder="Enter subscription ID"
                      value={subscriptionId}
                      onChange={(e) => setSubscriptionId(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleVerifySubscription();
                        }
                      }}
                    />
                    <Button
                      onClick={handleVerifySubscription}
                      disabled={subscriptionLoading || !subscriptionId.trim()}
                    >
                      {subscriptionLoading ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </div>

                {/* Subscription Status */}
                {(subscriptionError || verifiedSubscription) && (
                  <Card
                    className={`mt-4 ${
                      subscriptionError
                        ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                        : "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle
                        className={`flex items-center gap-2 text-base ${
                          subscriptionError
                            ? "text-red-700 dark:text-red-300"
                            : "text-green-700 dark:text-green-300"
                        }`}
                      >
                        {subscriptionError ? (
                          <AlertCircle className="w-5 h-5" />
                        ) : (
                          <UserCheck className="w-5 h-5" />
                        )}
                        {subscriptionError
                          ? "Verification Failed"
                          : "Subscription Verified"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {subscriptionError ? (
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {subscriptionError}
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {/* Subscriber Information Section */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-green-200 dark:border-green-700">
                              <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <h3 className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">
                                Subscriber Information
                              </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                                  Name
                                </span>
                                <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                                  {verifiedSubscription?.userName}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  Category
                                </span>
                                <p className="text-sm font-semibold text-green-800 capitalize dark:text-green-200">
                                  {verifiedSubscription?.category.split("_")[1]}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Subscription Details Section */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-green-200 dark:border-green-700">
                              <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <h3 className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">
                                Subscription Period
                              </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Start Date
                                </span>
                                <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                                  {
                                    verifiedSubscription?.startsAt?.split(
                                      "T"
                                    )[0]
                                  }
                                </p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Expiry Date
                                </span>
                                <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                                  {
                                    verifiedSubscription?.expiresAt?.split(
                                      "T"
                                    )[0]
                                  }
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Current Activity Section */}
                          {verifiedSubscription?.currentCheckins &&
                            verifiedSubscription.currentCheckins.length > 0 && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-green-200 dark:border-green-700">
                                  <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  <h3 className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">
                                    Current Check-ins
                                  </h3>
                                </div>
                                <div className="space-y-2">
                                  {verifiedSubscription.currentCheckins.map(
                                    (checkin) => (
                                      <div
                                        key={checkin.ticketId}
                                        className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                                      >
                                        <div className="space-y-1">
                                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                            Zone {checkin.zoneId}
                                          </p>
                                          <p className="text-xs text-green-600 dark:text-green-400">
                                            Ticket: {checkin.ticketId}
                                          </p>
                                        </div>
                                        <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Registered Vehicles Section */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-green-200 dark:border-green-700">
                              <Car className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <h3 className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">
                                Registered Vehicles
                              </h3>
                            </div>
                            <div className="grid gap-3">
                              {verifiedSubscription?.cars.map((car, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                                >
                                  <div className="flex-shrink-0">
                                    <Car className="w-5 h-5 text-orange-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold text-orange-900 dark:text-orange-100">
                                        {car.plate}
                                      </p>
                                      <span className="px-2 py-1 text-xs font-medium text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/40 rounded-full">
                                        {car.color}
                                      </span>
                                    </div>
                                    <p className="text-sm text-orange-700 dark:text-orange-300">
                                      {car.brand} {car.model}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex justify-center pt-4 border-t border-green-200 dark:border-green-800">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setVerifiedSubscription(null);
                                setSubscriptionId("");
                                setSubscriptionError("");
                              }}
                              className="text-green-700 border-green-300 hover:bg-green-100 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-900/20"
                            >
                              Clear Verification
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Zones Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Available Parking Zones
            </h2>
            <p className="text-muted-foreground">
              {activeTab === "visitor"
                ? "Choose from the zones below to proceed with visitor check-in"
                : "Select a zone that matches your subscription category"}
            </p>
          </div>
          <Zones
            activeTab={activeTab}
            verifiedSubscription={verifiedSubscription}
          />
        </div>
      </div>
    </Layout>
  );
};

export default GatePage;
