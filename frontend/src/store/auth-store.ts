import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '@/types/api';
import AuthService from '@/services/auth.service';

interface AuthState {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isEmployee: boolean;
}

interface AuthActions {
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
    initialize: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                user: null,
                loading: true,
                isAuthenticated: false,
                isAdmin: false,
                isEmployee: false,

                // Actions
                setUser: (user: User | null) => {
                    set({
                        user,
                        isAuthenticated: !!user,
                        isAdmin: user?.role === 'admin',
                        isEmployee: user?.role === 'employee',
                    });
                },

                setLoading: (loading: boolean) => {
                    set({ loading });
                },

                login: async (username: string, password: string) => {
                    try {
                        set({ loading: true });
                        const response = await AuthService.login(username, password);
                        get().setUser(response.user);
                    } catch (error: unknown) {
                        // Only log unexpected errors, not auth failures
                        if (error && typeof error === 'object' && 'response' in error) {
                            const axiosError = error as { response?: { status?: number } };
                            if (axiosError.response?.status !== 401) {
                                console.error('Login failed:', error);
                            }
                        } else {
                            console.error('Login failed:', error);
                        }
                        throw error;
                    } finally {
                        set({ loading: false });
                    }
                },

                logout: () => {
                    AuthService.logout();
                    get().setUser(null);
                },

                checkAuth: () => {
                    if (AuthService.isTokenValid()) {
                        const token = AuthService.getAuthToken();
                        if (token) {
                            try {
                                const userData = JSON.parse(token);
                                get().setUser({
                                    id: userData.id,
                                    username: userData.username,
                                    role: userData.role,
                                });
                            } catch (error) {
                                console.error('Error parsing auth token:', error);
                                AuthService.clearAuthToken();
                                get().setUser(null);
                            }
                        }
                    } else {
                        AuthService.clearAuthToken();
                        get().setUser(null);
                    }
                },

                initialize: () => {
                    get().checkAuth();
                    set({ loading: false });
                },
            }),
            {
                name: 'auth-storage',
                partialize: (state) => ({ user: state.user }), // Only persist user data
            }
        ),
        {
            name: 'auth-store',
        }
    )
);

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsAdmin = () => useAuthStore((state) => state.isAdmin);
export const useIsEmployee = () => useAuthStore((state) => state.isEmployee);
export const useAuthLoading = () => useAuthStore((state) => state.loading);

// Action hooks - separate to avoid infinite loops
export const useLogin = () => useAuthStore((state) => state.login);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useCheckAuth = () => useAuthStore((state) => state.checkAuth);
