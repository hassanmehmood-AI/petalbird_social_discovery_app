"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    router.push("/discover");
    router.refresh();
  }

  return (
    <div className="font-sans text-on-surface min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-surface">
      {/* ── Animated blob background ───────────────────────────────────── */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7B7FEF] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-[#A78BFA] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-primary-container rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-4000" />

      {/* ── Main card ──────────────────────────────────────────────────── */}
      <main className="w-full max-w-[1000px] mx-auto z-10 flex flex-col md:flex-row bg-white/70 backdrop-blur-xl border border-white/40 rounded-[24px] overflow-hidden shadow-[0_8px_32px_rgba(123,127,239,0.08)]">

        {/* ── Left: Image + branding (desktop only) ──────────────────── */}
        <div
          className="w-full md:w-1/2 relative min-h-[300px] md:min-h-[600px] hidden md:block"
          style={{ backgroundColor: "#E8E9FD" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#7B7FEF]/30 via-[#C4C6FA]/40 to-[#e8f0ff]" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white w-full">
            <h1 className="font-heading text-[48px] leading-[56px] tracking-[-0.02em] font-bold mb-2 drop-shadow-md">
              PetalBird
            </h1>
            <p className="text-[20px] leading-7 font-semibold text-white/90 max-w-sm drop-shadow-sm">
              Premium Social Discovery.
            </p>
          </div>
        </div>

        {/* ── Right: Login form ───────────────────────────────────────── */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/60">
          {/* Mobile-only brand */}
          <div className="mb-8 md:hidden flex justify-center">
            <Image src="/logo.png" alt="PetalBird" width={72} height={72} className="object-contain" />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-heading text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] tracking-[-0.01em] font-semibold text-on-surface mb-2">
              Welcome back
            </h2>
            <p className="text-base leading-6 text-on-surface-variant">
              Please enter your details to sign in.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                className="block text-[20px] leading-7 font-semibold text-on-surface mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute inset-y-0 left-3 my-auto text-outline pointer-events-none"
                />
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-white/40 rounded-full text-base leading-6 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-primary transition-shadow outline-none"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-[20px] leading-7 font-semibold text-on-surface mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute inset-y-0 left-3 my-auto text-outline pointer-events-none"
                />
                <input
                  className="w-full pl-10 pr-10 py-3 bg-surface-container-low border border-white/40 rounded-full text-base leading-6 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-primary transition-shadow outline-none"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary transition-colors focus:outline-none"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* Options row */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="h-4 w-4 rounded border-outline text-primary focus:ring-primary bg-surface-container-low"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                />
                <span className="text-sm leading-5 text-on-surface-variant select-none">
                  Remember for 30 days
                </span>
              </label>
              <Link
                href="#"
                className="text-sm leading-5 font-semibold text-primary hover:text-[#A78BFA] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              className="w-full py-3 px-4 bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] hover:opacity-90 text-white text-[20px] font-semibold rounded-full shadow-[0_8px_32px_rgba(123,127,239,0.2)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm leading-5 text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:text-[#A78BFA] transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
