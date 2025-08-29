import { EROUTES } from '@/constants/routes';
import AuthService from '@/services/auth.service';
import axios, { AxiosInstance, } from 'axios';


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
    public client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add auth token interceptor
        this.client.interceptors.request.use((config) => {
            const token = AuthService.getAuthToken();
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
                    AuthService.clearAuthToken();
                    if (typeof window !== 'undefined') {
                        window.location.href = EROUTES.LOGIN;
                    }
                }
                return Promise.reject(error);
            }
        );
    }


}

export const { client } = new ApiClient();
