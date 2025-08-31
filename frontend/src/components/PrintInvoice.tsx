"use client";

import React from "react";

interface BreakdownSegment {
  from: string;
  to: string;
  hours: number;
  rate: number;
  amount: number;
  rateMode: string;
}

interface PrintInvoiceProps {
  ticketId: string;
  checkinAt: string;
  checkoutAt: string;
  durationHours: number;
  breakdown: BreakdownSegment[];
  amount: number;
  printRef: React.RefObject<HTMLDivElement | null>;
}

const PrintInvoice: React.FC<PrintInvoiceProps> = ({
  ticketId,
  checkinAt,
  checkoutAt,
  durationHours,
  breakdown,
  amount,
  printRef,
}) => {
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString();

  return (
    <div>
      {/* Print-only Invoice Template */}
      <div
        ref={printRef}
        style={{
          display: "none",
          padding: "10px",
          maxWidth: "100%",
          margin: "0",
          backgroundColor: "#ffffff",
          color: "#000000",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "15px",
            borderBottom: "2px solid #000",
            paddingBottom: "10px",
          }}
        >
          <h1
            style={{
              margin: "0",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            PARKING INVOICE
          </h1>
          <p
            style={{ margin: "3px 0 0 0", fontSize: "12px", color: "#6c757d" }}
          >
            Payment Receipt
          </p>
        </div>

        {/* Invoice Details */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "15px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontWeight: "bold",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "3px",
                }}
              >
                Ticket Information
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "3px 0",
                        fontWeight: "bold",
                        width: "40%",
                        fontSize: "11px",
                      }}
                    >
                      Ticket ID:
                    </td>
                    <td
                      style={{
                        padding: "3px 0",
                        fontFamily: "monospace",
                        fontSize: "11px",
                      }}
                    >
                      {ticketId}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "3px 0",
                        fontWeight: "bold",
                        fontSize: "11px",
                      }}
                    >
                      Duration:
                    </td>
                    <td style={{ padding: "3px 0", fontSize: "11px" }}>
                      {durationHours.toFixed(2)} hours
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontWeight: "bold",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "3px",
                }}
              >
                Parking Times
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "3px 0",
                        fontWeight: "bold",
                        width: "40%",
                        fontSize: "11px",
                      }}
                    >
                      Check-in:
                    </td>
                    <td style={{ padding: "3px 0", fontSize: "10px" }}>
                      {formatDateTime(checkinAt)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "3px 0",
                        fontWeight: "bold",
                        fontSize: "11px",
                      }}
                    >
                      Check-out:
                    </td>
                    <td style={{ padding: "3px 0", fontSize: "10px" }}>
                      {formatDateTime(checkoutAt)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Rate Breakdown */}
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              margin: "0 0 10px 0",
              fontSize: "14px",
              fontWeight: "bold",
              borderBottom: "1px solid #ccc",
              paddingBottom: "3px",
            }}
          >
            Rate Breakdown
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ccc",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th
                  style={{
                    padding: "6px",
                    textAlign: "left",
                    borderBottom: "1px solid #ccc",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Time Period
                </th>
                <th
                  style={{
                    padding: "6px",
                    textAlign: "center",
                    borderBottom: "1px solid #ccc",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Hours
                </th>
                <th
                  style={{
                    padding: "6px",
                    textAlign: "center",
                    borderBottom: "1px solid #ccc",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Rate/Hour
                </th>
                <th
                  style={{
                    padding: "6px",
                    textAlign: "center",
                    borderBottom: "1px solid #ccc",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    padding: "6px",
                    textAlign: "right",
                    borderBottom: "1px solid #ccc",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((segment, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom:
                      index === breakdown.length - 1
                        ? "none"
                        : "1px solid #eee",
                  }}
                >
                  <td
                    style={{
                      padding: "5px",
                      fontSize: "9px",
                      verticalAlign: "top",
                    }}
                  >
                    <div>{formatDateTime(segment.from)}</div>
                    <div style={{ color: "#6c757d" }}>
                      to {formatDateTime(segment.to)}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "5px",
                      textAlign: "center",
                      fontSize: "10px",
                    }}
                  >
                    {segment.hours.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "5px",
                      textAlign: "center",
                      fontSize: "10px",
                    }}
                  >
                    {formatCurrency(segment.rate)}
                  </td>
                  <td
                    style={{
                      padding: "5px",
                      textAlign: "center",
                      fontSize: "10px",
                    }}
                  >
                    <span
                      style={{
                        padding: "1px 4px",
                        borderRadius: "2px",
                        fontSize: "8px",
                        fontWeight: "bold",
                        backgroundColor:
                          segment.rateMode === "special"
                            ? "#fff3cd"
                            : "#d1ecf1",
                        color:
                          segment.rateMode === "special"
                            ? "#856404"
                            : "#0c5460",
                        border: `1px solid ${
                          segment.rateMode === "special" ? "#ffc107" : "#28a745"
                        }`,
                      }}
                    >
                      {segment.rateMode.toUpperCase()}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "5px",
                      textAlign: "right",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(segment.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div
          style={{
            borderTop: "2px solid #000",
            paddingTop: "10px",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>
              TOTAL AMOUNT:
            </span>
            <span
              style={{ fontSize: "18px", fontWeight: "bold", color: "#000" }}
            >
              {formatCurrency(amount)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            fontSize: "9px",
            color: "#6c757d",
            borderTop: "1px solid #ccc",
            paddingTop: "8px",
          }}
        >
          <p style={{ margin: "0" }}>
            Thank you for using our parking service!
          </p>
          <p style={{ margin: "3px 0 0 0" }}>
            Generated on: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintInvoice;
