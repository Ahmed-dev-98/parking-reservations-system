import { NextRequest, NextResponse } from 'next/server';

// Helper function to decode JWT token
function decodeToken(token: string) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload.sub || payload.userId,
            username: payload.username,
            role: payload.role,
        };
    } catch (error) {
        return null;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookies or local storage (we'll use cookies for middleware)
    const token = request.cookies.get('authToken')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '');

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/', '/api'];

    // Check if current path is public
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(route + '/')
    );

    // If accessing login page and user is authenticated, redirect based on role
    if (pathname === '/login' && token) {
        const user = decodeToken(token);
        if (user) {
            if (user.role === 'admin') {
                return NextResponse.redirect(new URL('/admin', request.url));
            } else if (user.role === 'employee') {
                return NextResponse.redirect(new URL('/checkpoint', request.url));
            }
        }
    }

    // If not a public route and no token, redirect to login
    if (!isPublicRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If token exists, decode it to check role-based access
    if (token && !isPublicRoute) {
        const user = decodeToken(token);

        if (!user) {
            // Invalid token, redirect to login
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('authToken');
            return response;
        }

        // Role-based route protection
        if (pathname.startsWith('/admin') && user.role !== 'admin') {
            // Admin routes - only admins allowed
            return NextResponse.redirect(new URL('/checkpoint', request.url));
        }

        if (pathname.startsWith('/checkpoint') && user.role !== 'employee') {
            // Employee routes - only employees allowed
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
