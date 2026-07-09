import { StatTilesGrid } from "@/components/admin/StatTiles";
import { ActivityChart } from "@/components/admin/ActivityChart";
import { QuickSettingsCard } from "@/components/admin/QuickSettingsCard";
import { UserTable } from "@/components/admin/UserTable";
import { PostModerationList } from "@/components/admin/PostModerationList";
import { ContactRequestsList } from "@/components/admin/ContactRequestsList";
import { RecentSignupsList } from "@/components/admin/RecentSignupsList";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <StatTilesGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <QuickSettingsCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserTable variant="preview" />
        </div>
        <PostModerationList variant="preview" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContactRequestsList variant="preview" />
        <RecentSignupsList />
      </div>
    </div>
  );
}
