"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, MessageCircle, Star, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/discover",   icon: Compass,       label: "Discover"  },
  { href: "/messages",   icon: MessageCircle, label: "Messages"  },
  { href: "/ratings",    icon: Star,          label: "Ratings"   },
  { href: "/profile/me", icon: User,          label: "Profile"   },
  { href: "/settings",   icon: Settings,      label: "Settings"  },
];

export default function MobileNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/discover") return pathname.startsWith("/discover") || pathname === "/";
    return pathname.startsWith(href.replace("/me", ""));
  }

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-white/90 backdrop-blur-xl border-t border-white/40 shadow-[0_-4px_24px_rgba(0,122,255,0.08)]">
      <div className="flex justify-around items-center h-16 px-2 pb-safe">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-2 active:scale-90 transition-transform duration-150"
            >
              <div className={cn(
                "w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-200",
                active ? "bg-primary/10 text-primary" : "text-on-surface-variant"
              )}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className={cn(
                "text-[10px] font-semibold leading-none",
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
