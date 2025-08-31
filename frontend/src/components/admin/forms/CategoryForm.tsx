/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateCategoryRequest, Category } from "@/types/api";
import { toast } from "sonner";

interface CategoryFormProps {
  editingCategory?: Category | null;
  onSubmit: (data: CreateCategoryRequest, categoryId?: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  editingCategory,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCategoryRequest>({
    defaultValues: {
      name: editingCategory?.name || "",
      rateNormal: editingCategory?.rateNormal || 0,
      rateSpecial: editingCategory?.rateSpecial || 0,
    },
  });

  const handleFormSubmit = async (data: CreateCategoryRequest) => {
    try {
      await onSubmit(data, editingCategory?.id);
      reset();
      onCancel();
      toast.success(
        editingCategory
          ? "Category updated successfully"
          : "Category created successfully"
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save category");
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-medium mb-4">
   Edit Category
      </h4>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              placeholder="Category name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>


          <div className="space-y-2">
            <Label htmlFor="rateNormal">Normal Rate</Label>
            <Input
              id="rateNormal"
              type="number"
              step="0.01"
              {...register("rateNormal", {
                required: "Normal rate is required",
                min: { value: 0, message: "Rate must be positive" },
                valueAsNumber: true,
              })}
              placeholder="0.00"
            />
            {errors.rateNormal && (
              <p className="text-sm text-red-500">
                {errors.rateNormal.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rateSpecial">Special Rate</Label>
            <Input
              id="rateSpecial"
              type="number"
              step="0.01"
              {...register("rateSpecial", {
                required: "Special rate is required",
                min: { value: 0, message: "Rate must be positive" },
                valueAsNumber: true,
              })}
              placeholder="0.00"
            />
            {errors.rateSpecial && (
              <p className="text-sm text-red-500">
                {errors.rateSpecial.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-2 mt-4">
          <Button type="submit" disabled={isLoading}>
           Update
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
