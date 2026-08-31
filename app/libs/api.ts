import { authContext, endSession, type User } from "./auth";
import { type RouterContextProvider, data } from "react-router";

export interface ApiRequestOptions {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string;
    headers?: HeadersInit;
}

export interface AuthenticatedApiRequestOptions extends Omit<ApiRequestOptions, "token"> {}

const BASE_URL = process.env.API_BASE_URL || "http://localhost:8900";

export const AUTH_ENDPOINT = `${BASE_URL}/api/login`;

/**
 * API fetcher supporting URL, method, body, and custom headers.
 * 
 * @param url Relative path (e.g. "/lists") or full URL
 * @param options Request options including method, body, token, headers
 */
export async function apiRequest(url: string, options: ApiRequestOptions = {}): Promise<Response> {
    const { method = "GET", body, token, headers: customHeaders } = options;

    const fullUrl = url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;

    const headers = new Headers(customHeaders);

    if (!headers.has("Content-Type") && body !== undefined) {
        headers.set("Content-Type", "application/json");
    }
    
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(fullUrl, {
        method,
        headers,
        body: body !== undefined ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
    });
}

/**
 * Authenticated API fetcher that extracts the bearer token from the React Router context.
 * 
 * @param context React Router context (e.g. from loader or action args)
 * @param url Relative path or full URL
 * @param options Request options including method and body
 */
export async function authenticatedApiRequest(
    context: Readonly<RouterContextProvider>,
    url: string,
    options: AuthenticatedApiRequestOptions = {}
): Promise<Response> {
    const user = context.get(authContext) as User | null;
    const token = user?.token;

    return apiRequest(url, {
        ...options,
        token,
    });
}