import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";

const PATCHABLE_KEYS = [
  "allow_signups",
  "post_approval_required",
  "public_profiles",
  "contact_form_enabled",
] as const;

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }
    const { data, error } = await auth.supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      return NextResponse.json({ ok: false, error: "Could not load settings" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
    }

    const patch: Record<string, boolean> = {};
    for (const key of PATCHABLE_KEYS) {
      if (key in body) {
        if (typeof body[key] !== "boolean") {
          return NextResponse.json({ ok: false, error: `${key} must be a boolean` }, { status: 400 });
        }
        patch[key] = body[key];
      }
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ ok: false, error: "No valid fields to update" }, { status: 400 });
    }

    const { data, error } = await auth.supabase
      .from("site_settings")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", 1)
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json({ ok: false, error: "Could not update settings" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
