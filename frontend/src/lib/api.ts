import { AuthResponse } from '@/types/api';
import axios, { AxiosInstance, } from 'axios';


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add auth token interceptor
        this.client.interceptors.request.use((config) => {
            const token = this.getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Add response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.clearAuthToken();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('authToken');
    }

    private setAuthToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem('authToken', token);
    }

    private clearAuthToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('authToken');
    }

    // Auth endpoints
    async login(username: string, password: string): Promise<AuthResponse> {
        const response = await this.client.post<AuthResponse>('/auth/login', {
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

export const apiClient = new ApiClient();
