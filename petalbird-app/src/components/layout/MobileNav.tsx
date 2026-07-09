"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, MessageCircle, Star, User, Settings, ShieldCheck, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/discover",   icon: Compass,       label: "Discover"  },
  { href: "/messages",   icon: MessageCircle, label: "Messages"  },
  { href: "/ratings",    icon: Star,          label: "Ratings"   },
  { href: "/profile/me", icon: User,          label: "Profile"   },
  { href: "/settings",   icon: Settings,      label: "Settings"  },
  { href: "/contact-us", icon: Mail,          label: "Contact"   },
];

export default function MobileNav() {
  const pathname = usePathname();
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

  function isActive(href: string) {
    if (href === "/discover") return pathname.startsWith("/discover") || pathname === "/";
    return pathname.startsWith(href.replace("/me", ""));
  }

  const navItems = isAdmin
    ? [...NAV_ITEMS, { href: "/admin", icon: ShieldCheck, label: "Admin" }]
    : NAV_ITEMS;

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-white/90 backdrop-blur-xl border-t border-white/40 shadow-[0_-4px_24px_rgba(123,127,239,0.08)]">
      <div className="flex justify-around items-center h-16 px-2 pb-safe">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 min-w-0 py-2 active:scale-90 transition-transform duration-150"
            >
              <div className={cn(
                "w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-200",
                active ? "bg-primary/10 text-primary" : "text-on-surface-variant"
              )}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className={cn(
                "text-[10px] font-semibold leading-none truncate max-w-full",
                active ? "text-primary" : "text-on-surface-variant"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
