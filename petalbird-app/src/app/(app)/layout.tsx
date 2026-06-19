"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileNav from "@/components/layout/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noTopBar =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/ratings");

  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop sidebar — 256px fixed left */}
      <Sidebar />

      {/* Top bar — fixed, offset by sidebar on md+ */}
      <TopBar />

      {/* Page content — clears sidebar (md:ml-52) and topbar (pt-20) */}
      <main className={`md:ml-52 pb-28 md:pb-8 min-h-screen ${noTopBar ? "pt-0" : "pt-20"}`}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav — hidden on md+ */}
      <MobileNav />
    </div>
  );
}
