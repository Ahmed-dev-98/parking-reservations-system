"use client";

import { CheckinResponse, Zone } from "@/types/api";
import { useState } from "react";
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
interface ZoneCardProps {
  zone: Zone;
}

export function ZoneCard({ zone }: ZoneCardProps) {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const { mutate: checkin, isSuccess, data: ticketData } = useCheckin();
  const { gateId } = useParams();
  const handleConfirmReservation = () => {
    checkin({
      gateId: gateId as string,
      zoneId: zone.id,
      type: "visitor",
    });
    if (isSuccess) {
      console.log(ticketData);
      setShowTicketModal(true);
    }
  };

  const getRateDisplay = () => {
    return (
      <div className="text-sm transition-all duration-300 ease-in-out">
        <div className="flex items-center space-x-1">
          <span>Normal:</span>
          <span className="font-semibold text-green-600">
            ${zone.rateNormal}/hr
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Special:</span>
          <span className="font-semibold text-orange-600">
            ${zone.rateSpecial}/hr
          </span>
        </div>
      </div>
    );
  };

  const getAvailabilityColor = () => {
    if (!zone.open) return "bg-gray-500";
    if (zone.availableForVisitors === 0) return "bg-red-500";
    if (zone.availableForVisitors <= 5) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${
          zone.open
            ? "border-green-500 bg-green-50"
            : "border-red-500 bg-red-50"
        }
      `}
    >
      {/* Status indicator */}
      <div
        className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getAvailabilityColor()}`}
      />

      {/* Zone header */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
        <p className="text-sm text-gray-600">Category: {zone.categoryId}</p>
      </div>

      {/* Availability info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Total:</span>
          <span className="ml-1 font-medium">{zone.totalSlots}</span>
        </div>
        <div>
          <span className="text-gray-600">Occupied:</span>
          <span className="ml-1 font-medium">{zone.occupied}</span>
        </div>
        <div>
          <span className="text-gray-600">Free:</span>
          <span className="ml-1 font-medium">{zone.free}</span>
        </div>
        <div>
          <span className="text-gray-600">Reserved:</span>
          <span className="ml-1 font-medium">{zone.reserved}</span>
        </div>
      </div>

      {/* Tab-specific availability */}
      <div className="mb-4 p-2 bg-gray-50 rounded">
        <div>
          <span className="text-sm text-gray-600">Available for Visitors:</span>
          <span
            className={`ml-2 text-lg font-bold ${
              zone.availableForVisitors > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {zone.availableForVisitors}
          </span>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 w-full justify-between ">
        {getRateDisplay()}
        {zone.open && zone.availableForVisitors > 0 ? (
          <AlertDialog>
            <AlertDialogTrigger className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-md">
              Go
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmReservation}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : zone.open && zone.availableForVisitors === 0 ? (
          <div className="text-sm text-red-600 font-medium">
            No visitor slots available
          </div>
        ) : (
          <div className="text-sm text-red-600 font-medium">Zone Closed</div>
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
