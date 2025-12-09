// Authentication disabled for local development
// Uncomment the lines below to enable authentication in production

// export { default } from "next-auth/middleware";
// export const config = { matcher: ["/"] };

// For now, no authentication is required
export function middleware() {
    return;
}

export const config = { matcher: [] };
