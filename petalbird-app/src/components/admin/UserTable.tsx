"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { WidgetCard } from "@/components/admin/WidgetCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

type UserRow = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  is_admin: boolean;
  is_super_admin: boolean;
  is_deactivated: boolean;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Avatar({ row }: { row: UserRow }) {
  const initials = (row.display_name || row.username || "?").charAt(0).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#7B7FEF] to-[#A78BFA] flex items-center justify-center shrink-0">
      {row.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={row.avatar_url} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="text-white text-[10px] font-bold">{initials}</span>
      )}
    </div>
  );
}

export function UserTable({ variant = "full" }: { variant?: "preview" | "full" }) {
  const { profile: viewer } = useAdminAuth();
  const [rows, setRows] = useState<UserRow[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<UserRow | null>(null);
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    if (!rows) return rows;
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.display_name.toLowerCase().includes(q) || r.username.toLowerCase().includes(q)
    );
  }, [rows, query]);

  useEffect(() => {
    let cancelled = false;
    const url = variant === "preview" ? "/api/admin/users?limit=5" : "/api/admin/users";
    fetch(url)
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
  }, [variant]);

  async function performAction(id: string, action: "promote" | "demote" | "deactivate" | "reactivate") {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (json.ok) {
        setRows((prev) => prev?.map((r) => (r.id === id ? { ...r, ...json.data } : r)) ?? null);
      }
    } finally {
      setPendingId(null);
    }
  }

  const body = !rows && failed ? (
    <div className="p-8 text-center text-sm text-on-surface-variant">Couldn&apos;t load users</div>
  ) : !rows ? (
    <div className="p-8 text-center text-sm text-on-surface-variant">Loading…</div>
  ) : rows.length === 0 ? (
    <div className="p-8 text-center text-sm text-on-surface-variant">No users yet</div>
  ) : !filteredRows || filteredRows.length === 0 ? (
    <div className="p-8 text-center text-sm text-on-surface-variant">No users match &quot;{query}&quot;</div>
  ) : (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="p-3 text-xs font-semibold text-on-surface-variant w-10">Sr</th>
              <th className="p-3 text-xs font-semibold text-on-surface-variant">User</th>
              <th className="p-3 text-xs font-semibold text-on-surface-variant">Status</th>
              <th className="p-3 text-xs font-semibold text-on-surface-variant">Role</th>
              <th className="p-3 text-xs font-semibold text-on-surface-variant">Joined</th>
              <th className="p-3 text-xs font-semibold text-on-surface-variant">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {filteredRows.map((row, i) => {
              const isSelf = row.id === viewer.id;
              return (
                <tr key={row.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="p-3 text-xs text-on-surface-variant">{i + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar row={row} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">{row.display_name}</p>
                        <p className="text-xs text-on-surface-variant truncate">@{row.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <StatusBadge label={row.is_deactivated ? "Inactive" : "Active"} tone={row.is_deactivated ? "neutral" : "success"} />
                  </td>
                  <td className="p-3 text-sm text-on-surface">{row.is_admin ? "Admin" : "User"}</td>
                  <td className="p-3 text-sm text-on-surface">{formatDate(row.created_at)}</td>
                  <td className="p-3">
                    <UserRowActions
                      row={row}
                      isSelf={isSelf}
                      viewerIsSuperAdmin={viewer.is_super_admin}
                      pending={pendingId === row.id}
                      onPromote={() => performAction(row.id, row.is_admin ? "demote" : "promote")}
                      onDeactivate={() => setConfirmTarget(row)}
                      onReactivate={() => performAction(row.id, "reactivate")}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden divide-y divide-outline-variant/20">
        {filteredRows.map((row) => {
          const isSelf = row.id === viewer.id;
          return (
            <div key={row.id} className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar row={row} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-on-surface truncate">{row.display_name}</p>
                  <p className="text-xs text-on-surface-variant truncate">@{row.username}</p>
                </div>
                <StatusBadge label={row.is_deactivated ? "Inactive" : "Active"} tone={row.is_deactivated ? "neutral" : "success"} />
              </div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>{row.is_admin ? "Admin" : "User"}</span>
                <span>Joined {formatDate(row.created_at)}</span>
              </div>
              <UserRowActions
                row={row}
                isSelf={isSelf}
                viewerIsSuperAdmin={viewer.is_super_admin}
                pending={pendingId === row.id}
                onPromote={() => performAction(row.id, row.is_admin ? "demote" : "promote")}
                onDeactivate={() => setConfirmTarget(row)}
                onReactivate={() => performAction(row.id, "reactivate")}
              />
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      <WidgetCard
        title="User Management"
        moreHref={variant === "preview" ? "/admin/users" : undefined}
        moreLabel="View All Users"
        bodyClassName="p-0"
        headerExtra={
          variant === "full" && rows && rows.length > 0 ? (
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users…"
                className="h-9 w-full rounded-lg bg-surface-container-low border border-outline-variant/40 pl-8 pr-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          ) : undefined
        }
      >
        {body}
      </WidgetCard>
      <ConfirmDialog
        open={!!confirmTarget}
        onOpenChange={(open) => !open && setConfirmTarget(null)}
        title="Deactivate this user?"
        description={`${confirmTarget?.display_name ?? "This user"} will be signed out and their posts hidden. This can be reversed later.`}
        confirmLabel="Deactivate"
        destructive
        onConfirm={async () => {
          if (confirmTarget) await performAction(confirmTarget.id, "deactivate");
        }}
      />
    </>
  );
}

function UserRowActions({
  row,
  isSelf,
  viewerIsSuperAdmin,
  pending,
  onPromote,
  onDeactivate,
  onReactivate,
}: {
  row: UserRow;
  isSelf: boolean;
  viewerIsSuperAdmin: boolean;
  pending: boolean;
  onPromote: () => void;
  onDeactivate: () => void;
  onReactivate: () => void;
}) {
  if (isSelf) {
    return <span className="text-xs text-on-surface-variant">—</span>;
  }
  if (row.is_super_admin) {
    return <StatusBadge label="Protected" tone="neutral" />;
  }

  const canActOnRole = viewerIsSuperAdmin || row.is_admin;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {canActOnRole && (
        <Button
          variant="outline"
          size="xs"
          disabled={pending || !viewerIsSuperAdmin}
          title={!viewerIsSuperAdmin ? "Only a super admin can change admin status" : undefined}
          onClick={onPromote}
        >
          {row.is_admin ? "Revoke Admin" : "Make Admin"}
        </Button>
      )}
      {row.is_deactivated ? (
        <Button variant="outline" size="xs" disabled={pending} onClick={onReactivate}>
          Reactivate
        </Button>
      ) : (
        <Button variant="destructive" size="xs" disabled={pending} onClick={onDeactivate}>
          Delete
        </Button>
      )}
    </div>
  );
}
