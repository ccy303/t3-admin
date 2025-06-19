import { PrismaAdapter } from "@auth/prisma-adapter";
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
  interface Session extends DefaultSession {
    user: {
      id: number;
      [key: string]: any; // Allows for additional properties on the user object
    } & DefaultSession["user"];
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

        console.log(user, "user");

        if (user) {
          // Convert id (and other bigint fields if needed) to string
          return {
            ...user,
            id: user.id?.toString(),
            tenant_id: user.tenant_id?.toString?.() ?? null,
            dept_id: user.dept_id?.toString?.() ?? null,
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
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user }) => {
      console.log("session", session);
      console.log("user", user);
      return {
        ...session,
        user: { ...session.user, id: user.id },
      };
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
