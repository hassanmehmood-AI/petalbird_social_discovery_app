"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Compass,
  User,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/discover",      icon: Compass,      label: "Discover"   },
  { href: "/profile/me",    icon: User,         label: "My Profile" },
  { href: "/messages",      icon: MessageSquare,label: "Messages", badge: true },
  { href: "/ratings",       icon: Star,         label: "Ratings"    },
  { href: "/settings",      icon: Settings,     label: "Settings"   },
  { href: "/contact-us",    icon: Mail,         label: "Contact Us" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (!cancelled && data?.is_admin) setIsAdmin(true);
        });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/discover") return pathname.startsWith("/discover") || pathname === "/";
    return pathname.startsWith(href.replace("/me", ""));
  }

  const navItems = isAdmin
    ? [
        ...NAV_ITEMS.slice(0, 4),
        { href: "/admin", icon: ShieldCheck, label: "Admin Console" },
        ...NAV_ITEMS.slice(4),
      ]
    : NAV_ITEMS;

  return (
    <aside className="hidden md:flex h-screen w-52 fixed left-0 top-0 flex-col z-50 bg-white/70 backdrop-blur-xl border-r border-white/40 shadow-[0_20px_40px_rgba(123,127,239,0.08)]">
      <div className="flex flex-col py-5 px-3 h-full">

        {/* Brand */}
        <div className="flex flex-col items-center gap-1 px-3 mb-7">
          <Image
            src="/logo.png"
            alt="PetalBird Logo"
            width={110}
            height={110}
            className="flex-shrink-0"
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5">
          {navItems.map(({ href, icon: Icon, label, badge }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                  active
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                )}
              >
                <div className="relative flex-shrink-0">
                  <Icon
                    size={17}
                    strokeWidth={active ? 2.5 : 1.8}
                    className={active ? "text-primary" : "text-on-surface-variant group-hover:text-primary"}
                  />
                  {badge && !active && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full border border-white" />
                  )}
                </div>
                <span className={cn("text-[13px] leading-none font-sans", active ? "font-semibold" : "font-normal")}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-4 px-1">
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-lg bg-surface-container-low text-on-surface-variant font-medium text-[13px] hover:bg-error/10 hover:text-error transition-all duration-200 flex items-center justify-center gap-2 border border-transparent hover:border-error/20"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>

      </div>
    </aside>
  );
}
