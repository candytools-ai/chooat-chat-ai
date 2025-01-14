import { compare } from "bcrypt-ts";
import NextAuth, { User, Session } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/resend";

import { getUser, getUserById, db } from "@/db/queries";

import { accounts, sessions, user, verificationTokens } from "@/db/schema";
import { generateUUID } from "@/lib/utils";

const SESSION_MAX_AGE = 30 * 24 * 60 * 60;
const adapter = DrizzleAdapter(db, {
    usersTable: user,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
});
const sessionOptions = {
    strategy: "database",
    maxAge: SESSION_MAX_AGE,
    updateAge: 7 * 24 * 60 * 60, // (seconds)
};

function removeExtraUserInfo(user: any) {
    delete user.password;
    delete user.paid;
    delete user.emailVerified;
    delete user.updatedAt;
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: "/login",
        newUser: "/",
    },
    adapter,
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_SECRET || "",
        }),
        ResendProvider({
            apiKey: process.env.RESEND_API_KEY,
            from: process.env.EMAIL_FROM,
            // sendVerificationRequest,
        }),
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            async authorize({ email, password }: any) {
                let users: any[] = await getUser(email);
                if (users.length === 0) {
                    throw new Error("Invalid credentials.");
                }
                let passwordsMatch = await compare(
                    password,
                    users[0].password!
                );
                if (passwordsMatch) {
                    removeExtraUserInfo(users[0]);
                    return users[0] as any;
                }
            },
        }),
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            let isLoggedIn = !!auth?.user;
            let isOnChat = nextUrl.pathname.startsWith("/chat");

            if (isLoggedIn) {
                return Response.redirect(
                    new URL("/", nextUrl as unknown as URL)
                );
            }

            if (isOnChat) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            if (isLoggedIn) {
                return Response.redirect(
                    new URL("/", nextUrl as unknown as URL)
                );
            }

            return true;
        },
        async jwt({ token, user, account }) {
            if (
                account?.provider !== "credentials" ||
                sessionOptions.strategy === "jwt"
            )
                return token;

            const session = await adapter.createSession!({
                sessionToken: generateUUID(),
                userId: user.id as string,
                expires: new Date(Date.now() + sessionOptions.maxAge * 1000),
            });

            token.sessionId = session.sessionToken;

            return token;
        },
        async session({
            session,
            token,
        }: {
            session: any; //ExtendedSession;
            token: any;
        }) {
            if (session && session.user) {
                removeExtraUserInfo(session.user);
            }

            return session;
        },
    },
    jwt: {
        async encode(params) {
            return params.token?.sessionId as string; //??  encode(params);
        },
    },
});
