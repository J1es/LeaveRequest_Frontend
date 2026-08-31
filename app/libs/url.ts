export function getSafeRedirectUrl(request: Request): string {
    const requestUrl = new URL(request.url);

    if (request.method === "GET") {
        return requestUrl.pathname + requestUrl.search;
    }

    // Handle other request methods (POST, PUT, DELETE, etc.) by using the Referer header
    // because we want to redirect back to the page that initiated the request, not the
    // current request URL.
    const referer = request.headers.get("Referer");
    if (!referer) {
        return "/";
    }

    try {
        const refererUrl = new URL(referer);

        if (refererUrl.origin !== requestUrl.origin) {
            return "/";
        }

        return refererUrl.pathname + refererUrl.search;
    } catch {
        return "/";
    }
}

export function ensureRelativeUrl(url: string, defaultUrl: string = "/"): string {
    if (url.startsWith("/") && !url.startsWith("//")) {
        return url;
    }
    
    return defaultUrl;
}