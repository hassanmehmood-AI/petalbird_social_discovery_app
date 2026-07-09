import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";

type Range = "today" | "week" | "month";

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function buildBuckets(range: Range) {
  const now = new Date();
  const buckets: { start: Date; end: Date; label: string }[] = [];

  if (range === "today") {
    const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    for (let h = 0; h < 24; h++) {
      const start = new Date(dayStart.getTime() + h * 60 * 60 * 1000);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      buckets.push({ start, end, label: `${String(h).padStart(2, "0")}:00` });
    }
  } else if (range === "week") {
    const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    for (let d = 6; d >= 0; d--) {
      const start = new Date(dayStart.getTime() - d * 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      buckets.push({ start, end, label: WEEKDAY[start.getUTCDay()] });
    }
  } else {
    const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    for (let d = 29; d >= 0; d--) {
      const start = new Date(dayStart.getTime() - d * 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      buckets.push({ start, end, label: `${MONTH[start.getUTCMonth()]} ${start.getUTCDate()}` });
    }
  }

  return buckets;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }
    const { supabase } = auth;

    const rangeParam = request.nextUrl.searchParams.get("range");
    const range: Range = rangeParam === "week" || rangeParam === "month" ? rangeParam : "today";

    const buckets = buildBuckets(range);
    const windowStart = buckets[0].start.toISOString();

    const [posts, ratings, signups] = await Promise.all([
      supabase.from("posts").select("created_at").gte("created_at", windowStart),
      supabase.from("ratings").select("created_at").gte("created_at", windowStart),
      supabase.from("profiles").select("created_at").gte("created_at", windowStart),
    ]);

    const counts = buckets.map(() => ({ posts: 0, ratings: 0, signups: 0 }));

    function tally(rows: { created_at: string }[] | null, key: "posts" | "ratings" | "signups") {
      for (const row of rows ?? []) {
        const t = new Date(row.created_at).getTime();
        const idx = buckets.findIndex((b) => t >= b.start.getTime() && t < b.end.getTime());
        if (idx !== -1) counts[idx][key]++;
      }
    }
    tally(posts.data, "posts");
    tally(ratings.data, "ratings");
    tally(signups.data, "signups");

    let peakIndex = 0;
    let totalForRange = 0;
    const resultBuckets = buckets.map((b, i) => {
      const total = counts[i].posts + counts[i].ratings + counts[i].signups;
      totalForRange += total;
      if (total > counts[peakIndex].posts + counts[peakIndex].ratings + counts[peakIndex].signups) {
        peakIndex = i;
      }
      return {
        label: b.label,
        bucketStart: b.start.toISOString(),
        posts: counts[i].posts,
        ratings: counts[i].ratings,
        signups: counts[i].signups,
        total,
      };
    });

    return NextResponse.json({
      ok: true,
      data: { range, buckets: resultBuckets, peakIndex, totalForRange },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
