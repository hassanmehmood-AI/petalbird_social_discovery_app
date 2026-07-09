"use client";

import { useEffect, useState } from "react";
import { WidgetCard } from "@/components/admin/WidgetCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PostRow = {
  id: string;
  caption: string | null;
  status: "pending" | "published";
  created_at: string;
  author: { username: string; display_name: string; avatar_url: string | null } | null;
};

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function PostModerationList({ variant = "full" }: { variant?: "preview" | "full" }) {
  const [rows, setRows] = useState<PostRow[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "published">("all");

  useEffect(() => {
    let cancelled = false;
    const limit = variant === "preview" ? 3 : 30;
    const statusQuery = variant === "full" && filter !== "all" ? `&status=${filter}` : "";
    fetch(`/api/admin/posts?limit=${limit}${statusQuery}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.ok) {
          setRows(json.data);
          setFailed(false);
        } else {
          setFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [variant, filter]);

  async function toggleStatus(row: PostRow) {
    const nextStatus = row.status === "pending" ? "published" : "pending";
    setPendingId(row.id);
    try {
      const res = await fetch(`/api/admin/posts/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (json.ok) {
        setRows((prev) => prev?.map((r) => (r.id === row.id ? { ...r, status: nextStatus } : r)) ?? null);
      }
    } finally {
      setPendingId(null);
    }
  }

  return (
    <WidgetCard
      title="Post Moderation"
      moreHref={variant === "preview" ? "/admin/posts" : undefined}
      headerExtra={
        variant === "full" ? (
          <div className="flex bg-surface-container-low p-1 rounded-lg">
            {(["all", "pending", "published"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-md capitalize transition-colors",
                  filter === f ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        ) : undefined
      }
      bodyClassName="p-4"
    >
      {failed ? (
        <p className="text-sm text-on-surface-variant text-center py-6">Couldn&apos;t load posts</p>
      ) : !rows ? (
        <p className="text-sm text-on-surface-variant text-center py-6">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-on-surface-variant text-center py-6">No posts yet</p>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className="group p-3 rounded-lg border border-transparent hover:border-outline-variant/30 hover:bg-surface-container-low transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="text-sm font-semibold text-on-surface truncate flex-1 min-w-0">
                  {row.caption?.trim() || "Untitled post"}
                </p>
                <StatusBadge
                  label={row.status === "pending" ? "Pending" : "Published"}
                  tone={row.status === "pending" ? "warning" : "success"}
                />
              </div>
              <p className="text-xs text-on-surface-variant mb-3">
                By <span className="text-on-surface font-medium">{row.author?.display_name ?? "Unknown"}</span> ·{" "}
                {relativeTime(row.created_at)}
              </p>
              <div className="flex gap-2">
                <Button
                  variant={row.status === "pending" ? "default" : "outline"}
                  size="xs"
                  className="flex-1"
                  disabled={pendingId === row.id}
                  onClick={() => toggleStatus(row)}
                >
                  {row.status === "pending" ? "Approve" : "Unpublish"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetCard>
  );
}
