import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import argon2 from "argon2";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userId: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.userId || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { userId: credentials.userId },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await argon2.verify(
          user.passwordHash,
          credentials.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: String(user.id),
          name: user.userId,
          email: null,
          image: null,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false;

      if (account.provider === "google" || account.provider === "discord") {
        const oauthUserId =
          user.email ?? `${account.provider}:${account.providerAccountId}`;

        await prisma.user.upsert({
          where: {
            userId: oauthUserId,
          },
          update: {},
          create: {
            userId: oauthUserId,
            passwordHash: null,
          },
        });

        user.name = oauthUserId;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};