"use server"

import { createClientForServer } from "../../../../utils/supabase/server";
import ActivityTable from "@/components/ActivityTable";
import Link from "next/link";
import { redirect } from "next/navigation";
import BackButton from "@/components/BackButton";

export default async function AllActivitiesPage({ searchParams }) {
  const supabase = createClientForServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // get sorting parameters from URL
  const sortColumn = searchParams.sort || "activity_date"
  const sortOrder = searchParams.order || "desc"

  const { data: activities } = await supabase
    .from("daily_activities")
    .select("*, weeks(week_number, start_date)")
    .eq("user_id", user.id)
    .order(sortColumn, { ascending: sortOrder === "asc" });

  return (
    <div className="container mx-auto p-4">
      <BackButton />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Activities</h1>
      </div>
      {/* <ActivityTable activities={activities} /> */}
      <ActivityTable 
        activities={activities} 
        sortColumn={sortColumn}
        sortOrder={sortOrder}
      />
    </div>
  );
}