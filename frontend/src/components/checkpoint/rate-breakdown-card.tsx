"use client";

import React from "react";
import { Receipt, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BreakdownSegment {
  from: string;
  to: string;
  hours: number;
  rate: number;
  amount: number;
  rateMode: "normal" | "special";
}

interface RateBreakdownCardProps {
  breakdown: BreakdownSegment[];
  formatCurrency: (value: number) => string;
  formatDateTime: (dateString: string) => string;
}

export const RateBreakdownCard: React.FC<RateBreakdownCardProps> = ({
  breakdown,
  formatCurrency,
  formatDateTime,
}) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          Rate Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {breakdown.map((segment, index) => (
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
  );
};
