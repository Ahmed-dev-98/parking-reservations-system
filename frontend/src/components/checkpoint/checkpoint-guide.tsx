"use client";

import React from "react";
import {
  QrCode,
  Car,
  UserCheck,
  Clock,
  DollarSign,
  Printer,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CheckpointGuide: React.FC = () => {
  const steps = [
    {
      icon: QrCode,
      title: "Scan Ticket",
      description: "Enter or scan the ticket ID in the input field above",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      icon: UserCheck,
      title: "Verify Customer",
      description: "For subscribers, verify vehicle plates match registration",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
    {
      icon: DollarSign,
      title: "Process Payment",
      description: "Review charges and generate receipt automatically",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      icon: Printer,
      title: "Print Receipt",
      description: "Provide customer with payment receipt if needed",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
  ];

  const tips = [
    {
      icon: CheckCircle,
      title: "Valid Ticket",
      description: "Regular visitors are automatically processed",
      type: "success",
    },
    {
      icon: Car,
      title: "Subscriber Tickets",
      description: "Require vehicle verification before gate opening",
      type: "info",
    },
    {
      icon: AlertTriangle,
      title: "Plate Mismatch",
      description: "Convert subscriber tickets to visitor rates if needed",
      type: "warning",
    },
  ];

  const ticketsExample = [
    {
      text: "Subscriber Tickets ( with related subscription id - sub_003)",
      value: "t_010",
    },
    {
      text: "Subscriber Tickets (without related subscription id)",
      value: "t_015",
    },
    { text: "Visitor Tickets (Already checked out)", value: "t_020" },
    { text: "Visitor Tickets (Not checked out yet)", value: "t_025" },
  ];

  return (
    <div className="space-y-6">
      {/* How to Use Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Checkout Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative">
                  <div
                    className={`p-4 rounded-lg border ${step.bgColor} ${step.borderColor}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-2 rounded-full bg-white dark:bg-gray-800`}
                      >
                        <IconComponent className={`w-5 h-5 ${step.color}`} />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Step {index + 1}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tips.map((tip, index) => {
              const IconComponent = tip.icon;
              const colorMap = {
                success: {
                  icon: "text-green-600",
                  bg: "bg-green-50 dark:bg-green-900/20",
                  border: "border-green-200 dark:border-green-800",
                },
                info: {
                  icon: "text-blue-600",
                  bg: "bg-blue-50 dark:bg-blue-900/20",
                  border: "border-blue-200 dark:border-blue-800",
                },
                warning: {
                  icon: "text-orange-600",
                  bg: "bg-orange-50 dark:bg-orange-900/20",
                  border: "border-orange-200 dark:border-orange-800",
                },
              };

              const colors = colorMap[tip.type as keyof typeof colorMap];

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent
                      className={`w-5 h-5 ${colors.icon} mt-0.5`}
                    />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        {tip.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            Ready to Start
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Scan a Ticket to Begin
            </h3>
            <p className="text-muted-foreground mb-4">
              Enter the ticket ID in the field above Using one of the following
              ticket IDs:
            </p>
            <div className="flex flex-col gap-3 justify-center items-center">
              {ticketsExample.map((ticket) => (
                <div
                  key={ticket.value}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg w-fit"
                >
                  <span className="text-sm text-muted-foreground">
                    {ticket.text}
                  </span>
                  <code className="px-2 py-1 bg-background rounded text-sm font-mono">
                    {ticket.value}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
