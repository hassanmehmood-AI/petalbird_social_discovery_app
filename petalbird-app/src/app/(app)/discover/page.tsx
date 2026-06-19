"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  Flame,
  MoreHorizontal,
  PlusCircle,
  X,
  ImageIcon,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface FeedPost {
  id: string;
  imageUrl: string;
  caption: string | null;
  avgRating: number;
  ratingCount: number;
  createdAt: string;
  myRating: number | null;
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
  };
}

/* ─── Create Post Modal ─────────────────────────────────────────────────── */
function CreatePostModal({
  currentUserId,
  onClose,
  onCreated,
}: {
  currentUserId: string;
  onClose: () => void;
  onCreated: (post: FeedPost) => void;
}) {
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit() {
    if (!file) { setError("Please select a photo first."); return; }
    setError(null);
    setUploading(true);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${currentUserId}/${Date.now()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("post-images")
      .upload(path, file);

    if (uploadErr) {
      setError("Upload failed: " + uploadErr.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("post-images")
      .getPublicUrl(path);

    const { data: post, error: insertErr } = await supabase
      .from("posts")
      .insert({ user_id: currentUserId, image_url: publicUrl, caption: caption.trim() || null })
      .select(`id, image_url, caption, avg_rating, rating_count, created_at,
               profiles:user_id ( id, username, display_name, avatar_url, bio )`)
      .single();

    if (insertErr || !post) {
      setError("Failed to save post: " + (insertErr?.message ?? "unknown"));
      setUploading(false);
      return;
    }

    const p = post as any;
    onCreated({
      id: p.id,
      imageUrl: p.image_url,
      caption: p.caption,
      avgRating: p.avg_rating,
      ratingCount: p.rating_count,
      createdAt: p.created_at,
      myRating: null,
      creator: {
        id: p.profiles.id,
        username: p.profiles.username,
        displayName: p.profiles.display_name,
        avatarUrl: p.profiles.avatar_url,
        bio: p.profiles.bio,
      },
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
          <h2 className="font-heading text-lg font-semibold text-on-surface">Create Post</h2>
          <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

          {preview ? (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-surface-container-low">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => { setPreview(null); setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="aspect-video rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
            >
              <ImageIcon size={36} className="text-outline" />
              <p className="text-sm font-semibold text-on-surface-variant">Click to select a photo</p>
            </div>
          )}

          <textarea
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            placeholder="Write a caption… (optional)"
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {error && (
            <p className="text-xs text-red-600 px-3 py-2 bg-red-50 rounded-lg">{error}</p>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading || !file}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#00C6FF] text-white text-sm font-semibold shadow-[0_4px_14px_rgba(0,122,255,0.3)] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Image Lightbox ────────────────────────────────────────────────────── */
function ImageLightbox({ src, caption, onClose }: { src: string; caption: string | null; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20">
        <X size={20} />
      </button>
      <div
        className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption ?? ""}
          className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
        />
        {caption && (
          <p className="text-white/80 text-sm text-center px-4">{caption}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Feed Card ─────────────────────────────────────────────────────────── */
function FeedCard({
  post,
  index,
  currentUserId,
  onRate,
  onMessage,
}: {
  post: FeedPost;
  index: number;
  currentUserId: string;
  onRate: (postId: string, score: number) => void;
  onMessage: (creatorId: string) => void;
}) {
  const [sliderVal, setSliderVal] = useState<number>(post.myRating ?? 5);
  const [lightbox, setLightbox] = useState(false);
  const isOwn = post.creator.id === currentUserId;
  const pct = ((sliderVal - 1) / 9) * 100;

  const CARD_GRADIENTS = [
    "from-[#adc6ff]/60 via-[#dbe8ff] to-[#e8f0ff]",
    "from-[#b7f0d4]/60 via-[#d8f0e8] to-[#e8f0ff]",
  ];

  return (
    <>
      {lightbox && post.imageUrl && (
        <ImageLightbox src={post.imageUrl} caption={post.caption} onClose={() => setLightbox(false)} />
      )}
    <article className="card-glass rounded-2xl overflow-hidden flex flex-col md:flex-row group">
      {/* Image section */}
      <div
        className="w-full md:w-[50%] relative aspect-[4/3] md:aspect-auto md:min-h-[300px] cursor-zoom-in"
        onClick={() => post.imageUrl && setLightbox(true)}
      >
        {post.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.imageUrl}
            alt={post.caption ?? ""}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className={cn("absolute inset-0 bg-gradient-to-br", CARD_GRADIENTS[index % CARD_GRADIENTS.length])} />
        )}
        {/* Rating badge */}
        {post.avgRating > 0 && (
          <div className="absolute bottom-4 right-4 bg-[#111111]/70 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white/20">
            <span className="text-sm font-semibold text-white">{post.avgRating}</span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-4 md:p-6 flex-1 flex flex-col justify-between bg-white/40">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-heading text-[20px] md:text-[24px] leading-tight text-on-surface">
                {post.creator.displayName}
              </h3>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-on-surface-variant transition-colors border border-white/40 shadow-sm">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Caption or bio */}
          {(post.caption || post.creator.bio) && (
            <p className="text-sm text-on-surface-variant mt-2 line-clamp-2">
              {post.caption ?? post.creator.bio}
            </p>
          )}

          <div className="flex items-center gap-6 mt-4">
            {post.ratingCount > 0 && (
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="text-sm font-semibold">{post.ratingCount} ratings</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Users size={18} />
              <span className="text-sm font-semibold">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Rating + actions */}
        <div className="mt-4 pt-4 border-t border-white/40">
          {isOwn ? (
            <p className="text-sm text-on-surface-variant text-center py-2">This is your post</p>
          ) : (
            <div className="mb-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                  Your Rating
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">{sliderVal}</span>
                  <span className="text-sm text-on-surface-variant">/10</span>
                </div>
              </div>

              {/* Slider — 3D track */}
              <div className="relative h-10 flex items-center mb-4">
                {/* Recessed track */}
                <div
                  className="absolute w-full rounded-full"
                  style={{
                    height: 14,
                    background: "rgba(0,0,0,0.08)",
                    boxShadow: "inset 0 3px 6px rgba(0,0,0,0.18), inset 0 -1px 0 rgba(255,255,255,0.6)",
                  }}
                />
                {/* Filled portion — cylindrical 3D bar */}
                {pct > 0 && (
                  <div
                    className="absolute left-0 rounded-full overflow-hidden transition-all duration-75"
                    style={{
                      height: 14,
                      width: `${pct}%`,
                      background: "linear-gradient(to right, #007AFF, #00C6FF)",
                      boxShadow: "2px 3px 8px rgba(0,122,255,0.35)",
                    }}
                  >
                    {/* Top gloss */}
                    <div
                      className="absolute inset-x-0 top-0 h-1/2"
                      style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.38), transparent)" }}
                    />
                    {/* Bottom shadow */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/3"
                      style={{ background: "rgba(0,0,0,0.12)" }}
                    />
                  </div>
                )}
                {/* 3D thumb */}
                <div
                  className="absolute pointer-events-none transition-all duration-75"
                  style={{ left: `calc(${pct}% - 11px)` }}
                >
                  {/* Outer ring */}
                  <div
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, #ffffff, #e0e8ff)",
                      boxShadow: "0 4px 10px rgba(0,122,255,0.45), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9)",
                    }}
                  >
                    {/* Inner dot */}
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: "linear-gradient(135deg, #007AFF, #00C6FF)" }}
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  onMouseUp={() => onRate(post.id, sliderVal)}
                  onTouchEnd={() => onRate(post.id, sliderVal)}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Rating pills — 3D */}
              <div className="flex gap-0.5 md:gap-1">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <div
                    key={n}
                    className="flex-1 rounded-md md:rounded-lg flex items-center justify-center text-[10px] md:text-xs font-semibold py-1 md:py-1.5 transition-all duration-75 relative overflow-hidden"
                    style={n <= sliderVal ? {
                      background: "linear-gradient(to bottom, #00C6FF, #007AFF)",
                      color: "white",
                      boxShadow: "0 3px 6px rgba(0,122,255,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
                    } : {
                      background: "rgba(0,0,0,0.05)",
                      color: "var(--color-outline)",
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {n <= sliderVal && (
                      <div
                        className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
                        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.28), transparent)" }}
                      />
                    )}
                    <span className="relative z-10">{n}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {!isOwn && (
              <button
                onClick={() => onMessage(post.creator.id)}
                className="flex-1 bg-gradient-to-r from-[#007AFF] to-[#00C6FF] text-white text-sm font-semibold py-3 rounded-xl shadow-[0_4px_14px_rgba(0,122,255,0.3)] hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                Message
              </button>
            )}
            <Link
              href={`/profile/${post.creator.username}`}
              className="flex-1 bg-white border border-primary/20 text-primary text-sm font-semibold py-3 rounded-xl hover:bg-primary/5 transition-colors shadow-sm text-center"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </article>
    </>
  );
}

/* ─── Sidebar Widgets ───────────────────────────────────────────────────── */
function TopRatedWidget({ items }: { items: { displayName: string; username: string; avgRating: number; imageUrl: string | null }[] }) {
  return (
    <div className="card-glass rounded-2xl p-6 bg-white/60">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-on-surface">Top Rated This Week</h3>
        <TrendingUp size={16} className="text-[#00C6FF]" />
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-2">No posts yet.</p>
        ) : (
          items.map((u, i) => (
            <Link
              key={`${u.username}-${i}`}
              href={`/profile/${u.username}`}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/80 transition-colors cursor-pointer border border-transparent hover:border-white/40 group"
            >
              {/* Rank */}
              <span className="text-xs font-bold text-outline w-4 text-center shrink-0">#{i + 1}</span>

              {/* Post image thumbnail */}
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-surface-container shadow-sm">
                {u.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={u.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-[#00C6FF]/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{u.displayName[0]}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{u.displayName}</p>
                <p className="text-xs text-on-surface-variant">@{u.username}</p>
              </div>

              {/* Rating */}
              <div className="bg-primary/10 px-2.5 py-1 rounded-lg shrink-0">
                <span className="text-sm font-bold text-primary">{u.avgRating}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function TrendingWidget({ items }: { items: { id: string; imageUrl: string; avgRating: number; username: string }[] }) {
  return (
    <div className="card-glass rounded-2xl p-6 bg-gradient-to-br from-white/50 to-surface-container-low/40">
      <div className="flex items-center gap-2 mb-4">
        <Flame size={20} className="text-primary" />
        <h3 className="text-sm font-semibold text-on-surface">Trending Now</h3>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-on-surface-variant text-center py-4">No trending posts yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {items.map((post) => (
            <Link key={post.id} href={`/profile/${post.username}`} className="aspect-square rounded-xl overflow-hidden group relative cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-bold drop-shadow">{post.avgRating}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function DiscoverPage() {
  const [filter, setFilter] = useState<"new" | "top">("new");
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [topRated, setTopRated] = useState<{ displayName: string; username: string; avgRating: number; imageUrl: string | null }[]>([]);
  const [trending, setTrending] = useState<{ id: string; imageUrl: string; avgRating: number; username: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      const orderCol = filter === "top" ? "avg_rating" : "created_at";

      const { data: postsData } = await supabase
        .from("posts")
        .select(`
          id, image_url, caption, avg_rating, rating_count, created_at,
          profiles:user_id ( id, username, display_name, avatar_url, bio )
        `)
        .order(orderCol, { ascending: false })
        .limit(20);

      if (postsData && postsData.length > 0) {
        const postIds = postsData.map((p: any) => p.id);
        const { data: myRatings } = await supabase
          .from("ratings")
          .select("post_id, score")
          .eq("rater_id", user.id)
          .in("post_id", postIds);

        const ratingsMap: Record<string, number> = {};
        myRatings?.forEach((r) => { ratingsMap[r.post_id] = r.score; });

        setPosts(
          postsData.map((p: any) => ({
            id: p.id,
            imageUrl: p.image_url,
            caption: p.caption,
            avgRating: p.avg_rating,
            ratingCount: p.rating_count,
            createdAt: p.created_at,
            myRating: ratingsMap[p.id] ?? null,
            creator: {
              id: p.profiles.id,
              username: p.profiles.username,
              displayName: p.profiles.display_name,
              avatarUrl: p.profiles.avatar_url,
              bio: p.profiles.bio,
            },
          }))
        );
      } else {
        setPosts([]);
      }

      const { data: topData } = await supabase
        .from("posts")
        .select("id, image_url, avg_rating, profiles:user_id ( display_name, username )")
        .order("avg_rating", { ascending: false })
        .limit(5);

      if (topData) {
        setTopRated(topData.map((p: any) => ({
          displayName: p.profiles.display_name,
          username: p.profiles.username,
          avgRating: p.avg_rating,
          imageUrl: p.image_url ?? null,
        })));
      }

      // Trending: highest rated, ties broken by most recent date
      const { data: trendingData } = await supabase
        .from("posts")
        .select("id, image_url, avg_rating, created_at, profiles:user_id ( username )")
        .order("avg_rating", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);

      if (trendingData) {
        setTrending(trendingData.map((p: any) => ({
          id: p.id,
          imageUrl: p.image_url,
          avgRating: p.avg_rating,
          username: p.profiles.username,
        })));
      }

      setLoading(false);
    }
    load();
  }, [filter]);

  async function handleRate(postId: string, score: number) {
    const supabase = createClient();
    await supabase
      .from("ratings")
      .upsert({ rater_id: currentUserId, post_id: postId, score }, { onConflict: "post_id,rater_id" });
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, myRating: score } : p));
  }

  async function handleMessage(creatorId: string) {
    const supabase = createClient();
    const { data: convId, error } = await supabase.rpc("create_or_get_conversation", {
      other_user_id: creatorId,
    });
    if (error) {
      console.error("create_or_get_conversation error:", error.message);
    }
    window.location.href = convId ? `/messages/${convId}` : "/messages";
  }

  return (
    <>
      {showCreate && (
        <CreatePostModal
          currentUserId={currentUserId}
          onClose={() => setShowCreate(false)}
          onCreated={(post) => setPosts((prev) => [post, ...prev])}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* ── Center feed ────────────────────────────────────────────── */}
        <div className="col-span-1 lg:col-span-8 space-y-4">
          {/* Header row */}
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-on-surface shrink-0">
              Discover
            </h2>
            <div className="flex items-center gap-2 ml-auto">
              {(["new", "top"] as const).map((f) => (
                <button
                  key={f}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-colors whitespace-nowrap",
                    filter === f
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-white border border-white/40 text-on-surface-variant hover:bg-surface-container-low shadow-sm"
                  )}
                  onClick={() => setFilter(f)}
                >
                  {f === "new" ? "New" : "Top Rated"}
                </button>
              ))}
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#007AFF] to-[#00C6FF] text-white text-xs md:text-sm font-semibold shadow-[0_4px_14px_rgba(0,122,255,0.3)] hover:opacity-90 transition-all whitespace-nowrap"
              >
                <PlusCircle size={14} />
                Post
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-on-surface-variant">Loading…</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-on-surface-variant">No posts yet. Be the first!</p>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#00C6FF] text-white text-sm font-semibold hover:opacity-90 transition-all"
              >
                <PlusCircle size={16} />
                Create First Post
              </button>
            </div>
          ) : (
            posts.map((post, i) => (
              <FeedCard
                key={post.id}
                post={post}
                index={i}
                currentUserId={currentUserId}
                onRate={handleRate}
                onMessage={handleMessage}
              />
            ))
          )}
        </div>

        {/* ── Right sidebar ──────────────────────────────────────────── */}
        <aside className="col-span-1 lg:col-span-4 space-y-6 hidden lg:block">
          <TopRatedWidget items={topRated} />
          <TrendingWidget items={trending} />

        </aside>
      </div>
    </>
  );
}
