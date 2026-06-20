"use client";

import { useState, useEffect } from "react";
import {
  Star, TrendingUp, TrendingDown, Minus, Award, Users, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface RatingReceived {
  id: string;
  score: number;
  createdAt: string;
  post: { id: string; imageUrl: string | null };
  rater: { id: string; username: string; displayName: string; avatarUrl: string | null };
}

interface RatingGiven {
  id: string;
  score: number;
  createdAt: string;
  post: {
    id: string;
    imageUrl: string | null;
    creator: { id: string; username: string; displayName: string; avatarUrl: string | null };
  };
}

interface DayBar { date: string; score: number; count: number }

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function gradeLabel(score: number) {
  if (score >= 9) return "You're Legendary";
  if (score >= 8) return "You're Stunning";
  if (score >= 7) return "You're Attractive";
  if (score >= 6) return "You're Looking Good";
  return "Keep Growing";
}

function avg(arr: number[]) {
  return arr.length ? +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, iconColor }: {
  icon: React.ElementType; label: string; value: string; sub?: string; iconColor: string;
}) {
  return (
    <div className="card-glass rounded-2xl p-4 md:p-6 bg-white/60 flex flex-col gap-2 md:gap-3">
      <div className={cn("w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0", iconColor)}>
        <Icon size={18} className="text-white" />
      </div>
      <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">{label}</p>
      <p className="text-2xl md:text-[28px] font-bold text-on-surface leading-none">{value}</p>
      {sub && <p className="text-[11px] md:text-xs text-on-surface-variant">{sub}</p>}
    </div>
  );
}

/* ─── Rating History Chart ───────────────────────────────────────────────── */
function MiniChart({ history }: { history: DayBar[] }) {
  const active = history.filter(d => d.count > 0);
  if (active.length === 0) {
    return (
      <div className="card-glass rounded-2xl p-6 bg-white/60 flex items-center justify-center min-h-[160px] text-sm text-on-surface-variant">
        Not enough data yet
      </div>
    );
  }
  const max = Math.max(...active.map(d => d.score));
  const first = active[0].score;
  const last = active[active.length - 1].score;
  const diff = +(last - first).toFixed(1);

  return (
    <div className="card-glass rounded-2xl p-6 bg-white/60">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-on-surface">Rating Over Time</h3>
        {diff !== 0 && (
          <div className={cn(
            "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
            diff > 0 ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"
          )}>
            {diff > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {diff > 0 ? "+" : ""}{diff} this week
          </div>
        )}
      </div>
      <div className="flex items-end gap-2 h-32 px-1">
        {history.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            {d.count > 0 ? (
              <div
                className="w-full relative cursor-pointer group"
                style={{ height: `${(d.score / max) * 100}%` }}
                title={`${d.score} (${d.count} raters)`}
              >
                {/* Top cap — lightest, creates the 3-D "top face" */}
                <div
                  className="absolute inset-x-0 top-0 rounded-t-sm z-10"
                  style={{
                    height: 6,
                    background: "linear-gradient(to right, #C4C6FA, #A78BFA)",
                    boxShadow: "0 -2px 4px rgba(167,139,250,0.4)",
                  }}
                />
                {/* Front face */}
                <div
                  className="absolute inset-x-0 bottom-0 rounded-t-sm overflow-hidden group-hover:brightness-110 transition-all"
                  style={{ top: 6, background: "linear-gradient(to bottom, #A78BFA 0%, #7B7FEF 100%)" }}
                >
                  {/* Gloss highlight */}
                  <div
                    className="absolute inset-x-0 top-0 h-1/2"
                    style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.28), transparent)" }}
                  />
                </div>
                {/* Right side face — darker, simulates depth */}
                <div
                  className="absolute top-0 right-0 bottom-0 rounded-r-sm"
                  style={{
                    width: 5,
                    background: "linear-gradient(to bottom, #5A5DC0, #3D40A0)",
                    boxShadow: "2px 0 6px rgba(0,61,128,0.35)",
                  }}
                />
                {/* Score tooltip on hover */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#111]/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {d.score}
                </div>
              </div>
            ) : (
              <div
                className="w-full rounded-t-sm"
                style={{ height: "10%", background: "rgba(0,0,0,0.06)" }}
              />
            )}
            <span className="text-[9px] text-outline font-semibold">{d.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Score Distribution ─────────────────────────────────────────────────── */
function ScoreDistribution({ ratings }: { ratings: RatingReceived[] }) {
  const BANDS = [
    { label: "Excellent (9–10)", min: 9, max: 10, front: "linear-gradient(to right, #7B7FEF, #A78BFA)", top: "#60d9ff",   side: "#5A5DC0" },
    { label: "Good (7–8)",       min: 7, max: 8,  front: "linear-gradient(to right, #8b5cf6, #a78bfa)", top: "#c4b5fd",   side: "#5b21b6" },
    { label: "Average (5–6)",    min: 5, max: 6,  front: "linear-gradient(to right, #A78BFA, #38d9a9)", top: "#67e8f9",   side: "#0e7490" },
    { label: "Low (1–4)",        min: 1, max: 4,  front: "linear-gradient(to right, #ff7eb3, #ff6b6b)", top: "#fda4af",   side: "#be185d" },
  ];
  const total = ratings.length;
  return (
    <div className="card-glass rounded-2xl p-6 bg-white/60 space-y-5">
      <h3 className="text-sm font-semibold text-on-surface">Score Breakdown</h3>
      {total === 0 ? (
        <p className="text-sm text-on-surface-variant text-center py-4">No ratings yet</p>
      ) : BANDS.map((b) => {
        const count = ratings.filter(r => r.score >= b.min && r.score <= b.max).length;
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={b.label}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-on-surface-variant">{b.label}</span>
              <span className="text-xs font-bold text-on-surface">
                {count} <span className="text-outline font-normal">({Math.round(pct)}%)</span>
              </span>
            </div>
            {/* 3-D bar track — recessed look */}
            <div
              className="relative rounded-full overflow-visible"
              style={{
                height: 18,
                background: "rgba(0,0,0,0.07)",
                boxShadow: "inset 0 3px 6px rgba(0,0,0,0.18), inset 0 -1px 0 rgba(255,255,255,0.6)",
              }}
            >
              {pct > 0 && (
                <div
                  className="absolute left-0 top-0 bottom-0 rounded-full overflow-hidden transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: b.front,
                    boxShadow: `2px 3px 8px rgba(0,0,0,0.22)`,
                  }}
                >
                  {/* Top gloss — cylinder highlight */}
                  <div
                    className="absolute inset-x-0 top-0 h-1/2 rounded-t-full"
                    style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.38), transparent)" }}
                  />
                  {/* Bottom shadow — cylinder shadow */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/3 rounded-b-full"
                    style={{ background: "rgba(0,0,0,0.12)" }}
                  />
                  {/* Right edge cap — depth face */}
                  <div
                    className="absolute top-1 bottom-1 right-0 w-1.5 rounded-full"
                    style={{ background: b.side, opacity: 0.7 }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Rater Item ─────────────────────────────────────────────────────────── */
function RaterItem({ rating }: { rating: RatingReceived }) {
  const trend = rating.score >= 8.5 ? "up" : rating.score < 6 ? "down" : "flat";
  const initials = rating.rater.displayName.slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/80 transition-colors border border-transparent hover:border-white/40">
      {/* Post thumbnail */}
      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/60 shadow-sm">
        {rating.post.imageUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={rating.post.imageUrl} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-[#C4C6FA]/60 to-[#7B7FEF]/20" />}
      </div>
      {/* Rater avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C4C6FA] to-[#7B7FEF]/60 flex items-center justify-center text-white font-bold text-sm shrink-0 border-2 border-white shadow-sm overflow-hidden">
        {rating.rater.avatarUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={rating.rater.avatarUrl} alt="" className="w-full h-full object-cover" />
          : initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-on-surface">{rating.rater.displayName}</p>
        <p className="text-xs text-on-surface-variant">@{rating.rater.username}</p>
      </div>
      <div className={cn(
        "px-2.5 py-1 rounded-lg text-sm font-bold shrink-0",
        rating.score >= 8.5 ? "bg-primary/10 text-primary" :
        rating.score < 6    ? "bg-red-50 text-red-500" :
        "bg-surface-container-high text-on-surface-variant"
      )}>
        {rating.score}/10
      </div>
      {trend === "up"   && <TrendingUp   size={12} className="text-green-500 shrink-0" />}
      {trend === "down" && <TrendingDown size={12} className="text-red-400  shrink-0" />}
      {trend === "flat" && <Minus        size={12} className="text-outline  shrink-0" />}
      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-outline shrink-0">
        {timeAgo(rating.createdAt)}
      </span>
    </div>
  );
}

/* ─── Given Item ─────────────────────────────────────────────────────────── */
function GivenItem({ rating }: { rating: RatingGiven }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/80 transition-colors border border-transparent hover:border-white/40">
      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-surface-container-low border border-white/40">
        {rating.post.imageUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={rating.post.imageUrl} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-[#C4C6FA]/60 to-[#7B7FEF]/20" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-on-surface truncate">{rating.post.creator.displayName}</p>
        <p className="text-xs text-on-surface-variant">@{rating.post.creator.username}</p>
      </div>
      <div className="px-2.5 py-1 rounded-lg text-sm font-bold bg-primary/10 text-primary shrink-0">
        {rating.score}/10
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-outline shrink-0">
        {timeAgo(rating.createdAt)}
      </span>
    </div>
  );
}

/* ─── Empty state ────────────────────────────────────────────────────────── */
function Empty({ text }: { text: string }) {
  return (
    <div className="py-12 flex flex-col items-center gap-3 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center">
        <Star size={28} className="text-outline" />
      </div>
      <p className="text-sm font-semibold text-on-surface">No ratings yet</p>
      <p className="text-xs text-on-surface-variant max-w-xs">{text}</p>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function RatingsPage() {
  const [tab, setTab] = useState<"received" | "given">("received");
  const [loading, setLoading] = useState(true);
  const [received, setReceived] = useState<RatingReceived[]>([]);
  const [given, setGiven] = useState<RatingGiven[]>([]);
  const [history, setHistory] = useState<DayBar[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      /* ── Ratings received ──────────────────────────── */
      const { data: myPosts } = await supabase
        .from("posts").select("id").eq("user_id", user.id);

      if (myPosts && myPosts.length > 0) {
        const postIds = myPosts.map((p: any) => p.id);
        const { data: rData } = await supabase
          .from("ratings")
          .select("id, score, created_at, post:post_id ( id, image_url ), rater:rater_id ( id, username, display_name, avatar_url )")
          .in("post_id", postIds)
          .order("created_at", { ascending: false });

        if (rData) {
          const mapped: RatingReceived[] = rData.map((r: any) => ({
            id: r.id,
            score: r.score,
            createdAt: r.created_at,
            post: { id: r.post.id, imageUrl: r.post.image_url ?? null },
            rater: {
              id: r.rater.id,
              username: r.rater.username,
              displayName: r.rater.display_name,
              avatarUrl: r.rater.avatar_url ?? null,
            },
          }));
          setReceived(mapped);

          /* 7-day history */
          const days: Record<string, { scores: number[] }> = {};
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days[d.toDateString()] = { scores: [] };
          }
          mapped.forEach(r => {
            const key = new Date(r.createdAt).toDateString();
            if (days[key]) days[key].scores.push(r.score);
          });
          setHistory(Object.entries(days).map(([key, { scores }]) => ({
            date: new Date(key).toLocaleDateString("en-US", { day: "numeric" }),
            score: avg(scores),
            count: scores.length,
          })));
        }
      }

      /* ── Ratings given ────────────────────────────── */
      const { data: gData } = await supabase
        .from("ratings")
        .select(`id, score, created_at,
          post:post_id ( id, image_url,
            creator:user_id ( id, username, display_name, avatar_url )
          )`)
        .eq("rater_id", user.id)
        .order("created_at", { ascending: false });

      if (gData) {
        setGiven(gData.map((r: any) => ({
          id: r.id,
          score: r.score,
          createdAt: r.created_at,
          post: {
            id: r.post.id,
            imageUrl: r.post.image_url ?? null,
            creator: {
              id: r.post.creator.id,
              username: r.post.creator.username,
              displayName: r.post.creator.display_name,
              avatarUrl: r.post.creator.avatar_url ?? null,
            },
          },
        })));
      }

      setLoading(false);
    }
    load();
  }, []);

  /* ── Computed stats ─────────────────────────────── */
  const overallScore = avg(received.map(r => r.score));
  const totalRaters  = new Set(received.map(r => r.rater.id)).size;
  const weekAgo      = new Date(Date.now() - 7 * 86400000);
  const thisWeek     = received.filter(r => new Date(r.createdAt) >= weekAgo);
  const weekAvg      = avg(thisWeek.map(r => r.score));
  const allTimeHigh  = received.length ? Math.max(...received.map(r => r.score)) : 0;

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-on-surface-variant">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[24px] md:text-[32px] leading-tight font-semibold text-on-surface">
          My Ratings
        </h2>
        {overallScore > 0 && (
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
            <Star size={16} className="text-primary fill-primary" />
            <span className="text-sm font-bold text-primary">{overallScore} avg score</span>
          </div>
        )}
      </div>

      {/* Hero score */}
      <div className="card-glass rounded-2xl p-5 md:p-8 bg-gradient-to-br from-[#7B7FEF]/10 via-white/60 to-[#A78BFA]/10 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#7B7FEF] opacity-5 rounded-full blur-[60px] pointer-events-none" />
        <div className="flex flex-row md:flex-row items-center gap-5 md:gap-8">
          <div className="relative shrink-0">
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#7B7FEF] to-[#A78BFA] flex items-center justify-center shadow-[0_16px_48px_rgba(123,127,239,0.25)]">
              <span className="text-3xl md:text-5xl font-bold text-white">{overallScore || "—"}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center">
              <Award size={18} className="text-primary" />
            </div>
          </div>
          <div className="flex-1 text-left">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-1 md:mb-2">Overall Appeal Score</p>
            <h3 className="font-heading text-xl md:text-3xl font-bold text-on-surface mb-1 md:mb-2">
              {overallScore > 0 ? gradeLabel(overallScore) : "No ratings yet"}
            </h3>
            <p className="text-sm text-on-surface-variant max-w-md">
              {received.length > 0
                ? <>Based on <span className="font-semibold text-on-surface">{received.length} ratings</span> from the PetalBird community.</>
                : "Post a photo in Discover to start receiving ratings."}
            </p>
            <div className="flex items-center gap-4 mt-3 justify-start">
              <div className="flex items-center gap-1.5 text-on-surface-variant text-sm">
                <Users size={15} />
                {totalRaters} unique raters
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Star}       label="This Week"     value={weekAvg > 0 ? String(weekAvg) : "—"}         sub={`${thisWeek.length} ratings`}      iconColor="bg-gradient-to-br from-[#7B7FEF] to-[#A78BFA]" />
        <StatCard icon={TrendingUp} label="All-Time High" value={allTimeHigh > 0 ? String(allTimeHigh) : "—"} sub="single rating received"             iconColor="bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa]" />
        <StatCard icon={Users}      label="Total Raters"  value={String(totalRaters)}                         sub="unique people"                       iconColor="bg-gradient-to-br from-[#A78BFA] to-[#38d9a9]" />
        <StatCard icon={BarChart3}  label="Given"         value={String(given.length)}                        sub="posts you've rated"                  iconColor="bg-gradient-to-br from-[#ff7eb3] to-[#ff6b6b]" />
      </div>

      {/* Chart + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MiniChart history={history} />
        <ScoreDistribution ratings={received} />
      </div>

      {/* Ratings list */}
      <div className="card-glass rounded-2xl bg-white/60 overflow-hidden">
        <div className="flex border-b border-white/40">
          {(["received", "given"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-4 text-sm font-semibold capitalize transition-colors",
                tab === t
                  ? "text-primary border-b-2 border-primary -mb-px"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              Ratings {t}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-1">
          {tab === "received"
            ? received.length === 0
              ? <Empty text="Post a photo in Discover to start getting rated by the community." />
              : received.map(r => <RaterItem key={r.id} rating={r} />)
            : given.length === 0
              ? <Empty text="Head to Discover and rate other creators." />
              : given.map(r => <GivenItem key={r.id} rating={r} />)
          }
        </div>
      </div>
    </div>
  );
}
