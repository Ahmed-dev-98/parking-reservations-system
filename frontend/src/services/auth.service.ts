import { ECOOKIES_KEYS } from "@/constants/cache-storage-keys";
import { EAPI } from "@/constants/routes";
import { client } from "@/lib/api";
import { CookieService } from "@/lib/cookies";
import { AuthResponse, User } from "@/types/api";

class AuthService {

    public getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;
        return CookieService.getCookie(ECOOKIES_KEYS.AUTH_TOKEN);
    }

    public setAuthToken(token: string): void {
        if (typeof window === 'undefined') return;
        CookieService.setCookie(ECOOKIES_KEYS.AUTH_TOKEN, token, {
            days: 7,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
    }

    public clearAuthToken(): void {
        if (typeof window === 'undefined') return;
        CookieService.deleteCookie(ECOOKIES_KEYS.AUTH_TOKEN);
    }

    // Decode JWT token to extract user info
    public decodeToken(token: string): User | null {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                id: payload.sub || payload.userId,
                username: payload.username,
                role: payload.role,
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    public getCurrentUser(): User | null {
        const token = this.getAuthToken();
        if (!token) return null;
        return this.decodeToken(token);
    }

    public isTokenValid(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch {
            return false;
        }
    }

    // Auth endpoints
    async login(username: string, password: string): Promise<AuthResponse> {
        const response = await client.post<AuthResponse>(EAPI.LOGIN, {
            username,
            password,
        });
        this.setAuthToken(response.data.token);
        return response.data;
    }

    logout(): void {
        this.clearAuthToken();
    }

}

export default Object.freeze(new AuthService);