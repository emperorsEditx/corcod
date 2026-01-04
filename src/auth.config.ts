import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
                token.permissions = (user as any).permissions;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
                (session.user as any).permissions = token.permissions;
            }
            return session;
        },
    },
    providers: [], // Add empty providers array to satisfy types, real providers in auth.ts
    secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
