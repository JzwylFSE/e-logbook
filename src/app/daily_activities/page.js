import { redirect } from "next/navigation";
import { createClientForServer } from "../../../utils/supabase/server";
import ActivityForm from "@/components/ActivityForm";
import ActivityTable from "@/components/ActivityTable";
import Link from "next/link";

export default async function DailyActivitiesPage() {
  const supabase = createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: activities } = await supabase
    .from("daily_activities")
    .select("*, weeks(week_number, start_date)")
    .eq("user_id", user.id)
    .order("activity_date", { ascending: false })
    .limit(5); // Only show recent activities

  const { data: weeks } = await supabase
    .from("weeks")
    .select("*")
    .eq("user_id", user.id)
    .order("start_date", { ascending: false });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daily Activity</h1>
      </div>
      <ActivityForm 
        weeks={weeks} 
        userId={user.id} 
        isEditMode={false}
        initialData={null}
      />

      {/* Show limited activities with a link to view all */}
        <div className="flex justify-between items-center mb-6 mt-10">
          <h2 className="text-lg font-semibold mb-3">Recent Activities</h2>
          <Link
            href="/daily_activities/all_activities"
            className="text-blue-500 hover:underline"
          >
            View all activities →
          </Link>
        </div>
        <ActivityTable activities={activities} />
    </div>
  );
}
