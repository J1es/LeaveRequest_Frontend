/**
 * JWT based authentication using React Router cookie session storage.
 */
import { createContext, createCookieSessionStorage, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { getSafeRedirectUrl } from "./url";
import { AUTH_ENDPOINT } from "./api";

export interface User {
    id: number;
    email: string;
    role: string;
    token: string;
}

export interface JWTPayload {
    token?: {
        id: number;
        email: string;
        role: {
            id: number;
            name: string;
        };
    };
    exp?: number;
}

export interface LoginResult {
    token: string;
    payload: JWTPayload;
}

// @see: https://reactrouter.com/api/utils/createCookieSessionStorage
export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: process.env.SESSION_COOKIE_NAME || "__session",
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        // @see https://reactrouter.com/explanation/sessions-and-cookies#signing-cookies
        secrets: process.env.SESSION_SECRETS?.split(",") || [],
        // Set the cookie to secure (HTTPS only) in production
        secure: process.env.NODE_ENV === "production",
    },
});

export const authContext = createContext<User | null>(null);

// Decode JWT token
function parseJwt(token: string): JWTPayload | null {
    if (!token || typeof token !== "string") {
        return null;
    }

    try {
        // Extract the JWT payload following the header
        const base64Url = token.split(".")[1];

        // Ensure the payoad is compatible with Base64
        // replacing '-' with '+' and '_' with '/'
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

        // Parse JSON from Base64
        const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export async function startSession(request: Request, token: string): Promise<{ sessionCookie: string }> {
    const session = await sessionStorage.getSession(
        request.headers.get("Cookie")
    );

    session.set("token", token);

    const sessionCookie = await sessionStorage.commitSession(session);
    return { sessionCookie };
}

export async function endSession(request: Request): Promise<{ sessionCookie: string }> {
    const session = await sessionStorage.getSession(
        request.headers.get("Cookie")
    );

    const sessionCookie = await sessionStorage.destroySession(session);

    return { sessionCookie };
}

// Exchange user auth credentials for a JWT token
export async function loginWithCredentials(email: string, password: string): Promise<LoginResult> {
    const response = await fetch(AUTH_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const token = await response.text();

    if (!response.ok) {
        throw new Error(`Login failed (Status: ${response.status})`);
    }

    const payload = parseJwt(token);

    if (!payload) {
        throw new Error("Login response contained an invalid JWT");
    }

    return { token, payload };
}

// Get the user from the current Request's session
export async function getUserFromRequest(request: Request): Promise<{ user: User | null }> {
    const session = await sessionStorage.getSession(
        request.headers.get("Cookie")
    );

    const token = session.get("token");

    if (!token || typeof token !== "string") {
        return { user: null };
    }

    const payload = parseJwt(token);
    if (!payload?.token?.email || !payload?.token?.role?.name) {
        return { user: null };
    }

    // Check JWT expiry
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
        // Consider implementing a refresh token mechanism here if your API supports it
        return { user: null };
    }

    return {
        user: {
            id: payload.token.id,
            email: payload.token.email,
            role: payload.token.role.name,
            token,
        },
    };
}

// React Router Middleware to enforce authentication on protected routes
export async function authMiddleware({ request, context }: LoaderFunctionArgs | ActionFunctionArgs, next?: () => Promise<Response>): Promise<Response | void> {
    const { user } = await getUserFromRequest(request);
    context.set(authContext, user);

    if (user) {
        return next?.();
    }

    const { sessionCookie } = await endSession(request);
    const redirectTo = getSafeRedirectUrl(request);
    throw redirect(
        `/login?redirectTo=${encodeURIComponent(redirectTo)}`,
        { headers: { "Set-Cookie": sessionCookie } }
    );
}