import { QUERY_KEYS } from "@/constants/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import gateService from "./gate.service";
import zoneService from "./zone.service";
import { CheckinRequest, CheckoutRequest, Zone, UpdateCategoryRequest, CreateRushHourRequest, CreateVacationRequest, UpdateZoneOpenRequest, Category } from "@/types/api";
import ticketService from "./ticket.service";
import subscriptionService from "./subscription.service";
import adminService from "./admin.service";






// Master data hooks
export const useGates = () => {
    return useQuery({
        queryKey: QUERY_KEYS.gates,
        queryFn: () => {
            return gateService.getGates();
        },

    });
};

export const useZones = (gateId?: string) => {
    return useQuery({
        queryKey: gateId ? [...QUERY_KEYS.zones, gateId] : QUERY_KEYS.zones,
        queryFn: () => {
            return zoneService.getZones(gateId);
        },
    });
};

export const useCheckin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: CheckinRequest) => ticketService.checkin(request),
        onSuccess: (data) => {
            // Invalidate all zone queries to refresh zone state
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.zones, exact: false });

            // Also invalidate parking state report for admin dashboard
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParkingState });

            // Update specific zone if we have gate context
            if (data.zoneState) {
                const queryCache = queryClient.getQueryCache();
                const zoneQueries = queryCache.findAll({
                    queryKey: QUERY_KEYS.zones,
                    exact: false
                });

                zoneQueries.forEach(query => {
                    if (query.state.data) {
                        queryClient.setQueryData(query.queryKey, (oldData: Zone[]) => {
                            if (!oldData) return oldData;
                            return oldData.map(zone =>
                                zone.id === data.zoneState.id ? data.zoneState : zone
                            );
                        });
                    }
                });

                // Also update parking state report cache with the zone state
                queryClient.setQueryData(QUERY_KEYS.adminParkingState, (oldData: any[]) => {
                    if (!oldData) return oldData;
                    return oldData.map(zone =>
                        zone.id === data.zoneState.id ? { ...zone, ...data.zoneState } : zone
                    );
                });
            }
        },
    });
};

export const useCheckout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: CheckoutRequest) => ticketService.checkout(request),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.zones, exact: false });

            // Also invalidate parking state report for admin dashboard
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParkingState });

            // Update zone state if available in response
            if (data?.zoneState) {
                const queryCache = queryClient.getQueryCache();
                const zoneQueries = queryCache.findAll({
                    queryKey: QUERY_KEYS.zones,
                    exact: false
                });

                zoneQueries.forEach(query => {
                    if (query.state.data) {
                        queryClient.setQueryData(query.queryKey, (oldData: Zone[]) => {
                            if (!oldData) return oldData;
                            return oldData.map(zone =>
                                zone.id === data.zoneState.id ? data.zoneState : zone
                            );
                        });
                    }
                });

                // Also update parking state report cache
                queryClient.setQueryData(QUERY_KEYS.adminParkingState, (oldData: any[]) => {
                    if (!oldData) return oldData;
                    return oldData.map(zone =>
                        zone.id === data.zoneState.id ? { ...zone, ...data.zoneState } : zone
                    );
                });
            }
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

// Admin hooks

export const useCategories = () => {
    return useQuery({
        queryKey: QUERY_KEYS.adminCategories,
        queryFn: () => adminService.getCategories(),
    });
};


export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: string; request: UpdateCategoryRequest }) =>
            adminService.updateCategory(id, request),
        onSuccess: (_, { id, request }) => {
            // Update categories cache first
            queryClient.setQueryData<Category[]>(
                QUERY_KEYS.adminCategories,
                (oldData) => {
                    if (!oldData) return oldData;
                    return oldData.map(category =>
                        category.id === id
                            ? {
                                ...category,
                                name: request.name ?? category.name,
                                description: request.description ?? category.description,
                                rateNormal: request.rateNormal ?? category.rateNormal,
                                rateSpecial: request.rateSpecial ?? category.rateSpecial
                            }
                            : category
                    );
                }
            );

            // Update zones that belong to this category with new rates
            if (request.rateNormal !== undefined || request.rateSpecial !== undefined) {
                // Update all zone queries (both base and gate-specific)
                const queryCache = queryClient.getQueryCache();
                const zoneQueries = queryCache.findAll({
                    queryKey: QUERY_KEYS.zones,
                    exact: false
                });

                zoneQueries.forEach(query => {
                    if (query.state.data) {
                        queryClient.setQueryData(query.queryKey, (oldData: Zone[]) => {
                            if (!oldData) return oldData;
                            return oldData.map(zone =>
                                zone.categoryId === id
                                    ? {
                                        ...zone,
                                        rateNormal: request.rateNormal ?? zone.rateNormal,
                                        rateSpecial: request.rateSpecial ?? zone.rateSpecial
                                    }
                                    : zone
                            );
                        });
                    }
                });
            }

            // Invalidate queries to ensure fresh data on next fetch
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminCategories });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.zones, exact: false });
        },
    });
};


export const useParkingStateReport = () => {
    return useQuery({
        queryKey: QUERY_KEYS.adminParkingState,
        queryFn: () => adminService.getParkingStateReport(),
        staleTime: 0, // Always consider data stale to ensure updates work
        refetchOnWindowFocus: true, // Refetch when window gains focus
    });
};

export const useUpdateZoneOpen = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: string; request: UpdateZoneOpenRequest }) =>
            adminService.updateZoneOpen(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParkingState });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.zones, exact: false });
        },
    });
};



export const useCreateRushHour = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: CreateRushHourRequest) => adminService.createRushHour(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminRushHours });
        },
    });
};


export const useCreateVacation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: CreateVacationRequest) => adminService.createVacation(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminVacations });
        },
    });
};

