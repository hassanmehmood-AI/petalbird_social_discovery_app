import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";

type Action = "promote" | "demote" | "deactivate" | "reactivate";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }
    const { id } = await params;

    const body = await request.json().catch(() => null);
    const action = body?.action as Action | undefined;
    if (!action || !["promote", "demote", "deactivate", "reactivate"].includes(action)) {
      return NextResponse.json({ ok: false, error: "Invalid action" }, { status: 400 });
    }

    if (id === auth.profile.id) {
      return NextResponse.json(
        { ok: false, error: "You cannot modify your own account" },
        { status: 400 }
      );
    }

    const { data: target } = await auth.supabase
      .from("profiles")
      .select("id, is_admin, is_super_admin, is_deactivated")
      .eq("id", id)
      .single();

    if (!target) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }
    if (target.is_super_admin) {
      return NextResponse.json(
        { ok: false, error: "Super admin accounts cannot be modified" },
        { status: 400 }
      );
    }

    if ((action === "promote" || action === "demote") && !auth.profile.is_super_admin) {
      return NextResponse.json(
        { ok: false, error: "Only a super admin may grant or revoke admin status" },
        { status: 403 }
      );
    }

    const patch =
      action === "promote"
        ? { is_admin: true }
        : action === "demote"
        ? { is_admin: false }
        : action === "deactivate"
        ? { is_deactivated: true, deactivated_at: new Date().toISOString() }
        : { is_deactivated: false, deactivated_at: null };

    const { data, error } = await auth.supabase
      .from("profiles")
      .update(patch)
      .eq("id", id)
      .select("id, username, display_name, avatar_url, is_admin, is_super_admin, is_deactivated, created_at")
      .single();

    if (error || !data) {
      return NextResponse.json({ ok: false, error: "Could not update user" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
