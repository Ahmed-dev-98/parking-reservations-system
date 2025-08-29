"use client";
import { useGates } from "@/services/queries";
import React from "react";
import GateCard from "./_components/gate-card";

const Gates = () => {
  const { data: gates, isLoading, error } = useGates();
  console.log(gates);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {gates?.map((gate) => (
        <GateCard key={gate.id} gate={gate} />
      ))}
    </div>
  );
};

export default Gates;
