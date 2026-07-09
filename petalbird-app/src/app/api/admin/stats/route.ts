import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }
    const { supabase } = auth;

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [totalUsers, totalPosts, openContactRequests, recentPosters, recentRaters] =
      await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase
          .from("contact_requests")
          .select("id", { count: "exact", head: true })
          .eq("is_read", false),
        supabase.from("posts").select("user_id").gte("created_at", sevenDaysAgo),
        supabase.from("ratings").select("rater_id").gte("created_at", sevenDaysAgo),
      ]);

    const activeUserIds = new Set<string>([
      ...(recentPosters.data ?? []).map((r) => r.user_id as string),
      ...(recentRaters.data ?? []).map((r) => r.rater_id as string),
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        totalUsers: totalUsers.count ?? 0,
        activeUsers7d: activeUserIds.size,
        totalPosts: totalPosts.count ?? 0,
        openContactRequests: openContactRequests.count ?? 0,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
