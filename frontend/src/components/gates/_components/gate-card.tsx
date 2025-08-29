import React from "react";
import { Gate } from "@/types/api";
import { useRouter } from "next/navigation";
import { EROUTES } from "@/constants/routes";

const GateCard = ({ gate }: { gate: Gate }) => {
  const router = useRouter();
  const handleNavigate = () => {
    router.push(EROUTES.GATE.replace(":id", gate.id));
  };
  return (
    <div
      className="flex flex-col gap-2 p-4 cursor-pointer border border-border rounded-md bg-card hover:bg-accent hover:border-accent-foreground"
      onClick={handleNavigate}
    >
      <h3 className="text-lg font-bold text-card-foreground">{gate.name}</h3>
      <p className="text-sm text-muted-foreground">{gate.location}</p>
      {gate.zoneIds.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-card-foreground">Zones</p>
          <div className="grid grid-cols-3 gap-2">
            {gate.zoneIds.map((zone) => (
              <p key={zone} className="text-sm text-muted-foreground">
                {zone}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GateCard;
