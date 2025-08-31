"use client";

import { CheckinResponse } from "@/types/api";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useRef } from "react";

export function TicketModal({
  data,
  open,
  setOpen,
}: {
  data: CheckinResponse;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const printTicketRef = useRef<HTMLDivElement>(null);
  const handlePrint = async () => {
    const element = printTicketRef.current;
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
      pdf.save("parking-ticket.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        {/* Gate Open Animation */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-pulse mx-auto">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-green-500 mt-2">Gate Open!</h2>
          <p className="text-muted-foreground">
            Please proceed to your parking zone
          </p>
        </div>

        {/* Ticket Details */}
        <div className="ticket-content border-2 border-dashed border-border p-4 bg-muted/50">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-foreground">
              PARKING TICKET
            </h3>
            <p className="text-sm text-muted-foreground">
              Keep this ticket for checkout
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">
                Ticket ID:
              </span>
              <span className="font-mono text-foreground">
                {data.ticket.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Type:</span>
              <span className="capitalize text-foreground">
                {data.ticket.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Zone:</span>
              <span className="text-foreground">{data.zoneState.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Gate:</span>
              <span className="text-foreground">{data.ticket.gateId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">
                Check-in:
              </span>
              <span className="text-foreground">
                {new Date(data.ticket.checkinAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Rate:</span>
              <span className="text-green-500 font-medium">
                ${data.zoneState.rateNormal}/hr (Normal)
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="font-mono text-xs bg-background p-3 border border-border rounded-lg">
                {/* Simple QR code placeholder */}
                <div
                  className="w-20 h-20 bg-foreground mx-auto mb-2 rounded"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                      <rect x="0" y="0" width="100" height="100" fill="white"/>
                      <rect x="10" y="10" width="80" height="80" fill="black"/>
                      <rect x="20" y="20" width="60" height="60" fill="white"/>
                      <rect x="30" y="30" width="40" height="40" fill="black"/>
                    </svg>
                  `)}")`,
                    backgroundSize: "cover",
                  }}
                />
                <div className="text-xs text-muted-foreground">
                  {data.ticket.id}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Print Ticket
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex-1 bg-muted hover:bg-muted/80 text-foreground border border-border px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Print-only Ticket Template */}
      <div
        ref={printTicketRef}
        style={{
          display: "none",
          width: "400px",
          padding: "20px",
          backgroundColor: "#ffffff",
          color: "#000000",
          fontFamily: "Arial, sans-serif",
          border: "2px solid #000000",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            borderBottom: "2px solid #000",
            paddingBottom: "15px",
          }}
        >
          <h1
            style={{
              margin: "0",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            PARKING TICKET
          </h1>
          <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#666" }}>
            Keep this ticket for checkout
          </p>
        </div>

        {/* Ticket Details */}
        <div style={{ marginBottom: "25px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    fontWeight: "bold",
                    fontSize: "14px",
                    width: "30%",
                  }}
                >
                  Ticket ID:
                </td>
                <td
                  style={{
                    padding: "8px 0",
                    fontFamily: "monospace",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {data.ticket.id}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Type:
                </td>
                <td
                  style={{
                    padding: "8px 0",
                    fontSize: "14px",
                    textTransform: "capitalize",
                  }}
                >
                  {data.ticket.type}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Zone:
                </td>
                <td
                  style={{
                    padding: "8px 0",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {data.zoneState.name}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Gate:
                </td>
                <td style={{ padding: "8px 0", fontSize: "14px" }}>
                  {data.ticket.gateId}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Check-in:
                </td>
                <td style={{ padding: "8px 0", fontSize: "13px" }}>
                  {new Date(data.ticket.checkinAt).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Rate:
                </td>
                <td
                  style={{
                    padding: "8px 0",
                    fontSize: "14px",
                    color: "#28a745",
                    fontWeight: "bold",
                  }}
                >
                  ${data.zoneState.rateNormal}/hr (Normal)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* QR Code Section */}
        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
            borderTop: "1px solid #ccc",
            paddingTop: "20px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              backgroundColor: "#000000",
              margin: "0 auto 15px auto",
              border: "2px solid #000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Simple QR pattern */}
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#ffffff",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#000",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#000",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#000",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "30px",
                  height: "30px",
                  backgroundColor: "#000",
                  transform: "translate(-50%, -50%)",
                }}
              ></div>
            </div>
          </div>
          <div
            style={{
              fontSize: "12px",
              fontFamily: "monospace",
              fontWeight: "bold",
              color: "#666",
            }}
          >
            {data.ticket.id}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: "#666",
            borderTop: "1px solid #ccc",
            paddingTop: "15px",
            marginTop: "25px",
          }}
        >
          <p style={{ margin: "0" }}>
            Please keep this ticket safe for checkout
          </p>
          <p style={{ margin: "5px 0 0 0" }}>
            Generated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
