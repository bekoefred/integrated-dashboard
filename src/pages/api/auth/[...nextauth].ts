import NextAuth, {
  Account,
  NextAuthOptions,
  Profile,
  SessionOptions,
  User,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  MERGDATA_API,
  NEXT_PUBLIC_GOOGLE_ID,
  NEXT_PUBLIC_GOOGLE_SECRET,
} from "../../../../config/default";
import GoogleProvider from "next-auth/providers/google";
import { AdapterUser } from "next-auth/adapters";
import { redirect } from "next/navigation";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Email",
          placeholder: "eg:john@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${MERGDATA_API}/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const user = await res.json();

        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
    GoogleProvider({
      id: "google",
      clientId: NEXT_PUBLIC_GOOGLE_ID as string,
      clientSecret: NEXT_PUBLIC_GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as {
        name?: string;
        email?: string;
        image?: string;
      };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async signIn({
      user,
      account,
      profile,
    }: {
      account: Account | null;
      profile?: Profile | undefined;
      user: User | AdapterUser;
    }) {
      if (account?.provider === "google") {
        let prf = profile as any;
        if (prf?.email_verified && prf?.email.endsWith("@farmerline.co")) {
          console.log("match==>");

          const res = await fetch(`${MERGDATA_API}/login/social`, {
            method: "POST",
            body: JSON.stringify({
              username: user.email,
              sso_id: account?.providerAccountId,
            }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          const data = await res.json();

          if (res.ok && data) {
            return true;
          }
        }
        return false;
      }
      return true;
    },
  },
};

export default NextAuth(authOptions);
