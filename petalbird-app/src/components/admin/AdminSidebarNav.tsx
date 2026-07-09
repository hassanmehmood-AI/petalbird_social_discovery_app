"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Mail,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const SUB_NAV_ITEMS = [
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/posts", icon: FileText, label: "Posts" },
  { href: "/admin/traffic", icon: BarChart3, label: "Traffic" },
  { href: "/admin/contact-requests", icon: Mail, label: "Contact Requests" },
];

export function AdminSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const adminActive = pathname === "/admin";

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 space-y-0.5">
        <Link
          href="/discover"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all duration-200"
        >
          <Home size={17} strokeWidth={1.8} />
          <span className="text-[13px] leading-none">Home</span>
        </Link>

        <Link
          href="/admin"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
            adminActive
              ? "bg-primary/10 text-primary border-r-2 border-primary font-semibold"
              : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
          )}
        >
          <LayoutDashboard
            size={17}
            strokeWidth={adminActive ? 2.5 : 1.8}
            fill={adminActive ? "currentColor" : "none"}
            fillOpacity={adminActive ? 0.15 : 0}
          />
          <span className="text-[13px] leading-none">Admin Console</span>
        </Link>

        <div className="pl-4 space-y-0.5 mt-0.5">
          {SUB_NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                  active
                    ? "bg-primary/10 text-primary border-r-2 border-primary font-semibold"
                    : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                )}
              >
                <Icon
                  size={16}
                  strokeWidth={active ? 2.5 : 1.8}
                  fill={active ? "currentColor" : "none"}
                  fillOpacity={active ? 0.15 : 0}
                />
                <span className="text-[13px] leading-none">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

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
  );
}
