"use client";

import { CheckinResponse } from "@/types/api";

export function TicketModal({
  data,
  open,
  setOpen,
}: {
  data: CheckinResponse;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handlePrint = () => {
    window.print();
  };

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
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
          <h2 className="text-xl font-bold text-green-600 mt-2">Gate Open!</h2>
          <p className="text-gray-600">Please proceed to your parking zone</p>
        </div>

        {/* Ticket Details */}
        <div className="ticket-content border-2 border-dashed border-gray-300 p-4 bg-gray-50">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold">PARKING TICKET</h3>
            <p className="text-sm text-gray-600">
              Keep this ticket for checkout
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Ticket ID:</span>
              <span className="font-mono">{data.ticket.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Type:</span>
              <span className="capitalize">{data.ticket.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Zone:</span>
              <span>{data.zoneState.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Gate:</span>
              <span>{data.ticket.gateId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Check-in:</span>
              <span>{new Date(data.ticket.checkinAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Rate:</span>
              <span>${data.zoneState.rateNormal}/hr (Normal)</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-300">
            <div className="text-center">
              <div className="font-mono text-xs bg-white p-2 border">
                {/* Simple QR code placeholder */}
                <div
                  className="w-20 h-20 bg-black mx-auto mb-2"
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
                <div className="text-xs">{data.ticket.id}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Print Ticket
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .ticket-content {
            background: white !important;
            border: 1px solid black !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
