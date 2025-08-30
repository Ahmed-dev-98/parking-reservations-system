"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Wifi, WifiOff } from "lucide-react";

interface NotificationToastProps {
  message: string;
  type: "success" | "info" | "warning" | "error";
  isConnected: boolean;
  show: boolean;
  onHide: () => void;
}

export function NotificationToast({
  message,
  type,
  isConnected,
  show,
  onHide,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onHide, 300); // Wait for animation to complete
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show && !isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 border-green-600";
      case "info":
        return "bg-blue-500 border-blue-600";
      case "warning":
        return "bg-yellow-500 border-yellow-600";
      case "error":
        return "bg-red-500 border-red-600";
      default:
        return "bg-gray-500 border-gray-600";
    }
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm
        transform transition-all duration-300 ease-in-out
        ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }
      `}
    >
      <div
        className={`
        ${getTypeStyles()}
        border text-white p-4 rounded-lg shadow-lg
        flex items-center space-x-3
      `}
      >
        <div className="flex items-center space-x-2 flex-1">
          {type === "success" && <CheckCircle className="w-5 h-5" />}
          {isConnected ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">{message}</span>
        </div>

        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onHide, 300);
          }}
          className="text-white hover:text-gray-200 transition-colors"
        >
          ×
        </button>
      </div>

      {isConnected && (
        <div className="text-xs text-white/80 mt-1 pl-4">
          Broadcasting to all visitors...
        </div>
      )}
    </div>
  );
}
