import { client } from "@/lib/api";
import { CheckinRequest, CheckinResponse, CheckoutRequest, CheckoutResult } from "@/types/api";



class TicketService {
    async checkin(request: CheckinRequest) {
        const response = await client.post<CheckinResponse>("/tickets/checkin", request);
        return response.data;
    }


    async checkout(request: CheckoutRequest) {
        const response = await client.post<CheckoutResult>("/tickets/checkout", request);
        return response.data;
    }



}


export default Object.freeze(new TicketService());