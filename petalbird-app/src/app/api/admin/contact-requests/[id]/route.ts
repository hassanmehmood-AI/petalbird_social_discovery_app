import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }
    const { id } = await params;

    const { data, error } = await auth.supabase
      .from("contact_requests")
      .select("id, name, email, topic, message, is_read, created_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ ok: false, error: "Contact request not found" }, { status: 404 });
    }

    if (!data.is_read) {
      // Silently mark as read as a side effect of viewing — serverless functions can be
      // torn down right after the response, so this is awaited rather than fire-and-forget.
      await auth.supabase.from("contact_requests").update({ is_read: true }).eq("id", id);
      data.is_read = true;
    }

    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }
    const { id } = await params;

    const { error } = await auth.supabase.from("contact_requests").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ ok: false, error: "Could not delete contact request" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, data: { id } });
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
