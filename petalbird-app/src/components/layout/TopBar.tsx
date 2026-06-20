"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function TopBar() {
  const pathname = usePathname();
  const hidden =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/ratings");

  const [scrollHidden, setScrollHidden] = useState(false);
  const lastY = useRef(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initials, setInitials] = useState<string>("");

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url, display_name, username")
        .eq("id", user.id)
        .single();

      if (profile) {
        setAvatarUrl(profile.avatar_url ?? null);
        const name = profile.display_name || profile.username || "";
        setInitials(name.charAt(0).toUpperCase());
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y > lastY.current && y > 80) {
        setScrollHidden(true);
      } else if (y < lastY.current) {
        setScrollHidden(false);
      }
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (hidden) return null;

  return (
    <header className={cn(
      "fixed top-0 right-0 left-0 md:left-52 h-20 z-40 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-[0_4px_30px_rgba(123,127,239,0.05)] flex items-center justify-between px-6 gap-4 transition-transform duration-300 ease-in-out",
      scrollHidden ? "-translate-y-full" : "translate-y-0"
    )}>

      {/* ── Mobile: brand logo (left) ── */}
      <div className="flex items-center gap-2 md:hidden">
        <Image src="/logo.png" alt="PetalBird Logo" width={52} height={52} />
      </div>

      {/* ── Trailing actions ── */}
      <div className="flex items-center gap-3 ml-auto">


        {/* Avatar */}
        <Link href="/profile/me" className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 shadow-sm hover:scale-105 transition-transform duration-200 overflow-hidden bg-gradient-to-br from-[#7B7FEF] to-[#A78BFA] flex items-center justify-center">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-bold">{initials}</span>
            )}
          </div>
        </Link>
      </div>

    </header>
  );
}
