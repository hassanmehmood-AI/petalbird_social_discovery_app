"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupsAllowed, setSignupsAllowed] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_settings")
      .select("allow_signups")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data && data.allow_signups === false) setSignupsAllowed(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data: settings } = await supabase
      .from("site_settings")
      .select("allow_signups")
      .eq("id", 1)
      .single();
    if (settings && settings.allow_signups === false) {
      setSignupsAllowed(false);
      setLoading(false);
      setError("Signups are currently closed.");
      return;
    }
    const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "_");
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name, username },
      },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    // If session is null, Supabase requires email confirmation
    if (!data.session) {
      setError("Check your email and click the confirmation link, then sign in.");
      return;
    }
    // Backup: upsert profile in case the DB trigger was slow or failed
    if (data.user) {
      await supabase.from("profiles").upsert(
        { id: data.user.id, username, display_name: name },
        { onConflict: "id" }
      );
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

        {/* ── Left: Branding panel (desktop only) ────────────────────── */}
        <div
          className="w-full md:w-1/2 relative min-h-[300px] md:min-h-[640px] hidden md:block"
          style={{ backgroundColor: "#E8E9FD" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#7B7FEF]/30 via-[#C4C6FA]/40 to-[#e8f0ff]" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />

          {/* Decorative floating cards */}
          <div className="absolute top-16 left-8 right-8 space-y-3">
            {[
              { label: "Appeal Rating", value: "9.4", sub: "Top 5% this week" },
              { label: "New Ratings",   value: "+12", sub: "In the last hour"  },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-lg">
                  {card.value}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{card.label}</p>
                  <p className="text-white/70 text-xs">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 p-8 text-white w-full">
            <h1 className="font-heading text-[48px] leading-[56px] tracking-[-0.02em] font-bold mb-2 drop-shadow-md">
              Join PetalBird
            </h1>
            <p className="text-[20px] leading-7 font-semibold text-white/90 max-w-sm drop-shadow-sm">
              Start receiving genuine aesthetic feedback today.
            </p>
          </div>
        </div>

        {/* ── Right: Sign up form ─────────────────────────────────────── */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/60">
          {/* Mobile-only brand */}
          <div className="mb-6 md:hidden flex justify-center">
            <Image src="/logo.png" alt="PetalBird" width={72} height={72} className="object-contain" />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-heading text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] tracking-[-0.01em] font-semibold text-on-surface mb-2">
              Create account
            </h2>
            <p className="text-base leading-6 text-on-surface-variant">
              Join the community and start getting rated.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          {!signupsAllowed ? (
            <div className="px-4 py-6 bg-surface-container-low border border-outline-variant/30 rounded-xl text-center">
              <p className="text-sm font-semibold text-on-surface mb-1">Signups are currently closed</p>
              <p className="text-sm text-on-surface-variant">
                Please check back later, or{" "}
                <Link href="/login" className="text-primary font-semibold hover:text-[#A78BFA] transition-colors">
                  sign in
                </Link>{" "}
                if you already have an account.
              </p>
            </div>
          ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full name */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <User size={20} className="absolute inset-y-0 left-3 my-auto text-outline pointer-events-none" />
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-white/40 rounded-full text-base text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-primary transition-shadow outline-none"
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail size={20} className="absolute inset-y-0 left-3 my-auto text-outline pointer-events-none" />
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-white/40 rounded-full text-base text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-primary transition-shadow outline-none"
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
              <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute inset-y-0 left-3 my-auto text-outline pointer-events-none" />
                <input
                  className="w-full pl-10 pr-10 py-3 bg-surface-container-low border border-white/40 rounded-full text-base text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-primary transition-shadow outline-none"
                  id="password"
                  name="password"
                  placeholder="Create a password"
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

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute inset-y-0 left-3 my-auto text-outline pointer-events-none" />
                <input
                  className="w-full pl-10 pr-10 py-3 bg-surface-container-low border border-white/40 rounded-full text-base text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-primary transition-shadow outline-none"
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="Repeat your password"
                  required
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary transition-colors focus:outline-none"
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                className="mt-0.5 h-4 w-4 rounded border-outline text-primary focus:ring-primary bg-surface-container-low shrink-0"
                name="terms"
                required
                type="checkbox"
              />
              <span className="text-sm text-on-surface-variant select-none">
                I agree to the{" "}
                <Link href="#" className="text-primary font-semibold hover:text-[#A78BFA] transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary font-semibold hover:text-[#A78BFA] transition-colors">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit */}
            <button
              className="w-full py-3 px-4 bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] hover:opacity-90 text-white text-base font-semibold rounded-full shadow-[0_8px_32px_rgba(123,127,239,0.2)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
          )}

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-[#A78BFA] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
