"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Mail, Clock, CheckCircle2, Send } from "lucide-react";
import LandingFooter from "@/components/layout/LandingFooter";
import { createClient } from "@/lib/supabase/client";

function LandingNav() {
  return (
    <nav className="fixed top-0 w-full h-20 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-[0_8px_32px_rgba(123,127,239,0.08)] z-50">
      <div className="flex justify-between items-center px-6 max-w-7xl mx-auto w-full h-full">
        <Link href="/" className="active:scale-95 transition-transform">
          <Image src="/logo.png" alt="PetalBird" width={72} height={72} className="object-contain" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block text-base text-on-surface-variant hover:text-primary transition-colors">Login</Link>
          <Link href="/discover" className="bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] text-white px-6 py-2 rounded-full text-base font-semibold hover:scale-105 transition-transform duration-200 shadow-[0_4px_16px_rgba(123,127,239,0.2)]">
            Join Now
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formEnabled, setFormEnabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_settings")
      .select("contact_form_enabled")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data && data.contact_form_enabled === false) setFormEnabled(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("contact_requests").insert({
      name: form.name,
      email: form.email,
      message: form.message,
    });
    setSubmitting(false);
    if (insertError) {
      setError("Something went wrong sending your message. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="bg-surface text-on-surface flex flex-col min-h-screen relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-[#7B7FEF] opacity-5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#A78BFA] opacity-[0.03] rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3 z-0" />

      <LandingNav />

      <main className="flex-grow pt-20 relative z-10">
        {/* Hero */}
        <div className="w-full px-6 max-w-5xl mx-auto pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/40 rounded-full shadow-sm mb-6">
            <Clock size={16} className="text-[#7B7FEF]" />
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-on-surface-variant">Avg. response time: 2–4 hours</span>
          </div>
          <h1 className="font-heading text-[36px] md:text-[48px] font-bold text-on-surface leading-tight mb-4">
            Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA]">Touch</span>
          </h1>
          <p className="text-base text-on-surface-variant max-w-xl mx-auto">
            We&apos;re a real team and we read every message. Whether you have a question, a bug, or just want to say hello — we&apos;re here.
          </p>
        </div>

        <div className="w-full px-4 sm:px-6 max-w-2xl mx-auto pb-20">
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 sm:p-8 shadow-[0_8px_32px_rgba(123,127,239,0.06)]">
              {!formEnabled ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center">
                    <Mail size={28} className="text-on-surface-variant" />
                  </div>
                  <h3 className="font-heading text-[22px] font-semibold text-on-surface">Contact form temporarily unavailable</h3>
                  <p className="text-sm text-on-surface-variant max-w-sm">
                    Please email us at support@petalbird.app instead.
                  </p>
                </div>
              ) : submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7B7FEF] to-[#A78BFA] flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-white" />
                  </div>
                  <h3 className="font-heading text-[22px] font-semibold text-on-surface">Message sent!</h3>
                  <p className="text-sm text-on-surface-variant max-w-sm">
                    Thanks for reaching out, {form.name || "there"}. We&apos;ll get back to you at <span className="text-[#7B7FEF]">{form.email || "your email"}</span> within a few hours.
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }} className="mt-4 text-sm text-[#7B7FEF] font-semibold hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-heading text-[22px] font-semibold text-on-surface mb-6">Send us a message</h2>
                  {error && (
                    <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-[0.06em] mb-2">Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Alex Johnson"
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-white/60 bg-surface text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-[#7B7FEF]/50 focus:ring-2 focus:ring-[#7B7FEF]/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-[0.06em] mb-2">Email</label>
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-white/60 bg-surface text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-[#7B7FEF]/50 focus:ring-2 focus:ring-[#7B7FEF]/10 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-[0.06em] mb-2">Message</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us what's on your mind…"
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/60 bg-surface text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-[#7B7FEF]/50 focus:ring-2 focus:ring-[#7B7FEF]/10 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:scale-[1.02] transition-transform duration-200 shadow-[0_8px_32px_rgba(123,127,239,0.25)] flex items-center justify-center gap-2 self-start disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Send size={16} />
                      {submitting ? "Sending…" : "Send Message"}
                    </button>
                  </form>
                </>
              )}
          </div>
        </div>
      </main>

      <LandingFooter compact />
    </div>
  );
}
