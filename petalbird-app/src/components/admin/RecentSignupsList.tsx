"use client";

import { useEffect, useState } from "react";
import { WidgetCard } from "@/components/admin/WidgetCard";

type UserRow = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function RecentSignupsList() {
  const [rows, setRows] = useState<UserRow[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/users?limit=5")
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.ok) setRows(json.data);
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
    <WidgetCard title="Recent Signups" bodyClassName="p-3">
      {failed ? (
        <p className="text-sm text-on-surface-variant text-center py-6">Couldn&apos;t load signups</p>
      ) : !rows ? (
        <p className="text-sm text-on-surface-variant text-center py-6">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-on-surface-variant text-center py-6">No signups yet</p>
      ) : (
        <div className="space-y-1">
          {rows.map((row) => {
            const initials = (row.display_name || row.username || "?").charAt(0).toUpperCase();
            return (
              <div key={row.id} className="flex items-center gap-3 p-3 rounded-lg">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#7B7FEF] to-[#A78BFA] flex items-center justify-center shrink-0">
                  {row.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-xs font-bold">{initials}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-on-surface truncate">{row.display_name}</p>
                  <p className="text-xs text-on-surface-variant truncate">@{row.username}</p>
                </div>
                <span className="text-xs text-on-surface-variant shrink-0">{formatDate(row.created_at)}</span>
              </div>
            );
          })}
        </div>
      )}
    </WidgetCard>
  );
}
