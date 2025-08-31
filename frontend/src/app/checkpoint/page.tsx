"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { User } from "lucide-react";
import { useCheckout, useTicket, useSubscription } from "@/services/queries";
import { toast } from "sonner";
import {
  SubscriberVerification,
  CheckoutDisplay,
  CheckpointGuide,
} from "@/components/checkpoint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CheckpointPage = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [scannedTicketId, setScannedTicketId] = useState<string>("");
  const { mutateAsync: checkout, data: checkoutData } = useCheckout();

  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch ticket details when we have a scanned ticket
  const { data: ticketData } = useTicket(scannedTicketId);
  // Fetch subscription details if ticket is for a subscriber and has subscriptionId
  const { data: subscriptionData } = useSubscription(
    ticketData?.type === "subscriber" && ticketData?.subscriptionId
      ? ticketData.subscriptionId
      : ""
  );
  const handleScan = async () => {
    const ticketId = inputRef.current?.value;
    if (!ticketId) return;
    setScannedTicketId(ticketId);
  };

  const handleCheckout = useCallback(async () => {
    if (!scannedTicketId) return;
    const promise = checkout({ ticketId: scannedTicketId });
    toast.promise(promise, {
      loading: "Checking out...",
      success: () => {
        setCheckoutOpen(true);
        return "Checkout successful";
      },
      error: (error) => {
        if (error.response?.data?.message) {
          setScannedTicketId("");
          return error.response.data.message;
        }
        return "Checkout failed";
      },
    });
  }, [scannedTicketId, checkout]);

  const handleConvertToVisitor = async () => {
    const ticketId = inputRef.current?.value;
    if (!ticketId) return;

    const promise = checkout({ ticketId, forceConvertToVisitor: true });
    toast.promise(promise, {
      loading: "Converting to visitor and checking out...",
      success: () => {
        setCheckoutOpen(true);
        return "Converted to visitor and checkout successful";
      },
      error: (error) => {
        if (error.response?.data?.message) {
          setScannedTicketId("");
          return error.response.data.message;
        }
        return "Conversion failed";
      },
    });
  };

  const {
    ticketId,
    checkinAt,
    checkoutAt,
    durationHours,
    breakdown,
    amount,
    zoneState,
  } = checkoutData || {};



  useEffect(() => {
    if (scannedTicketId && ticketData && ticketData.type !== "subscriber") {
      handleCheckout();
    }
  }, [scannedTicketId, ticketData, handleCheckout]);
  return (
    <ProtectedRoute requiredRole="employee">
      <Layout title="Employee Checkpoint">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <User className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Employee Checkpoint
              </h1>
              <p className="text-muted-foreground">
                Monitor and manage parking operations
              </p>
            </div>
          </div>

          {/* Ticket Scanner */}
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter ticket ID"
              className="w-full"
              ref={inputRef}
            />
            <Button onClick={handleScan}>Scan</Button>
          </div>
          {/* Subscriber Verification */}
          {!checkoutData && ticketData && ticketData.type === "subscriber" && (
            <SubscriberVerification
              subscriptionData={subscriptionData}
              inputRef={inputRef}
              onOpenGate={() => {
                inputRef.current!.value = "";
                setScannedTicketId("");
              }}
              onConvertToVisitor={handleConvertToVisitor}
              hasSubscriptionData={!!subscriptionData}
            />
          )}
          {/* Checkout Display */}
          {checkoutData && checkoutOpen && (
            <CheckoutDisplay
              ticketId={ticketId || ""}
              checkinAt={checkinAt || ""}
              checkoutAt={checkoutAt || ""}
              durationHours={durationHours || 0}
              breakdown={breakdown || []}
              amount={amount || 0}
              zoneState={zoneState}
              onClose={() => {
                setCheckoutOpen(false);
                setScannedTicketId("");
                inputRef.current!.value = "";
              }}
            />
          )}

          {/* Guide Content - Show when no ticket is being processed */}
          {!scannedTicketId && !checkoutData && <CheckpointGuide />}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CheckpointPage;
