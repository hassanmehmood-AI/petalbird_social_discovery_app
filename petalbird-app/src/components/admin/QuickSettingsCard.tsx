"use client";

import { useEffect, useState } from "react";
import { UserPlus, ShieldCheck, Eye, MailCheck, type LucideIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { WidgetCard } from "@/components/admin/WidgetCard";

type Settings = {
  allow_signups: boolean;
  post_approval_required: boolean;
  public_profiles: boolean;
  contact_form_enabled: boolean;
};

const ROWS: { key: keyof Settings; icon: LucideIcon; label: string; description: string }[] = [
  { key: "allow_signups", icon: UserPlus, label: "Allow Signups", description: "New user registrations" },
  { key: "post_approval_required", icon: ShieldCheck, label: "Post Approval Required", description: "Manual review required" },
  { key: "public_profiles", icon: Eye, label: "Public Profiles", description: "Visible to non-members" },
  { key: "contact_form_enabled", icon: MailCheck, label: "Contact Form Enabled", description: "Enable site-wide inquiry" },
];

export function QuickSettingsCard() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [pending, setPending] = useState<keyof Settings | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && json.ok) setSettings(json.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleToggle(key: keyof Settings, next: boolean) {
    if (!settings) return;
    const previous = settings[key];
    setSettings({ ...settings, [key]: next });
    setPending(key);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: next }),
      });
      const json = await res.json();
      if (!json.ok) {
        setSettings((s) => (s ? { ...s, [key]: previous } : s));
      }
    } catch {
      setSettings((s) => (s ? { ...s, [key]: previous } : s));
    } finally {
      setPending(null);
    }
  }

  return (
    <WidgetCard title="Quick Settings" className="h-full">
      <div className="flex flex-col justify-between h-full divide-y divide-outline-variant/10">
        {ROWS.map(({ key, icon: Icon, label, description }) => (
          <div key={key} className="flex items-center gap-4 px-6 py-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-on-surface">{label}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
            </div>
            <Switch
              checked={settings ? settings[key] : false}
              disabled={!settings || pending === key}
              onCheckedChange={(next) => handleToggle(key, next)}
            />
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
