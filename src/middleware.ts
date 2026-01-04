import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;

    const isAuthPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";
    const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");

    if (isAuthPage) {
        if (isLoggedIn) {
            return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return;
    }

    if (isDashboardPage && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
    }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
