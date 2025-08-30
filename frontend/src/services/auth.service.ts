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



    public isTokenValid(): boolean {
        const token = this.getAuthToken();
        if (!token) return false;
        const payload = JSON.parse(token);
        const currentTime = Date.now();
        const isTokenValid = payload.exp > currentTime;
        return isTokenValid;
    }

    // Auth endpoints
    async login(username: string, password: string): Promise<AuthResponse> {
        const response = await client.post<AuthResponse>(EAPI.LOGIN, {
            username,
            password,
        });
        // we will create our token by merging user data with exp date of 7 days

        const tokenizedUser = {
            ...response.data.user,
            exp: Date.now() + 7 * 24 * 60 * 60 * 1000
        }
        this.setAuthToken(JSON.stringify(tokenizedUser));
        return response.data;
    }

    logout(): void {
        this.clearAuthToken();
    }

}

export default Object.freeze(new AuthService);