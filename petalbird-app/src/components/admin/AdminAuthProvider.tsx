"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AdminProfile } from "@/lib/supabase/admin";

type AdminAuthContextValue = {
  profile: AdminProfile;
  loading: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export function AdminAuthProvider({
  initialProfile,
  children,
}: {
  initialProfile: AdminProfile;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [profile] = useState(initialProfile);
  const [loading] = useState(false);
  const checking = useRef(false);

  useEffect(() => {
    const supabase = createClient();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.replace("/login");
        return;
      }

      if (event === "TOKEN_REFRESHED") {
        // Re-validate admin authorization hasn't been revoked while this tab was open.
        if (checking.current) return;
        checking.current = true;
        try {
          const { data } = await supabase
            .from("profiles")
            .select("is_admin, is_deactivated")
            .eq("id", session.user.id)
            .single();
          if (!data || !data.is_admin || data.is_deactivated) {
            router.replace("/discover");
          }
        } finally {
          checking.current = false;
        }
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, [router]);

  return (
    <AdminAuthContext.Provider value={{ profile, loading }}>{children}</AdminAuthContext.Provider>
  );
}
