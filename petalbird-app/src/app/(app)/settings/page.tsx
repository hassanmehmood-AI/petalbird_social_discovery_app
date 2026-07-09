"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, LogOut, Shield, Bell, ChevronRight, Check, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Switch } from "@/components/ui/switch";

/* ─── Section wrapper ────────────────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(123,127,239,0.04)]">
      <div className="px-6 py-4 border-b border-outline-variant/20">
        <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">{title}</h2>
      </div>
      <div className="divide-y divide-outline-variant/10">{children}</div>
    </div>
  );
}

/* ─── Change Password ────────────────────────────────────────────────────── */
function ChangePassword() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function save() {
    if (next !== confirm) { setMsg({ type: "err", text: "Passwords don't match." }); return; }
    if (next.length < 6) { setMsg({ type: "err", text: "Password must be at least 6 characters." }); return; }
    setSaving(true); setMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: next });
    if (error) { setMsg({ type: "err", text: error.message }); }
    else { setMsg({ type: "ok", text: "Password updated successfully." }); setCurrent(""); setNext(""); setConfirm(""); setOpen(false); }
    setSaving(false);
  }

  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/60 transition-colors text-left">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Lock size={16} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-on-surface">Change Password</p>
          <p className="text-xs text-on-surface-variant mt-0.5">Update your account password</p>
        </div>
        <ChevronRight size={16} className={`text-outline transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="px-6 pb-5 space-y-3 bg-surface-container-low/30">
          <div className="relative">
            <input type={showNext ? "text" : "password"} placeholder="New password" value={next}
              onChange={(e) => setNext(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:border-primary transition-colors" />
            <button type="button" onClick={() => setShowNext(!showNext)} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline">
              {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <input type={showCurrent ? "text" : "password"} placeholder="Confirm new password" value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
          {msg && (
            <p className={`text-xs px-3 py-2 rounded-lg ${msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {msg.text}
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <button onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button onClick={save} disabled={saving || !next || !confirm}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-all">
              {saving ? "Saving…" : "Update Password"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Change Email ───────────────────────────────────────────────────────── */
function ChangeEmail() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function save() {
    if (!email.includes("@")) { setMsg({ type: "err", text: "Enter a valid email address." }); return; }
    setSaving(true); setMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ email });
    if (error) { setMsg({ type: "err", text: error.message }); }
    else { setMsg({ type: "ok", text: "Check your new email for a confirmation link." }); setEmail(""); }
    setSaving(false);
  }

  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/60 transition-colors text-left">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Mail size={16} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-on-surface">Change Email</p>
          <p className="text-xs text-on-surface-variant mt-0.5">Update your login email address</p>
        </div>
        <ChevronRight size={16} className={`text-outline transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="px-6 pb-5 space-y-3 bg-surface-container-low/30">
          <input type="email" placeholder="New email address" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
          {msg && (
            <p className={`text-xs px-3 py-2 rounded-lg ${msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {msg.text}
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <button onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button onClick={save} disabled={saving || !email}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-all">
              {saving ? "Sending…" : "Update Email"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Toggle row ─────────────────────────────────────────────────────────── */
function ToggleRow({ icon: Icon, label, description, checked, onToggle }: {
  icon: React.ElementType; label: string; description: string; checked: boolean; onToggle: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-on-surface">Settings</h1>
        <p className="text-sm text-on-surface-variant mt-1">Manage your account and preferences</p>
      </div>

      {/* Account */}
      <Section title="Account">
        <ChangePassword />
        <ChangeEmail />
      </Section>



      {/* Sign out */}
      <Section title="Session">
        <button onClick={handleSignOut} disabled={signingOut}
          className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-50 transition-colors text-left group">
          <div className="w-9 h-9 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center shrink-0 transition-colors">
            <LogOut size={16} className="text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-500">{signingOut ? "Signing out…" : "Sign Out"}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Sign out of your account</p>
          </div>
        </button>
      </Section>
    </div>
  );
}
