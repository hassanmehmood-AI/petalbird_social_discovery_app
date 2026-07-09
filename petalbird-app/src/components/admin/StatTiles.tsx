"use client";

import { useEffect, useState } from "react";
import { Users, Zap, FileText, Mail, type LucideIcon } from "lucide-react";

type Stats = {
  totalUsers: number;
  activeUsers7d: number;
  totalPosts: number;
  openContactRequests: number;
};

const TILES: { key: keyof Stats; label: string; icon: LucideIcon }[] = [
  { key: "totalUsers", label: "Total Users", icon: Users },
  { key: "activeUsers7d", label: "Active Users (7d)", icon: Zap },
  { key: "totalPosts", label: "Total Posts", icon: FileText },
  { key: "openContactRequests", label: "Open Contact Requests", icon: Mail },
];

export function StatTilesGrid() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.ok) setStats(json.data);
        else setFailed(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {TILES.map(({ key, label, icon: Icon }) => (
        <div
          key={key}
          className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-[0_4px_24px_rgba(123,127,239,0.06)]"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <Icon size={18} className="text-primary" />
          </div>
          <p className="text-xs font-medium text-on-surface-variant">{label}</p>
          <h3 className="text-xl font-bold font-heading text-on-surface mt-0.5">
            {failed ? "—" : stats ? stats[key].toLocaleString() : "—"}
          </h3>
        </div>
      ))}
    </div>
  );
}
