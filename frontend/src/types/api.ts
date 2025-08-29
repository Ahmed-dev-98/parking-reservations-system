
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
