import { EAPI } from "@/constants/routes";
import { client } from "@/lib/api";
import { Zone } from "@/types/api";


class ZoneService {

    async getZones(gateId?: string): Promise<Zone[]> {
        const response = await client.get<Zone[]>(EAPI.ZONES, { params: { gateId } });
        return response.data;
    }
}

export default Object.freeze(new ZoneService());