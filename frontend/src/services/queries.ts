import { QUERY_KEYS } from "@/constants/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import gateService from "./gate.service";
import zoneService from "./zone.service";
import { CheckinRequest, CheckoutRequest, Zone } from "@/types/api";
import ticketService from "./ticket.service";
import subscriptionService from "./subscription.service";






// Master data hooks
export const useGates = () => {
    return useQuery({
        queryKey: QUERY_KEYS.gates,
        queryFn: () => {
            return gateService.getGates();
        },

    });
};

export const useZones = () => {
    return useQuery({
        queryKey: QUERY_KEYS.zones,
        queryFn: () => {
            return zoneService.getZones();
        },
    });
};

export const useCheckin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: CheckinRequest) => ticketService.checkin(request),
        onSuccess: (data) => {
            // Invalidate zones to refresh zone state
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.zones });
            // Update specific zone if we have gate context
            if (data.zoneState) {
                queryClient.setQueryData(
                    QUERY_KEYS.zones,
                    (oldData: Zone[] | undefined) => {
                        if (!oldData) return oldData;
                        return oldData.map(zone =>
                            zone.id === data.zoneState.id ? data.zoneState : zone
                        );
                    }
                );
            }
        },
    });
};

export const useCheckout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: CheckoutRequest) => ticketService.checkout(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.zones });
        },
    });
};

export const useTicket = (ticketId: string) => {
    return useQuery({
        queryKey: ['ticket', ticketId],
        queryFn: () => ticketService.getTicket(ticketId),
        enabled: !!ticketId,
    });
};

export const useSubscription = (subscriptionId: string) => {
    return useQuery({
        queryKey: ['subscription', subscriptionId],
        queryFn: () => subscriptionService.getSubscription(subscriptionId),
        enabled: !!subscriptionId,
    });
};