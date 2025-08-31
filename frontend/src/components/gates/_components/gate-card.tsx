import React from "react";
import { Gate } from "@/types/api";
import { useRouter } from "next/navigation";
import { EROUTES } from "@/constants/routes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight, Layers } from "lucide-react";

const GateCard = ({ gate }: { gate: Gate }) => {
  const router = useRouter();
  const handleNavigate = () => {
    router.push(EROUTES.GATE.replace(":id", gate.id));
  };

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-border bg-card group"
      onClick={handleNavigate}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-blue-500 transition-colors">
                {gate.name}
              </h3>
              <p className="text-sm text-muted-foreground">{gate.location}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {gate.zoneIds.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Parking Zones ({gate.zoneIds.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {gate.zoneIds.slice(0, 6).map((zone) => (
                <Badge
                  key={zone}
                  variant="secondary"
                  className="text-xs bg-muted hover:bg-muted/80"
                >
                  {zone}
                </Badge>
              ))}
              {gate.zoneIds.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{gate.zoneIds.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {gate.zoneIds.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No zones available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GateCard;
