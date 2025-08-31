"use client";

import React, { RefObject } from "react";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Car {
  plate: string;
  brand: string;
  model: string;
  color: string;
}

interface SubscriptionData {
  userName: string;
  cars: Car[];
}

interface SubscriberVerificationProps {
  subscriptionData?: SubscriptionData;
  inputRef: RefObject<HTMLInputElement | null>;
  onOpenGate: () => void;
  onConvertToVisitor: () => void;
  hasSubscriptionData: boolean;
}

export const SubscriberVerification: React.FC<SubscriberVerificationProps> = ({
  subscriptionData,
  inputRef,
  onOpenGate,
  onConvertToVisitor,
  hasSubscriptionData,
}) => {
  if (hasSubscriptionData && subscriptionData) {
    return (
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
              Please verify the vehicle plate matches one of the registered
              cars:
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
                <Button className="flex-1" onClick={onOpenGate}>
                  Open Gate
                </Button>
                <AlertDialogTrigger className="flex-1 border rounded-sm py-2 px-3 cursor-pointer border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20">
                  Plate Doesn&apos;t Match - Convert to Visitor
                </AlertDialogTrigger>
              </div>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Convert to Visitor</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to convert this subscriber ticket to a
                    visitor ticket? This will charge visitor rates instead of
                    subscription rates.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onConvertToVisitor}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
            This is a subscriber ticket. but it does not have a subscription ID
            related to it to fetch the cars list.
          </p>
          <AlertDialog>
            <div className="flex items-center gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  inputRef.current!.value = "";
                  onOpenGate();
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
                <AlertDialogTitle>Convert to Visitor</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to convert this subscriber ticket to a
                  visitor ticket? This will charge visitor rates instead of
                  subscription rates.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onConvertToVisitor}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
