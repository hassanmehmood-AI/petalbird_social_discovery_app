import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }

    const status = request.nextUrl.searchParams.get("status");
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 0, 1), 200) : null;

    let query = auth.supabase
      .from("posts")
      .select(
        "id, caption, image_url, status, created_at, user_id, author:profiles!posts_user_id_fkey(username, display_name, avatar_url)"
      )
      .order("created_at", { ascending: false });

    if (status === "pending" || status === "published") {
      query = query.eq("status", status);
    }
    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ ok: false, error: "Could not load posts" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
