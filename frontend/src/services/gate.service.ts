import { EAPI } from "@/constants/routes";
import { client } from "@/lib/api";
import { Gate } from "@/types/api";


class GateService {

    async getGates(): Promise<Gate[]> {
        const response = await client.get<Gate[]>(EAPI.GATES);
        return response.data;
    }
}

export default Object.freeze(new GateService());