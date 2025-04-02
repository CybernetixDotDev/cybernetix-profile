import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard"
    },
    async session({ session, token }) {
      session.user.id = token.id!
      session.user.emailVerified = token.emailVerified ?? null
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.emailVerified = user.emailVerified ?? null
      }
      return token
    }
  },
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  debug: true,
})

export const GET = handler
export const POST = handler
