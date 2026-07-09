"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Admin Dashboard",
  "/admin/users": "Users",
  "/admin/posts": "Posts",
  "/admin/traffic": "Traffic",
  "/admin/contact-requests": "Contact Requests",
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { profile } = useAdminAuth();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const title = PAGE_TITLES[pathname] ?? "Admin";
  const initials = (profile.display_name || profile.username || "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-screen w-60 fixed left-0 top-0 flex-col z-50 bg-white/70 backdrop-blur-xl border-r border-white/40 shadow-[0_20px_40px_rgba(123,127,239,0.08)]">
        <div className="flex flex-col py-5 px-3 h-full">
          <div className="flex flex-col items-center gap-1 px-3 mb-6">
            <Image src="/logo.png" alt="PetalBird Logo" width={90} height={90} className="shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Admin Console
            </p>
          </div>
          <AdminSidebarNav />
        </div>
      </aside>

      {/* Mobile drawer */}
      <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop
            className={cn(
              "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden",
              "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-300"
            )}
          />
          <Dialog.Popup
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] bg-white flex flex-col py-5 px-3 lg:hidden",
              "transition-transform duration-300 ease-in-out",
              "data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full"
            )}
          >
            <div className="flex items-center justify-between px-3 mb-6">
              <div className="flex flex-col items-start gap-0.5">
                <Image src="/logo.png" alt="PetalBird Logo" width={64} height={64} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Admin Console
                </p>
              </div>
              <Dialog.Close
                aria-label="Close menu"
                className="p-2 rounded-full text-on-surface-variant hover:bg-muted transition-colors"
              >
                <X size={18} />
              </Dialog.Close>
            </div>
            <AdminSidebarNav onNavigate={() => setDrawerOpen(false)} />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Header */}
      <header className="lg:pl-60 sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-white/40">
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-16 h-16">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-full text-on-surface-variant hover:bg-muted transition-colors shrink-0"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base sm:text-lg font-bold font-heading text-on-surface truncate">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-on-surface leading-tight">
                  {profile.display_name || profile.username}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-on-surface-variant">
                  {profile.is_super_admin ? "Super Admin" : "Admin"}
                </p>
              </div>
              <div className="w-px h-8 bg-outline-variant/30" />
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#7B7FEF] to-[#A78BFA] flex items-center justify-center shrink-0">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs font-bold">{initials}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:pl-60">
        <div className="px-4 sm:px-6 lg:px-16 py-6">{children}</div>
      </main>
    </div>
  );
}
