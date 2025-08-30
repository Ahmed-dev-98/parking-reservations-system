/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateVacationRequest } from "@/types/api";
import { toast } from "sonner";

interface VacationFormProps {
  onSubmit: (data: CreateVacationRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const VacationForm: React.FC<VacationFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateVacationRequest>({
    defaultValues: {
      name: "",
      from: "",
      to: "",
    },
  });

  const handleFormSubmit = async (data: CreateVacationRequest) => {
    try {
      await onSubmit(data);
      reset();
      onCancel();
      toast.success("Vacation created successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save vacation");
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const validateDateRange = (fromDate: string, toDate: string) => {
    if (!fromDate || !toDate) return true;
    return (
      new Date(fromDate) <= new Date(toDate) ||
      "End date must be after start date"
    );
  };

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-medium mb-4">Create New Vacation</h4>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              placeholder="Vacation name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="from">From Date</Label>
            <Input
              id="from"
              type="date"
              {...register("from", {
                required: "Start date is required",
                validate: (value) => {
                  const toDate = watch("to");
                  return validateDateRange(value, toDate);
                },
              })}
            />
            {errors.from && (
              <p className="text-sm text-red-500">{errors.from.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To Date</Label>
            <Input
              id="to"
              type="date"
              {...register("to", {
                required: "End date is required",
                validate: (value) => {
                  const fromDate = watch("from");
                  return validateDateRange(fromDate, value);
                },
              })}
            />
            {errors.to && (
              <p className="text-sm text-red-500">{errors.to.message}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-2 mt-4">
          <Button type="submit" disabled={isLoading}>
            Create
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VacationForm;
