
export interface User {
    id: string;
    username: string;
    role: 'admin' | 'employee';
}
export interface AuthResponse {
    user: User;
    token: string;
}

export interface WSSubscribeMessage {
    type: 'subscribe' | 'unsubscribe';
    payload: {
        gateId: string;
    };
}

export interface Gate {
    id: string;
    name: string;
    zoneIds: string[];
    location: string;
}

export interface Zone {
    id: string;
    name: string;
    categoryId: string;
    gateIds: string[];
    totalSlots: number;
    occupied: number;
    free: number;
    reserved: number;
    availableForVisitors: number;
    availableForSubscribers: number;
    rateNormal: number;
    rateSpecial: number;
    open: boolean;
}

export interface CheckinRequest {
    gateId: string;
    zoneId: string;
    type: 'visitor' | 'subscriber';
    subscriptionId?: string;
}
export interface CheckoutResult {
    ticketId: string;
    checkinAt: string;
    checkoutAt: string;
    durationHours: number;
    breakdown: BreakdownSegment[];
    amount: number;
    zoneState: Zone;
}export interface CheckoutRequest {
    ticketId: string;
    forceConvertToVisitor?: boolean;
}
export interface CheckinResponse {
    ticket: Ticket;
    zoneState: Zone;
}export interface BreakdownSegment {
    from: string;
    to: string;
    hours: number;
    rateMode: 'normal' | 'special';
    rate: number;
    amount: number;
}

export interface CheckoutResult {
    ticketId: string;
    checkinAt: string;
    checkoutAt: string;
    durationHours: number;
    breakdown: BreakdownSegment[];
    amount: number;
    zoneState: Zone;
}
export interface Ticket {
    id: string;
    type: 'visitor' | 'subscriber';
    zoneId: string;
    gateId: string;
    checkinAt: string;
    checkoutAt?: string;
}
