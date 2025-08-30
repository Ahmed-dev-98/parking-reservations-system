import { client } from "@/lib/api";
import { CheckinRequest, CheckinResponse, CheckoutRequest, CheckoutResult, Ticket } from "@/types/api";

class TicketService {
    async checkin(request: CheckinRequest) {
        const response = await client.post<CheckinResponse>("/tickets/checkin", request);
        return response.data;
    }

    async checkout(request: CheckoutRequest) {
        const response = await client.post<CheckoutResult>("/tickets/checkout", request);
        return response.data;
    }

    async getTicket(ticketId: string) {
        const response = await client.get<Ticket>(`/tickets/${ticketId}`);
        return response.data;
    }
}


export default Object.freeze(new TicketService());