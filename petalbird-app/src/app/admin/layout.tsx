import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    redirect("/discover");
  }

  return (
    <AdminAuthProvider initialProfile={auth.profile}>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
