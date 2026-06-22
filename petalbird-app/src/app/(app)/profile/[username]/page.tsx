"use client";

import { useState, useEffect, useRef, use } from "react";
import {
  Star, MessageCircle, ImagePlus, PlusCircle,
  X, ImageIcon, Edit2, Check, Award, Camera, Trash2, Music,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface ProfileData {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio: string | null;
  audioUrl: string | null;
  avgRating: number;
  ratingCount: number;
  postCount: number;
}

interface RecentRater {
  raterName: string;
  raterAvatar: string | null;
  score: number;
  createdAt: string;
}

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
  if (score >= 9) return "Legendary";
  if (score >= 8) return "Stunning";
  if (score >= 7) return "Attractive";
  if (score >= 6) return "Looking Good";
  return "Rising Star";
}

/* ─── Avatar ─────────────────────────────────────────────────────────────── */
function Avatar({
  avatarUrl,
  initials,
  className,
  textClass,
}: {
  avatarUrl: string | null;
  initials: string;
  className?: string;
  textClass?: string;
}) {
  return (
    <div className={cn("bg-gradient-to-br from-[#C4C6FA] to-[#7B7FEF]/60 flex items-center justify-center text-white font-bold overflow-hidden", className)}>
      {avatarUrl
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
        : <span className={textClass}>{initials}</span>}
    </div>
  );
}

/* ─── Appeal Score card ──────────────────────────────────────────────────── */
function AppealScore({ avgRating, ratingCount }: { avgRating: number; ratingCount: number }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-[0_4px_24px_rgba(123,127,239,0.06)]">
      <h2 className="text-sm font-semibold text-on-surface mb-5">Appeal Score</h2>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7B7FEF] to-[#A78BFA] flex items-center justify-center shadow-[0_8px_24px_rgba(123,127,239,0.3)]">
            <span className="text-xl font-bold text-white">{avgRating > 0 ? avgRating : "—"}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-white shadow-sm flex items-center justify-center">
            <Award size={12} className="text-primary" />
          </div>
        </div>
        <div>
          <p className="text-base font-bold text-on-surface">
            {avgRating > 0 ? gradeLabel(avgRating) : "No ratings yet"}
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">{ratingCount} community ratings</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Recent Raters ──────────────────────────────────────────────────────── */
function RecentRaters({ profileId }: { profileId: string }) {
  const [raters, setRaters] = useState<RecentRater[]>([]);

  useEffect(() => {
    if (!profileId) return;
    const supabase = createClient();

    supabase
      .from("posts")
      .select("id")
      .eq("user_id", profileId)
      .then(async ({ data: posts }) => {
        if (!posts || posts.length === 0) return;
        const postIds = posts.map((p: any) => p.id);

        const { data } = await supabase
          .from("ratings")
          .select("score, created_at, rater:rater_id ( display_name, avatar_url )")
          .in("post_id", postIds)
          .order("created_at", { ascending: false })
          .limit(5);

        if (data) {
          setRaters(data.map((r: any) => ({
            raterName: r.rater?.display_name ?? "Anonymous",
            raterAvatar: r.rater?.avatar_url ?? null,
            score: r.score,
            createdAt: r.created_at,
          })));
        }
      });
  }, [profileId]);

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-[0_4px_24px_rgba(123,127,239,0.06)]">
      <h2 className="text-sm font-semibold text-on-surface mb-4">Recent Raters</h2>
      <div className="space-y-4">
        {raters.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-4">No ratings yet.</p>
        ) : raters.map((r, i) => (
          <div key={i} className="flex items-center gap-3">
            <Avatar
              avatarUrl={r.raterAvatar}
              initials={r.raterName[0]}
              className="w-9 h-9 rounded-full shrink-0 border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">{r.raterName}</p>
              <p className="text-xs text-on-surface-variant">{timeAgo(r.createdAt)}</p>
            </div>
            <div className={cn(
              "px-2.5 py-1 rounded-lg text-sm font-bold shrink-0",
              r.score >= 8 ? "bg-primary/10 text-primary" :
              r.score < 5  ? "bg-red-50 text-red-500" :
              "bg-surface-container text-on-surface-variant"
            )}>
              {r.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Edit Profile card ──────────────────────────────────────────────────── */
function EditProfileCard({
  profile,
  onSaved,
}: {
  profile: ProfileData;
  onSaved: (name: string, bio: string, avatarUrl: string | null, coverUrl: string | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [coverUrl, setCoverUrl] = useState(profile.coverUrl);
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);

  async function uploadAvatar(file: File) {
    setUploadingAvatar(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `avatars/${profile.id}.${ext}`;
    await supabase.storage.from("post-images").upload(path, file, { upsert: true });
    const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(path);
    setAvatarUrl(publicUrl);
    setUploadingAvatar(false);
  }

  async function uploadCover(file: File) {
    setUploadingCover(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `covers/${profile.id}.${ext}`;
    await supabase.storage.from("post-images").upload(path, file, { upsert: true });
    const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(path);
    setCoverUrl(publicUrl);
    setUploadingCover(false);
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({
      display_name: name.trim() || profile.displayName,
      bio: bio.trim() || null,
      avatar_url: avatarUrl,
      cover_url: coverUrl,
    }).eq("id", profile.id);
    onSaved(name.trim() || profile.displayName, bio.trim(), avatarUrl, coverUrl);
    setSaving(false);
    setEditing(false);
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-[0_4px_24px_rgba(123,127,239,0.06)]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-on-surface">Edit Profile</h2>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
              <X size={15} />
            </button>
            <button onClick={save} disabled={saving || uploadingAvatar || uploadingCover} className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors disabled:opacity-40">
              <Check size={15} />
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors">
            <Edit2 size={15} />
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          {/* Cover photo */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 block">Cover Photo</label>
            <div
              className="relative w-full h-24 rounded-xl overflow-hidden cursor-pointer group mb-2"
              onClick={() => !uploadingCover && coverFileRef.current?.click()}
            >
              {coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#C4C6FA]/60 via-[#dbe8ff] to-[#e8f0ff]" />
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploadingCover ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="flex items-center gap-2 text-white text-xs font-semibold">
                    <Camera size={14} />
                    Change Cover
                  </div>
                )}
              </div>
            </div>
            <input ref={coverFileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); e.target.value = ""; }} />
          </div>

          {/* Avatar */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 block">Profile Photo</label>
            <div className="flex items-center gap-3">
              <Avatar
                avatarUrl={avatarUrl}
                initials={name[0] || "?"}
                className="w-12 h-12 rounded-full shrink-0 border-2 border-white shadow-sm"
              />
              <button
                onClick={() => avatarFileRef.current?.click()}
                disabled={uploadingAvatar}
                className="text-xs font-semibold text-primary hover:underline disabled:opacity-50"
              >
                {uploadingAvatar ? "Uploading…" : "Change photo"}
              </button>
              <input ref={avatarFileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); e.target.value = ""; }} />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Display Name</label>
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 block">Bio</label>
            <textarea
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the world about yourself…"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Avatar avatarUrl={avatarUrl} initials={profile.displayName[0]} className="w-10 h-10 rounded-full shrink-0 border-2 border-white shadow-sm" />
            <div>
              <p className="text-sm font-semibold text-on-surface">{profile.displayName}</p>
              <p className="text-xs text-on-surface-variant">@{profile.username}</p>
            </div>
          </div>
          {profile.bio && <p className="text-sm text-on-surface-variant mt-2">{profile.bio}</p>}
          {!profile.bio && <p className="text-xs text-outline italic">No bio yet — click edit to add one</p>}
        </div>
      )}
    </div>
  );
}

/* ─── Post Rating Modal ──────────────────────────────────────────────────── */
type GalleryPost = { id: string; image_url: string; caption: string | null; avg_rating: number; rating_count: number; myRating: number | null };

function PostRatingModal({
  post,
  isOwn,
  onClose,
  onRate,
}: {
  post: GalleryPost;
  isOwn: boolean;
  onClose: () => void;
  onRate: (postId: string, score: number) => Promise<void>;
}) {
  const [sliderVal, setSliderVal] = useState<number>(post.myRating ?? 0);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(!!post.myRating);
  const pct = sliderVal === 0 ? 0 : ((sliderVal - 1) / 9) * 100;

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleConfirm() {
    setSaving(true);
    await onRate(post.id, sliderVal);
    setSaving(false);
    setConfirmed(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30">
          <h2 className="font-heading text-base font-semibold text-on-surface">
            {isOwn ? "Your Post" : "Rate this Post"}
          </h2>
          <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Image */}
        <div className="relative aspect-[4/3] bg-surface-container-low overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image_url} alt="" className="w-full h-full object-cover" />
          {post.avg_rating > 0 && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/20">
              <Star size={12} className="text-[#A78BFA] fill-[#A78BFA]" />
              <span className="text-sm font-bold text-white">{post.avg_rating}</span>
              <span className="text-xs text-white/60">avg · {post.rating_count} ratings</span>
            </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          {post.caption && (
            <p className="text-sm text-on-surface-variant">{post.caption}</p>
          )}

          {isOwn ? (
            <p className="text-sm text-center text-on-surface-variant py-2">You cannot rate your own post.</p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Your Rating</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">{sliderVal}</span>
                  <span className="text-sm text-on-surface-variant">/10</span>
                </div>
              </div>

              {/* 3D Slider */}
              <div className="relative h-10 flex items-center">
                <div className="absolute w-full rounded-full" style={{ height: 14, background: "rgba(0,0,0,0.08)", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.18), inset 0 -1px 0 rgba(255,255,255,0.6)" }} />
                {pct > 0 && (
                  <div className="absolute left-0 rounded-full overflow-hidden transition-all duration-75" style={{ height: 14, width: `${pct}%`, background: "linear-gradient(to right, #7B7FEF, #A78BFA)", boxShadow: "2px 3px 8px rgba(123,127,239,0.35)" }}>
                    <div className="absolute inset-x-0 top-0 h-1/2" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.38), transparent)" }} />
                    <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: "rgba(0,0,0,0.12)" }} />
                  </div>
                )}
                <div className="absolute pointer-events-none transition-all duration-75" style={{ left: `calc(${pct}% - 11px)` }}>
                  <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center" style={{ background: "linear-gradient(145deg, #ffffff, #E8E9FD)", boxShadow: "0 4px 10px rgba(123,127,239,0.45), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9)" }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(135deg, #7B7FEF, #A78BFA)" }} />
                  </div>
                </div>
                <input
                  type="range" min={1} max={10} step={1} value={sliderVal === 0 ? 1 : sliderVal}
                  disabled={confirmed}
                  onChange={(e) => { setSliderVal(Number(e.target.value)); }}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Rating pills */}
              <div className="flex gap-0.5">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <div key={n} className="flex-1 rounded-md flex items-center justify-center text-[10px] font-semibold py-1 relative overflow-hidden"
                    style={n <= sliderVal ? {
                      background: "linear-gradient(to bottom, #A78BFA, #7B7FEF)",
                      color: "white",
                      boxShadow: "0 3px 6px rgba(123,127,239,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
                    } : {
                      background: "rgba(0,0,0,0.05)",
                      color: "var(--color-outline)",
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                    }}>
                    {n <= sliderVal && <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.28), transparent)" }} />}
                    <span className="relative z-10">{n}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleConfirm}
                disabled={saving || confirmed || sliderVal === 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] text-white text-sm font-semibold shadow-[0_4px_14px_rgba(123,127,239,0.3)] hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? "Saving…" : confirmed ? <><Check size={16} /> Rating Confirmed</> : "Submit Rating"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Photo Gallery ──────────────────────────────────────────────────────── */
function PhotoGallery({ profileId, isOwn, currentUserId }: { profileId: string; isOwn: boolean; currentUserId: string | null }) {
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profileId) return;
    const supabase = createClient();
    supabase
      .from("posts")
      .select("id, image_url, caption, avg_rating, rating_count")
      .eq("user_id", profileId)
      .order("created_at", { ascending: false })
      .then(async ({ data }) => {
        if (!data) return;
        let myRatingsMap: Record<string, number> = {};
        if (currentUserId && data.length > 0) {
          const postIds = data.map((p: any) => p.id);
          const { data: myRatings } = await supabase
            .from("ratings")
            .select("post_id, score")
            .eq("rater_id", currentUserId)
            .in("post_id", postIds);
          myRatings?.forEach((r: any) => { myRatingsMap[r.post_id] = r.score; });
        }
        setPosts(data.map((p: any) => ({ ...p, caption: p.caption ?? null, myRating: myRatingsMap[p.id] ?? null })));
      });
  }, [profileId, currentUserId]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !currentUserId) return;
    setUploading(true);
    setUploadError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${currentUserId}/${Date.now()}.${ext}`;

    const { error: uploadErr } = await supabase.storage.from("post-images").upload(path, file);
    if (uploadErr) { setUploadError("Upload failed: " + uploadErr.message); setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(path);
    const { data: post } = await supabase
      .from("posts")
      .insert({ user_id: currentUserId, image_url: publicUrl })
      .select("id, image_url, caption, avg_rating, rating_count")
      .single();

    if (post) setPosts((prev) => [{ ...post, caption: null, myRating: null }, ...prev]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleRate(postId: string, score: number) {
    if (!currentUserId) return;
    const supabase = createClient();
    await supabase.from("ratings").upsert({ rater_id: currentUserId, post_id: postId, score }, { onConflict: "post_id,rater_id" });
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, myRating: score } : p));
    setSelectedPost((prev) => prev?.id === postId ? { ...prev, myRating: score } : prev);
  }

  async function handleDelete(postId: string) {
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setSelectedPost((prev) => prev?.id === postId ? null : prev);
  }

  return (
    <>
      {selectedPost && (
        <PostRatingModal
          post={selectedPost}
          isOwn={isOwn}
          onClose={() => setSelectedPost(null)}
          onRate={handleRate}
        />
      )}

      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-[0_4px_24px_rgba(123,127,239,0.06)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-semibold text-on-surface">
            Photos <span className="text-on-surface-variant font-normal ml-1">({posts.length})</span>
          </h2>
        </div>

        {uploadError && <p className="text-xs text-red-600 mb-4 px-3 py-2 bg-red-50 rounded-lg">{uploadError}</p>}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {isOwn && (
            <div
              onClick={() => !uploading && fileRef.current?.click()}
              className={cn(
                "aspect-square rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant transition-all group",
                uploading ? "opacity-60 cursor-wait" : "hover:bg-surface-container-low hover:border-primary cursor-pointer"
              )}
            >
              {uploading ? (
                <>
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-xs font-semibold">Uploading…</span>
                </>
              ) : (
                <>
                  <ImagePlus size={24} className="mb-2 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-semibold group-hover:text-primary transition-colors">Add Photo</span>
                </>
              )}
            </div>
          )}

          {posts.map((post) => (
            <div
              key={post.id}
              className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative"
              onClick={() => setSelectedPost(post)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image_url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                <div className="flex items-center gap-1 bg-black/50 rounded-lg px-2 py-1">
                  <Star size={10} className="text-[#A78BFA] fill-[#A78BFA]" />
                  <span className="text-white text-[10px] font-bold">{post.avg_rating}</span>
                </div>
                {!isOwn && post.myRating !== null && (
                  <div className="flex items-center gap-1 bg-primary/80 rounded-lg px-2 py-1">
                    <span className="text-white text-[10px] font-bold">You: {post.myRating}</span>
                  </div>
                )}
              </div>
              {isOwn && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={13} className="text-white" />
                </button>
              )}
            </div>
          ))}

          {posts.length === 0 && !isOwn && (
            <div className="col-span-3 py-8 text-center text-sm text-on-surface-variant">
              No posts yet.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Profile Music Card ─────────────────────────────────────────────────── */
function ProfileMusicCard({
  profileId,
  isOwn,
  audioUrl: initialAudioUrl,
  onUpdated,
}: {
  profileId: string;
  isOwn: boolean;
  audioUrl: string | null;
  onUpdated: (url: string | null) => void;
}) {
  const [audioUrl, setAudioUrl] = useState(initialAudioUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioElRef = useRef<HTMLAudioElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const audio = audioElRef.current;
    if (!audio || !audioUrl) return;

    setProgress(0); setCurrentTime(0); setDuration(0);

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => { setIsPlaying(false); setProgress(0); setCurrentTime(0); };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    audio.load();
    audio.play().catch(() => {});

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, [audioUrl]);

  function togglePlay() {
    const audio = audioElRef.current;
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play().catch(() => {});
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioElRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  }

  function fmt(s: number) {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    audioElRef.current?.pause();
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `profiles/${profileId}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("post-audio")
      .upload(path, file, { upsert: true });
    if (uploadErr) {
      setError("Upload failed: " + uploadErr.message);
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("post-audio").getPublicUrl(path);
    await supabase.from("profiles").update({ audio_url: publicUrl }).eq("id", profileId);
    setAudioUrl(publicUrl);
    onUpdated(publicUrl);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleRemove() {
    audioElRef.current?.pause();
    const supabase = createClient();
    await supabase.from("profiles").update({ audio_url: null }).eq("id", profileId);
    setAudioUrl(null);
    setIsPlaying(false);
    setProgress(0);
    onUpdated(null);
  }

  if (!isOwn && !audioUrl) return null;

  const BAR_HEIGHTS = [35, 70, 100, 50, 85, 45, 90, 60];

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(123,127,239,0.08)]">
      <style>{`
        @keyframes eq { 0%,100%{transform:scaleY(0.25)} 50%{transform:scaleY(1)} }
        @keyframes disc-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Music size={14} className="text-primary" />
          <h2 className="text-sm font-semibold text-on-surface">Profile Music</h2>
        </div>
        {isOwn && audioUrl && (
          <button onClick={handleRemove} className="text-[11px] text-on-surface-variant hover:text-red-500 transition-colors">
            Remove
          </button>
        )}
      </div>

      {audioUrl ? (
        <div className="px-5 pb-5 space-y-4">
          <audio ref={audioElRef} src={audioUrl} preload="metadata" />

          {/* Visual player area */}
          <div
            className="relative rounded-2xl p-4 flex items-center gap-4 overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(123,127,239,0.10), rgba(167,139,250,0.18))" }}
          >
            {/* Background glow when playing */}
            {isPlaying && (
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 30% 50%, #7B7FEF55 0%, transparent 70%)" }}
              />
            )}

            {/* Spinning vinyl disc */}
            <div
              className="relative w-14 h-14 rounded-full shrink-0 flex items-center justify-center shadow-[0_6px_20px_rgba(123,127,239,0.40)]"
              style={{
                background: "linear-gradient(135deg, #7B7FEF, #A78BFA)",
                animation: isPlaying ? "disc-spin 5s linear infinite" : "none",
              }}
            >
              {/* Vinyl grooves */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "repeating-radial-gradient(circle at center, transparent 0, transparent 3px, rgba(0,0,0,0.10) 3px, rgba(0,0,0,0.10) 4px)",
                }}
              />
              {/* Center hole */}
              <div className="w-5 h-5 rounded-full bg-white/90 shadow-inner flex items-center justify-center z-10">
                <div className="w-[7px] h-[7px] rounded-full" style={{ background: "linear-gradient(135deg, #7B7FEF, #A78BFA)" }} />
              </div>
              {/* Gloss */}
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%)" }} />
            </div>

            {/* Equalizer bars */}
            <div className="flex items-end gap-[3px] h-10 shrink-0">
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full origin-bottom"
                  style={{
                    height: `${h}%`,
                    background: "linear-gradient(to top, #7B7FEF, #A78BFA)",
                    opacity: isPlaying ? 0.9 : 0.25,
                    animation: isPlaying
                      ? `eq ${0.45 + i * 0.07}s ease-in-out ${i * 0.04}s infinite`
                      : "none",
                  }}
                />
              ))}
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-0.5"
                style={{ color: isPlaying ? "#7B7FEF" : "var(--color-on-surface-variant)" }}>
                {isPlaying ? "Now Playing" : "Paused"}
              </p>
              <p className="text-sm font-semibold text-on-surface truncate">Profile Track</p>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="relative h-1.5 rounded-full cursor-pointer group"
            style={{ background: "rgba(0,0,0,0.07)" }}
            onClick={handleSeek}
          >
            <div
              className="h-full rounded-full transition-all duration-75"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(to right, #7B7FEF, #A78BFA)",
                boxShadow: progress > 0 ? "0 0 8px rgba(123,127,239,0.5)" : "none",
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#7B7FEF] shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `calc(${progress}% - 7px)` }}
            />
          </div>

          {/* Time + play/pause */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant tabular-nums w-8">{fmt(currentTime)}</span>
            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all"
              style={{
                background: "linear-gradient(135deg, #7B7FEF, #A78BFA)",
                boxShadow: "0 4px_18px rgba(123,127,239,0.45)",
              }}
            >
              {isPlaying ? (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="white">
                  <rect x="1.5" y="0.5" width="3.5" height="12" rx="1.5" />
                  <rect x="8" y="0.5" width="3.5" height="12" rx="1.5" />
                </svg>
              ) : (
                <svg width="13" height="14" viewBox="0 0 13 14" fill="white" style={{ marginLeft: 2 }}>
                  <path d="M1.5 1.5L12 7L1.5 12.5V1.5Z" />
                </svg>
              )}
            </button>
            <span className="text-xs text-on-surface-variant tabular-nums w-8 text-right">{fmt(duration)}</span>
          </div>

          {/* Change music */}
          {isOwn && (
            <>
              <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleFileSelect} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full py-2 rounded-xl border border-dashed border-outline-variant text-xs font-semibold text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Change Music"}
              </button>
            </>
          )}
        </div>
      ) : isOwn ? (
        <div className="px-5 pb-5">
          <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleFileSelect} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex flex-col items-center gap-3 w-full py-7 rounded-xl border-2 border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-50 group"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, rgba(123,127,239,0.12), rgba(167,139,250,0.18))" }}
            >
              <Music size={22} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">{uploading ? "Uploading…" : "Add Music to Profile"}</p>
              <p className="text-xs mt-0.5 opacity-60">MP3 · M4A · WAV supported</p>
            </div>
          </button>
        </div>
      ) : null}

      {error && <p className="text-xs text-red-600 mx-5 mb-4 px-3 py-2 bg-red-50 rounded-lg">{error}</p>}
    </div>
  );
}

/* ─── Create Post Modal ──────────────────────────────────────────────────── */
function CreatePostModal({ currentUserId, onClose, onCreated }: {
  currentUserId: string; onClose: () => void; onCreated: () => void;
}) {
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    if (!file) { setError("Please select a photo first."); return; }
    setError(null); setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${currentUserId}/${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("post-images").upload(path, file);
    if (uploadErr) { setError("Upload failed: " + uploadErr.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(path);
    const { error: insertErr } = await supabase.from("posts").insert({
      user_id: currentUserId, image_url: publicUrl, caption: caption.trim() || null,
    });
    if (insertErr) { setError("Failed: " + insertErr.message); setUploading(false); return; }
    onCreated(); onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
          <h2 className="font-heading text-lg font-semibold text-on-surface">Create Post</h2>
          <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
          {preview ? (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-surface-container-low">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="w-full h-full object-cover" />
              <button onClick={() => { setPreview(null); setFile(null); }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div onClick={() => fileRef.current?.click()}
              className="aspect-video rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <ImageIcon size={36} className="text-outline" />
              <p className="text-sm font-semibold text-on-surface-variant">Click to select a photo</p>
            </div>
          )}
          <textarea
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
            placeholder="Write a caption… (optional)" rows={3} value={caption}
            onChange={(e) => setCaption(e.target.value)} />
          {error && <p className="text-xs text-red-600 px-3 py-2 bg-red-50 rounded-lg">{error}</p>}
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant">Cancel</button>
          <button onClick={handleSubmit} disabled={uploading || !file}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] text-white text-sm font-semibold disabled:opacity-50">
            {uploading ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      const query = username === "me" && user
        ? supabase.from("profiles").select("*").eq("id", user.id).single()
        : supabase.from("profiles").select("*").eq("username", username).single();

      const { data: profileData } = await query;
      if (!profileData) { setLoading(false); return; }

      // Compute avg rating and post count from posts table
      const { data: posts } = await supabase
        .from("posts")
        .select("avg_rating, rating_count")
        .eq("user_id", profileData.id);

      let avgRating = 0;
      let ratingCount = 0;
      if (posts && posts.length > 0) {
        ratingCount = posts.reduce((sum: number, p: any) => sum + (p.rating_count ?? 0), 0);
        const totalScore = posts.reduce((sum: number, p: any) => sum + (p.avg_rating ?? 0) * (p.rating_count ?? 0), 0);
        avgRating = ratingCount > 0 ? +(totalScore / ratingCount).toFixed(1) : 0;
      }

      setProfile({
        id: profileData.id,
        username: profileData.username,
        displayName: profileData.display_name,
        avatarUrl: profileData.avatar_url ?? null,
        coverUrl: profileData.cover_url ?? null,
        bio: profileData.bio ?? null,
        audioUrl: profileData.audio_url ?? null,
        avgRating,
        ratingCount,
        postCount: posts?.length ?? 0,
      });
      setLoading(false);
    }
    load();
  }, [username]);

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploadingCover(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `covers/${profile.id}.${ext}`;
    await supabase.storage.from("post-images").upload(path, file, { upsert: true });
    const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(path);
    await supabase.from("profiles").update({ cover_url: publicUrl }).eq("id", profile.id);
    setProfile((prev) => prev ? { ...prev, coverUrl: publicUrl } : prev);
    setUploadingCover(false);
    e.target.value = "";
  }

  async function handleMessage() {
    if (!profile || !currentUserId) return;
    const supabase = createClient();
    const { data: convId } = await supabase.rpc("create_or_get_conversation", {
      other_user_id: profile.id,
    });
    window.location.href = convId ? `/messages/${convId}` : "/messages";
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-on-surface-variant">Loading profile…</div>;
  }
  if (!profile) {
    return <div className="flex items-center justify-center min-h-[60vh] text-on-surface-variant">Profile not found.</div>;
  }

  const isOwn = currentUserId === profile.id;

  return (
    <>
      {showCreate && currentUserId && (
        <CreatePostModal
          currentUserId={currentUserId}
          onClose={() => setShowCreate(false)}
          onCreated={() => setShowCreate(false)}
        />
      )}

      <div className="-mx-4 md:-mx-6 lg:-mx-8 -my-6">
        {/* Cover */}
        <div className="relative w-full h-56 md:h-72 overflow-hidden">
          {profile.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.coverUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#C4C6FA]/60 via-[#dbe8ff] to-[#e8f0ff]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />


        </div>

        <div className="px-4 md:px-10 max-w-7xl mx-auto relative z-10 pb-10 pt-4">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:gap-6 md:items-start mb-8">
            {/* Top row on mobile: avatar + name side by side */}
            <div className="flex items-end gap-4 md:contents">
              {/* Avatar */}
              <div className="relative shrink-0 -mt-16 md:-mt-24">
                <Avatar
                  avatarUrl={profile.avatarUrl}
                  initials={profile.displayName[0]}
                  className="w-24 h-24 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl text-3xl md:text-4xl"
                />
              </div>

              {/* Name + bio — shown inline with avatar on mobile */}
              <div className="flex-1 md:hidden pb-1">
                <h1 className="font-heading text-2xl leading-tight font-bold text-on-surface">
                  {profile.displayName}
                </h1>
                <p className="text-xs text-on-surface-variant">@{profile.username}</p>
              </div>
            </div>

            {/* Info block — desktop layout */}
            <div className="flex-1">
              <h1 className="hidden md:block font-heading text-[46px] leading-tight font-bold text-on-surface">
                {profile.displayName}
              </h1>
              {profile.bio && <p className="text-sm text-on-surface-variant mt-1 md:mt-2 max-w-md">{profile.bio}</p>}

              {/* Stats chips */}
              <div className="flex flex-wrap gap-2 md:gap-3 mt-3">
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 px-3 md:px-4 py-1.5 md:py-2 rounded-xl flex items-center gap-2 shadow-sm">
                  <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded bg-primary/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-sm bg-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-on-surface">{profile.postCount}</div>
                    <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Posts</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 w-full md:w-auto">
              {isOwn ? (
                <button
                  onClick={() => setShowCreate(true)}
                  className="flex-1 md:flex-none bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] text-white px-5 py-2.5 md:py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(123,127,239,0.3)] hover:opacity-90 transition-all"
                >
                  <PlusCircle size={16} />
                  Create Post
                </button>
              ) : (
                <button
                  onClick={handleMessage}
                  className="flex-1 md:flex-none bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] text-white px-5 py-2.5 md:py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(123,127,239,0.3)] hover:opacity-90 transition-all"
                >
                  <MessageCircle size={16} />
                  Message
                </button>
              )}
            </div>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 flex flex-col gap-6">
              {isOwn ? (
                <EditProfileCard
                  profile={profile}
                  onSaved={(name, bio, avatarUrl, coverUrl) =>
                    setProfile((prev) => prev ? { ...prev, displayName: name, bio, avatarUrl, coverUrl } : prev)
                  }
                />
              ) : (
                <AppealScore avgRating={profile.avgRating} ratingCount={profile.ratingCount} />
              )}
              <ProfileMusicCard
                profileId={profile.id}
                isOwn={isOwn}
                audioUrl={profile.audioUrl}
                onUpdated={(url) => setProfile((prev) => prev ? { ...prev, audioUrl: url } : prev)}
              />
              <RecentRaters profileId={profile.id} />
            </div>
            <div className="lg:col-span-8">
              <PhotoGallery
                profileId={profile.id}
                isOwn={isOwn}
                currentUserId={currentUserId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
