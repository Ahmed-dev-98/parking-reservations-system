/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateRushHourRequest } from "@/types/api";
import { toast } from "sonner";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface RushHourFormProps {
  onSubmit: (data: CreateRushHourRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const RushHourForm: React.FC<RushHourFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateRushHourRequest>({
    defaultValues: {
      weekDay: 0,
      from: "",
      to: "",
    },
  });

  const watchedWeekDay = watch("weekDay");

  const handleFormSubmit = async (data: CreateRushHourRequest) => {
    try {
      await onSubmit(data);
      reset();
      onCancel();
      toast.success("Rush hour created successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save rush hour");
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const validateTimeRange = (fromTime: string, toTime: string) => {
    if (!fromTime || !toTime) return true;
    return fromTime < toTime || "End time must be after start time";
  };

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-medium mb-4">Create New Rush Hour</h4>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weekDay">Weekday</Label>
            <Select
              value={watchedWeekDay?.toString()}
              onValueChange={(value) => setValue("weekDay", parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a weekday" />
              </SelectTrigger>
              <SelectContent>
                {WEEKDAYS.map((day, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.weekDay && (
              <p className="text-sm text-red-500">{errors.weekDay.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <Input
              id="from"
              type="time"
              {...register("from", {
                required: "Start time is required",
                validate: (value) => {
                  const toTime = watch("to");
                  return validateTimeRange(value, toTime);
                },
              })}
            />
            {errors.from && (
              <p className="text-sm text-red-500">{errors.from.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="time"
              {...register("to", {
                required: "End time is required",
                validate: (value) => {
                  const fromTime = watch("from");
                  return validateTimeRange(fromTime, value);
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

export default RushHourForm;
