import { createClient } from "@/lib/supabase/server";

export type AdminProfile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  is_admin: boolean;
  is_super_admin: boolean;
  is_deactivated: boolean;
};

type AdminAuthResult =
  | { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; profile: AdminProfile }
  | { ok: false; status: number; error: string };

export async function requireAdmin(): Promise<AdminAuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401, error: "Not authenticated" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, is_admin, is_super_admin, is_deactivated")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_admin || profile.is_deactivated) {
    return { ok: false, status: 403, error: "Admin access required" };
  }

  return { ok: true, supabase, profile: profile as AdminProfile };
}

export async function requireSuperAdmin(): Promise<AdminAuthResult> {
  const result = await requireAdmin();
  if (!result.ok) return result;
  if (!result.profile.is_super_admin) {
    return { ok: false, status: 403, error: "Super admin access required" };
  }
  return result;
}
