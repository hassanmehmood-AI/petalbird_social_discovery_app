import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }
    const { id } = await params;

    const body = await request.json().catch(() => null);
    const status = body?.status;
    if (status !== "pending" && status !== "published") {
      return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
    }

    const { data, error } = await auth.supabase
      .from("posts")
      .update({ status })
      .eq("id", id)
      .select("id, status")
      .single();

    if (error || !data) {
      return NextResponse.json({ ok: false, error: "Could not update post" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
