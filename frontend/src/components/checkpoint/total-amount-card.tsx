"use client";

import React from "react";
import { Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TotalAmountCardProps {
  amount: number;
  formatCurrency: (value: number) => string;
}

export const TotalAmountCard: React.FC<TotalAmountCardProps> = ({
  amount,
  formatCurrency,
}) => {
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-full">
              <Receipt className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-semibold">Total Amount</span>
          </div>
          <span className="text-3xl font-bold text-primary">
            {formatCurrency(amount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
