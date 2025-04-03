'use client';

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard"); // or wherever your post-login route is
    }
  }, [status, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="bg-zinc-900/80 backdrop-blur-lg border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-xl transition-all duration-300">
        <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">Sign in to Cybernetix</h1>

        <div className="space-y-4">
          <button
            onClick={() => signIn("google")}
            className="w-full py-2 px-4 bg-white text-black rounded-md hover:bg-gray-100 transition"
          >
            Continue with Google
          </button>

          <button
            onClick={() => signIn("github")}
            className="w-full py-2 px-4 bg-black text-white border border-white rounded-md hover:bg-zinc-800 transition"
          >
            Continue with GitHub
          </button>

          <button
            onClick={() => signIn("email")}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md hover:opacity-90 transition"
          >
            Sign in with Email
          </button>
        </div>

        <p className="text-sm text-center text-zinc-400 mt-6">
          By signing in, you agree to our{" "}
          <a href="/terms" className="underline hover:text-zinc-200">Terms</a> and{" "}
          <a href="/privacy" className="underline hover:text-zinc-200">Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
}
