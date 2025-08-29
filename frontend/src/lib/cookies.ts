export class CookieService {
    static getCookie(name: string): string | null {
        if (typeof window === 'undefined') return null;

        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    }
    static setCookie(
        name: string,
        value: string,
        options: {
            days?: number;
            path?: string;
            domain?: string;
            secure?: boolean;
            sameSite?: 'strict' | 'lax' | 'none';
        } = {}
    ): void {
        if (typeof window === 'undefined') return;

        const {
            days = 7,
            path = '/',
            domain,
            secure = false,
            sameSite = 'lax'
        } = options;

        let cookieString = `${name}=${encodeURIComponent(value)}`;

        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            cookieString += `; expires=${date.toUTCString()}`;
        }

        cookieString += `; path=${path}`;

        if (domain) {
            cookieString += `; domain=${domain}`;
        }

        if (secure) {
            cookieString += '; secure';
        }

        cookieString += `; samesite=${sameSite}`;

        document.cookie = cookieString;
    }
    static deleteCookie(name: string, path: string = '/'): void {
        if (typeof window === 'undefined') return;

        document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    }
    static hasCookie(name: string): boolean {
        return this.getCookie(name) !== null;
    }
}
