export { auth as middleware } from "~/server/auth";

export const config = {
    matcher: ["/admin/:path*", "/"],
};
