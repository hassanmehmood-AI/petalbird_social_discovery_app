"use client";

import { useEffect, useState } from "react";
import { WidgetCard } from "@/components/admin/WidgetCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type ContactRequest = {
  id: string;
  name: string;
  email: string;
  topic: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ContactRequestsList({ variant = "full" }: { variant?: "preview" | "full" }) {
  const [rows, setRows] = useState<ContactRequest[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<ContactRequest | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const limit = variant === "preview" ? 4 : 50;
    fetch(`/api/admin/contact-requests?limit=${limit}`)
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
  }, [variant]);

  function openRequest(row: ContactRequest) {
    setSelected(row);
    if (!row.is_read) {
      fetch(`/api/admin/contact-requests/${row.id}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.ok) {
            setRows((prev) => prev?.map((r) => (r.id === row.id ? { ...r, is_read: true } : r)) ?? null);
            setSelected((s) => (s && s.id === row.id ? { ...s, is_read: true } : s));
          }
        })
        .catch(() => {});
    }
  }

  async function handleDelete() {
    if (!selected) return;
    const res = await fetch(`/api/admin/contact-requests/${selected.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.ok) {
      setRows((prev) => prev?.filter((r) => r.id !== selected.id) ?? null);
      setSelected(null);
    }
  }

  return (
    <>
      <WidgetCard
        title="Contact Requests"
        moreHref={variant === "preview" ? "/admin/contact-requests" : undefined}
        bodyClassName="p-3"
      >
        {failed ? (
          <p className="text-sm text-on-surface-variant text-center py-6">Couldn&apos;t load contact requests</p>
        ) : !rows ? (
          <p className="text-sm text-on-surface-variant text-center py-6">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-6">No contact requests yet</p>
        ) : (
          <div className="space-y-1">
            {rows.map((row) => {
              const initials = row.name.charAt(0).toUpperCase();
              return (
                <button
                  key={row.id}
                  onClick={() => openRequest(row)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-on-surface truncate min-w-0 flex-1">{row.name}</p>
                      {!row.is_read && <StatusBadge label="New" tone="primary" className="ml-auto" />}
                    </div>
                    <p className="text-xs text-on-surface-variant truncate">{row.message}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </WidgetCard>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogTitle>{selected.name}</DialogTitle>
              <DialogDescription>{selected.email}</DialogDescription>
              <div className="mt-4 space-y-3">
                {selected.topic && (
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">{selected.topic}</p>
                )}
                <p className="text-sm text-on-surface whitespace-pre-wrap">{selected.message}</p>
                <p className="text-xs text-on-surface-variant">Submitted {formatDateTime(selected.created_at)}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
                  Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this contact request?"
        description="This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
