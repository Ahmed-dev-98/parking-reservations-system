"use client";

import React, { useRef } from "react";
import { ZoneInfoCard } from "./zone-info-card";
import { TicketInfoCard } from "./ticket-info-card";
import { RateBreakdownCard } from "./rate-breakdown-card";
import { TotalAmountCard } from "./total-amount-card";
import PrintInvoice from "@/components/PrintInvoice";
import { Button } from "../ui/button";
import { Printer } from "lucide-react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
interface BreakdownSegment {
  from: string;
  to: string;
  hours: number;
  rate: number;
  amount: number;
  rateMode: "normal" | "special";
}

interface ZoneState {
  name: string;
  occupied: number;
  totalSlots: number;
  free: number;
  reserved: number;
  open: boolean;
  rateNormal: number;
  rateSpecial: number;
}

interface CheckoutDisplayProps {
  ticketId: string;
  checkinAt: string;
  checkoutAt: string;
  durationHours: number;
  breakdown: BreakdownSegment[];
  amount: number;
  zoneState?: ZoneState;
  onClose: () => void;
}

export const CheckoutDisplay: React.FC<CheckoutDisplayProps> = ({
  ticketId,
  checkinAt,
  checkoutAt,
  durationHours,
  breakdown,
  amount,
  zoneState,
  onClose,
}) => {
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString();
  const printRef = useRef<HTMLDivElement>(null);
  const onPrint = async () => {
    const element = printRef.current;
    if (!element) {
      return;
    }

    try {
      // Temporarily make the element visible for html2canvas-pro
      const originalDisplay = element.style.display;
      element.style.display = "block";
      element.style.position = "absolute";
      element.style.left = "-9999px";
      element.style.top = "0";

      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scale: 2,
      });

      // Restore original display
      element.style.display = originalDisplay;
      element.style.position = "";
      element.style.left = "";
      element.style.top = "";

      const data = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // A4 portrait dimensions in mm
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      // Calculate dimensions to fit the page while maintaining aspect ratio
      let imgWidth = maxWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      // If height exceeds page, scale down based on height
      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }

      pdf.addImage(data, "PNG", margin, margin, imgWidth, imgHeight);
      pdf.save("invoice.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };
  return (
    <div className="checkout-content animate-in slide-in-from-top-4 duration-300">
      <div className="space-y-6">
        {/* Zone Information Card */}
        {zoneState && (
          <ZoneInfoCard zoneState={zoneState} formatCurrency={formatCurrency} />
        )}

        {/* Ticket Information Card */}
        <TicketInfoCard
          ticketId={ticketId}
          durationHours={durationHours}
          checkinAt={checkinAt}
          checkoutAt={checkoutAt}
          formatDateTime={formatDateTime}
        />

        {/* Rate Breakdown Card */}
        <RateBreakdownCard
          breakdown={breakdown}
          formatCurrency={formatCurrency}
          formatDateTime={formatDateTime}
        />

        {/* Total Amount Card */}
        <TotalAmountCard amount={amount} formatCurrency={formatCurrency} />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button onClick={onPrint} className="flex-1 gap-2" size="lg">
            <Printer className="w-5 h-5" />
            Print Receipt
          </Button>
          <Button
            onClick={onClose}
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
        printRef={printRef}
        ticketId={ticketId}
        checkinAt={checkinAt}
        checkoutAt={checkoutAt}
        durationHours={durationHours}
        breakdown={breakdown}
        amount={amount}
      />
    </div>
  );
};
