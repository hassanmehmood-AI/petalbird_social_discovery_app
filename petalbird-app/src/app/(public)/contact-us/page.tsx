"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Mail, X, Globe, Clock, CheckCircle2, Send, MapPin } from "lucide-react";
import LandingFooter from "@/components/layout/LandingFooter";

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

const contactChannels = [
  {
    icon: Mail,
    label: "General Support",
    value: "support@petalbird.app",
    description: "Account issues, bugs, and general questions",
    href: "mailto:support@petalbird.app",
  },
  {
    icon: Mail,
    label: "Safety & Reports",
    value: "safety@petalbird.app",
    description: "Harassment, impersonation, and policy violations",
    href: "mailto:safety@petalbird.app",
  },
  {
    icon: Mail,
    label: "Press & Partnerships",
    value: "press@petalbird.app",
    description: "Media enquiries and brand collaborations",
    href: "mailto:press@petalbird.app",
  },
];

const topics = [
  "Account & Login",
  "Ratings & Style Score",
  "Messaging",
  "Premium & Billing",
  "Privacy & Safety",
  "Bug Report",
  "Feature Request",
  "Press / Partnership",
  "Other",
];

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

        <div className="w-full px-6 max-w-5xl mx-auto pb-20 grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Contact channels */}
            {contactChannels.map(({ icon: Icon, label, value, description, href }) => (
              <a key={label} href={href} className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-[0_4px_16px_rgba(123,127,239,0.05)] flex gap-4 hover:shadow-[0_8px_32px_rgba(123,127,239,0.10)] transition-all group">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon size={18} className="text-[#7B7FEF]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{label}</p>
                  <p className="text-sm text-[#7B7FEF] font-medium">{value}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{description}</p>
                </div>
              </a>
            ))}

            {/* Social */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-[0_4px_16px_rgba(123,127,239,0.05)]">
              <p className="text-sm font-semibold text-on-surface mb-4">Follow us</p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors group">
                  <X size={16} className="text-[#7B7FEF]" />
                </a>
                <a href="#" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors group">
                  <Globe size={16} className="text-[#7B7FEF]" />
                </a>
              </div>
              <p className="text-xs text-on-surface-variant mt-3">@petalbird on X & the web</p>
            </div>

            {/* Office */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-[0_4px_16px_rgba(123,127,239,0.05)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-[#7B7FEF]" />
                </div>
                <p className="text-sm font-semibold text-on-surface">Headquarters</p>
              </div>
              <p className="text-sm text-on-surface-variant leading-6">
                PetalBird Inc.<br />
                340 Pine Street, Suite 800<br />
                San Francisco, CA 94104<br />
                United States
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-8 shadow-[0_8px_32px_rgba(123,127,239,0.06)]">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7B7FEF] to-[#A78BFA] flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-white" />
                  </div>
                  <h3 className="font-heading text-[22px] font-semibold text-on-surface">Message sent!</h3>
                  <p className="text-sm text-on-surface-variant max-w-sm">
                    Thanks for reaching out, {form.name || "there"}. We&apos;ll get back to you at <span className="text-[#7B7FEF]">{form.email || "your email"}</span> within a few hours.
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", topic: "", message: "" }); }} className="mt-4 text-sm text-[#7B7FEF] font-semibold hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-heading text-[22px] font-semibold text-on-surface mb-6">Send us a message</h2>
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
                      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-[0.06em] mb-2">Topic</label>
                      <select
                        required
                        value={form.topic}
                        onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/60 bg-surface text-on-surface text-sm focus:outline-none focus:border-[#7B7FEF]/50 focus:ring-2 focus:ring-[#7B7FEF]/10 transition-all appearance-none"
                      >
                        <option value="">Select a topic…</option>
                        {topics.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
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
                      className="bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:scale-[1.02] transition-transform duration-200 shadow-[0_8px_32px_rgba(123,127,239,0.25)] flex items-center justify-center gap-2 self-start"
                    >
                      <Send size={16} />
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
