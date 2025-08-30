import { adminClient } from "@/lib/api";
import {
    Category,
    UpdateCategoryRequest,
    ParkingStateReport,
    RushHour,
    CreateRushHourRequest,
    Vacation,
    CreateVacationRequest,
    UpdateZoneOpenRequest
} from "@/types/api";

class AdminService {

    // Categories management
    async getCategories(): Promise<Category[]> {
        const response = await adminClient.get<Category[]>("/master/categories");
        return response.data;
    }

    async updateCategory(id: string, request: UpdateCategoryRequest): Promise<Category> {
        const response = await adminClient.put<Category>(`/admin/categories/${id}`, request);
        return response.data;
    }

    // Parking state report
    async getParkingStateReport(): Promise<ParkingStateReport[]> {
        const response = await adminClient.get<ParkingStateReport[]>("/admin/reports/parking-state");
        return response.data;
    }

    // Zone management
    async updateZoneOpen(id: string, request: UpdateZoneOpenRequest): Promise<void> {
        await adminClient.put(`/admin/zones/${id}/open`, request);
    }

    async createRushHour(request: CreateRushHourRequest): Promise<RushHour> {
        const response = await adminClient.post<RushHour>("/admin/rush-hours", request);
        return response.data;
    }

    async createVacation(request: CreateVacationRequest): Promise<Vacation> {
        const response = await adminClient.post<Vacation>("/admin/vacations", request);
        return response.data;
    }

}

export default Object.freeze(new AdminService());
