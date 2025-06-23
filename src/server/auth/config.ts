// import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface User {
        id?: string | undefined; // Use string if you convert bigint to string
        user_name: string | null;
        // Add other fields as necessary
    }

    interface Session {
        user: User & DefaultSession["user"];
    }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 */

export const authConfig = {
    providers: [
        // DiscordProvider,
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {},
                password: {},
            },
            async authorize(credentials: any, req) {
                const user = await db.sysUser.findFirst({
                    where: {
                        user_name: credentials?.username,
                        password: credentials?.password,
                    },
                });

                if (user) {
                    const { password, ...other } = user;
                    // Convert id (and other bigint fields if needed) to string
                    return {
                        ...other,
                        id: user.id.toString(), // Ensure id is a string
                    };
                }

                return null;
            },
        }),

        /**
         * ...add more providers here.
         *
         * Most other providers require a bit more work than the Discord provider. For example, the
         * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
         * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
         *
         * @see https://next-auth.js.org/providers/github
         */
    ],
    // adapter: PrismaAdapter(db),
    callbacks: {
        authorized: async ({ auth }) => {
            return !!auth;
            // You can add custom logic here to check if the user is authorized
            // For example, you can check if the user has a specific role or permission
            // For now, we will just return true to allow all authenticated users
        },
        // session: async ({ session, token }) => {
        //   // console.log("session", session);
        //   // console.log("session.user", session.user);
        //   // console.log("token", token);
        // },
        jwt: async ({ token, user }) => {
            token.user = user;
            return token;
        },
    },
    pages: {
        signIn: "/auth/signin",
        // signOut: "/auth/signout",
        // error: "/auth/error",
        // verifyRequest: "/auth/verify-request",
        // newUser: null, // Will disable the new account creation screen
    },
} satisfies NextAuthConfig;
