"use client";

import React from "react";
import { Receipt, Car, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TicketInfoCardProps {
  ticketId: string;
  durationHours: number;
  checkinAt: string;
  checkoutAt: string;
  formatDateTime: (dateString: string) => string;
}

export const TicketInfoCard: React.FC<TicketInfoCardProps> = ({
  ticketId,
  durationHours,
  checkinAt,
  checkoutAt,
  formatDateTime,
}) => {
  return (
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
              <p className="text-sm text-muted-foreground">Ticket ID</p>
              <p className="font-mono font-semibold">{ticketId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">{durationHours.toFixed(2)} hours</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Check-in</p>
              <p className="font-semibold text-sm">
                {formatDateTime(checkinAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Check-out</p>
              <p className="font-semibold text-sm">
                {formatDateTime(checkoutAt)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
