"use client";

import React, { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  User,
  Clock,
  Car,
  Calendar,
  Receipt,
  Printer,
  MapPin,
  Users,
  DollarSign,
  AlertCircle,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCheckout, useTicket, useSubscription } from "@/services/queries";
import { toast } from "sonner";
import PrintInvoice from "@/components/PrintInvoice";
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

const CheckpointPage = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [scannedTicketId, setScannedTicketId] = useState<string>("");
  const { mutateAsync: checkout, data: checkoutData } = useCheckout();

  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch ticket details when we have a scanned ticket
  const { data: ticketData } = useTicket(scannedTicketId);
  console.log("ticketData", ticketData);
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

  const handleCheckout = async () => {
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
          return error.response.data.message;
        }
        return "Checkout failed";
      },
    });
  };

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

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString();

  const handlePrint = () => {
    // Set document title for PDF filename
    const originalTitle = document.title;
    document.title = "Parking Invoice";

    // Small delay to ensure title is set before print
    setTimeout(() => {
      window.print();
      // Restore original title after print
      setTimeout(() => {
        document.title = originalTitle;
      }, 100);
    }, 50);
  };

  useEffect(() => {
    if (scannedTicketId && ticketData && ticketData.type !== "subscriber") {
      handleCheckout();
    }
  }, [scannedTicketId, ticketData]);
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

          {/* input for scanned ticket id */}

          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter ticket ID"
              className="w-full"
              ref={inputRef}
            />
            <Button onClick={handleScan}>Scan</Button>
          </div>
          {!checkoutData && ticketData && ticketData.type === "subscriber" && (
            <div>
              {/* Subscription Car Verification Card */}
              {subscriptionData && (
                <Card className="border-orange-200 dark:border-orange-800">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-orange-600" />
                      Subscriber Vehicle Verification
                      <span className="text-sm font-normal text-muted-foreground">
                        ({subscriptionData.userName})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Please verify the vehicle plate matches one of the
                        registered cars:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {subscriptionData.cars.map((car, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                          >
                            <Car className="w-5 h-5 text-orange-600" />
                            <div>
                              <p className="font-semibold text-orange-900 dark:text-orange-100">
                                {car.plate}
                              </p>
                              <p className="text-sm text-orange-700 dark:text-orange-300">
                                {car.brand} {car.model} - {car.color}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <AlertDialog>
                        <div className="flex items-center gap-2">
                          <Button
                            className="flex-1"
                            onClick={() => {
                              inputRef.current!.value = "";
                              setScannedTicketId("");
                            }}
                          >
                            Open Gate
                          </Button>
                          <AlertDialogTrigger className="flex-1 border rounded-sm py-2 px-3 cursor-pointer border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20">
                            Plate Doesn&apos;t Match - Convert to Visitor
                          </AlertDialogTrigger>
                        </div>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Convert to Visitor
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to convert this subscriber
                              ticket to a visitor ticket? This will charge
                              visitor rates instead of subscription rates.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConvertToVisitor}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Subscriber Ticket Actions Card (when no subscription found) */}
              {!subscriptionData && (
                <Card className="border-orange-200 dark:border-orange-800">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-orange-600" />
                      Subscriber Ticket Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        This is a subscriber ticket. but it does not have a
                        subscription ID related to it to fetch the cars list.
                      </p>
                      <AlertDialog>
                        <div className="flex items-center gap-2">
                          <Button
                            className="flex-1"
                            onClick={() => {
                              inputRef.current!.value = "";
                              setScannedTicketId("");
                              handleCheckout();
                            }}
                          >
                            Open Gate
                          </Button>
                          <AlertDialogTrigger className="flex-1 border rounded-sm py-2 px-3 cursor-pointer border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20">
                            Convert to Visitor Ticket
                          </AlertDialogTrigger>
                        </div>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Convert to Visitor
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to convert this subscriber
                              ticket to a visitor ticket? This will charge
                              visitor rates instead of subscription rates.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConvertToVisitor}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          {checkoutData && checkoutOpen && (
            <div className="checkout-content animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-6">
                {/* Zone Information Card */}
                {zoneState && (
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Zone Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Zone Name
                            </p>
                            <p className="font-semibold">{zoneState.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Users className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Capacity
                            </p>
                            <p className="font-semibold">
                              {zoneState.occupied}/{zoneState.totalSlots}{" "}
                              occupied
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <DollarSign className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Normal Rate
                            </p>
                            <p className="font-semibold">
                              {formatCurrency(zoneState.rateNormal)}/hr
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <DollarSign className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Special Rate
                            </p>
                            <p className="font-semibold">
                              {formatCurrency(zoneState.rateSpecial)}/hr
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Zone Status and Availability */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                              Available
                            </span>
                          </div>
                          <p className="text-lg font-bold text-green-700 dark:text-green-300">
                            {zoneState.free}
                          </p>
                        </div>

                        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                              Reserved
                            </span>
                          </div>
                          <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                            {zoneState.reserved}
                          </p>
                        </div>

                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <AlertCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              Status
                            </span>
                          </div>
                          <p
                            className={`text-lg font-bold ${
                              zoneState.open
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {zoneState.open ? "Open" : "Closed"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Ticket Information Card */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-primary" />
                      Ticket Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Car className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Ticket ID
                          </p>
                          <p className="font-mono font-semibold">{ticketId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Duration
                          </p>
                          <p className="font-semibold">
                            {durationHours?.toFixed(2)} hours
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Check-in
                          </p>
                          <p className="font-semibold text-sm">
                            {formatDateTime(checkinAt || "")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Check-out
                          </p>
                          <p className="font-semibold text-sm">
                            {formatDateTime(checkoutAt || "")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rate Breakdown Card */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-primary" />
                      Rate Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto ">
                      {breakdown?.map((segment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-sm">
                                {formatDateTime(segment.from)} →{" "}
                                {formatDateTime(segment.to)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{segment.hours.toFixed(2)} hours</span>
                              <span>•</span>
                              <span>{formatCurrency(segment.rate)}/hr</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  segment.rateMode === "special"
                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                }`}
                              >
                                {segment.rateMode}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              {formatCurrency(segment.amount)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Total Amount Card */}
                <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <Receipt className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xl font-semibold">
                          Total Amount
                        </span>
                      </div>
                      <span className="text-3xl font-bold text-primary">
                        {formatCurrency(amount || 0)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    onClick={handlePrint}
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    <Printer className="w-5 h-5" />
                    Print Receipt
                  </Button>
                  <Button
                    onClick={() => {
                      setCheckoutOpen(false);
                      setScannedTicketId("");
                      inputRef.current!.value = "";
                    }}
                    variant="outline"
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    Close
                  </Button>
                </div>
              </div>

              {/* Print-only Invoice Template */}
              <PrintInvoice
                ticketId={ticketId || ""}
                checkinAt={checkinAt || ""}
                checkoutAt={checkoutAt || ""}
                durationHours={durationHours || 0}
                breakdown={breakdown || []}
                amount={amount || 0}
              />
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CheckpointPage;
