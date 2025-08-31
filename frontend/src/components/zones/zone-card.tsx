/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CheckinResponse, Subscription, Zone } from "@/types/api";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TicketModal } from "../TicketModal";
import { useCheckin } from "@/services/queries";
import { useParams } from "next/navigation";

type TabType = "visitor" | "subscriber";

interface ZoneCardProps {
  zone: Zone;
  activeTab?: TabType;
  verifiedSubscription?: Subscription;
}

export function ZoneCard({
  zone,
  activeTab = "visitor",
  verifiedSubscription,
}: ZoneCardProps) {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const {
    mutate: checkin,
    isSuccess,
    data: ticketData,
    isPending,
  } = useCheckin();
  const { gateId } = useParams();

  // Handle mutation success with useEffect
  React.useEffect(() => {
    if (isSuccess && ticketData) {
      setShowTicketModal(true);
    }
  }, [isSuccess, ticketData]);

  const handleConfirmReservation = () => {
    checkin({
      gateId: gateId as string,
      zoneId: zone.id,
      type: activeTab,
      ...(activeTab === "subscriber" &&
        verifiedSubscription && {
          subscriptionId: verifiedSubscription.id,
        }),
    });
  };

  // Check if subscriber can access this zone
  const canSubscriberAccess = () => {
    if (activeTab !== "subscriber" || !verifiedSubscription) return false;
    return verifiedSubscription.category === zone.categoryId;
  };

  // Get availability based on tab
  const getAvailability = () => {
    if (activeTab === "visitor") {
      return zone.availableForVisitors;
    } else {
      return zone.availableForSubscribers;
    }
  };

  // Check if zone is available for current tab
  const isZoneAvailable = () => {
    if (!zone.open) return false;

    if (activeTab === "visitor") {
      return zone.availableForVisitors > 0;
    } else {
      return (
        verifiedSubscription &&
        canSubscriberAccess() &&
        zone.availableForSubscribers > 0 &&
        (verifiedSubscription?.expiresAt
          ? verifiedSubscription?.expiresAt > new Date().toISOString()
          : true)
      );
    }
  };

  const getRateDisplay = () => {
    return (
      <div className="text-sm transition-all duration-300 ease-in-out">
        <div className="flex items-center space-x-1">
          <span className="text-muted-foreground">Normal:</span>
          <span className="font-semibold text-green-500">
            ${zone.rateNormal}/hr
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-muted-foreground">Special:</span>
          <span className="font-semibold text-orange-500">
            ${zone.rateSpecial}/hr
          </span>
        </div>
      </div>
    );
  };

  const getAvailabilityColor = () => {
    if (!zone.open) return "bg-gray-500";

    const availability = getAvailability();
    if (availability === 0) return "bg-red-500";
    if (availability <= 5) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getUnavailabilityReason = () => {
    if (!zone.open) return "Zone Closed";

    if (activeTab === "subscriber") {
      if (!verifiedSubscription) return "Please verify subscription first";
      if (!canSubscriberAccess())
        return `This zone is for ${
          zone.categoryId.split("_")[1]
        } subscribers only`;
      if (zone.availableForSubscribers === 0)
        return "No subscriber slots available";
      if (verifiedSubscription.expiresAt < new Date().toISOString())
        return "Subscription has expired";
    } else {
      if (zone.availableForVisitors === 0) return "No visitor slots available";
    }

    return null;
  };

  return (
    <div
      className={`
        relative p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer bg-card
        ${
          zone.open
            ? "border-green-500/50 hover:border-green-500"
            : "border-red-500/50 hover:border-red-500"
        }
      `}
    >
      {/* Status indicator */}
      <div
        className={`absolute top-3 right-3 w-3 h-3 rounded-full ${getAvailabilityColor()} animate-pulse`}
      />

      {/* Zone header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{zone.name}</h3>
        <p className="text-sm text-muted-foreground">
          Category: {zone.categoryId}
        </p>
      </div>

      {/* Availability info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-muted-foreground">Total:</span>
          <span className="ml-1 font-medium text-foreground">
            {zone.totalSlots}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Occupied:</span>
          <span className="ml-1 font-medium text-foreground">
            {zone.occupied}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Free:</span>
          <span className="ml-1 font-medium text-foreground">{zone.free}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Reserved:</span>
          <span className="ml-1 font-medium text-foreground">
            {zone.reserved}
          </span>
        </div>
      </div>

      {/* Tab-specific availability */}
      <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
        {activeTab === "visitor" ? (
          <div>
            <span className="text-sm text-muted-foreground">
              Available for Visitors:
            </span>
            <span
              className={`ml-2 text-lg font-bold ${
                zone.availableForVisitors > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {zone.availableForVisitors}
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">
                Available for Subscribers:
              </span>
              <span
                className={`ml-2 text-lg font-bold ${
                  zone.availableForSubscribers > 0 && canSubscriberAccess()
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {zone.availableForSubscribers}
              </span>
            </div>
            {verifiedSubscription && (
              <div className="text-xs text-muted-foreground">
                Category: {zone.categoryId}
                {canSubscriberAccess() ? (
                  <span className="text-green-600 ml-1">✓ Match</span>
                ) : (
                  <span className="text-red-600 ml-1">✗ No access</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center gap-2 w-full justify-between ">
        {getRateDisplay()}
        {isZoneAvailable() ? (
          <AlertDialog>
            <AlertDialogTrigger
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 cursor-pointer rounded-lg font-medium transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? "Processing..." : "Check-in"}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">
                  Confirm {activeTab === "visitor" ? "Visitor" : "Subscriber"}{" "}
                  Parking Reservation
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  You are about to reserve a parking slot in{" "}
                  <span className="font-medium text-foreground">
                    {zone.name}
                  </span>
                  {activeTab === "subscriber" && verifiedSubscription && (
                    <span>
                      {" "}
                      for subscriber{" "}
                      <strong>{verifiedSubscription.userName}</strong>
                    </span>
                  )}
                  . Rate:
                  <span className="font-medium text-green-500">
                    {" "}
                    ${zone.rateNormal}/hr (Normal)
                  </span>{" "}
                  |
                  <span className="font-medium text-orange-500">
                    {" "}
                    ${zone.rateSpecial}/hr (Special)
                  </span>
                  {activeTab === "subscriber" && (
                    <span className="block mt-2 text-sm">
                      Note: As a subscriber, you may be eligible for discounted
                      rates.
                    </span>
                  )}
                  . Are you sure you want to proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isPending}
                  className="bg-muted hover:bg-muted/80 text-foreground border-border"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmReservation}
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isPending ? "Processing..." : "Confirm Reservation"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <div className="text-sm text-red-500 font-medium bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
            {getUnavailabilityReason()}
          </div>
        )}
      </div>

      <TicketModal
        data={ticketData as CheckinResponse}
        open={showTicketModal}
        setOpen={setShowTicketModal}
      />
    </div>
  );
}
