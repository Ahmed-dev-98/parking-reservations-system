import { client } from "@/lib/api";
import { Subscription } from "@/types/api";

class SubscriptionService {
    async getSubscription(subscriptionId: string) {
        const response = await client.get<Subscription>(`/subscriptions/${subscriptionId}`);
        return response.data;
    }
}

export default Object.freeze(new SubscriptionService());
