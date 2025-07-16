import { redirect } from "next/navigation"
import { createClientForServer } from "../../../utils/supabase/server"
import WorkdoneDiagramForm from "@/components/WorkdoneDiagramForm"
import WorkdoneDiagramList from "@/components/WorkDoneDiagramList"

export default async function WorkdoneDiagramPage() {
  const supabase = createClientForServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  // Fetch diagrams
  const { data: diagrams } = await supabase
    .from("workdone_diagram")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch weeks for dropdown
  const { data: weeks } = await supabase
    .from("weeks")
    .select("*")
    .eq("user_id", user.id)
    .order("start_date", { ascending: false })

  // Fetch activities for dropdown
  const { data: activities } = await supabase
    .from("daily_activities")
    .select("*")
    .eq("user_id", user.id)
    .order("activity_date", { ascending: false })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Work Diagrams</h1>
      <WorkdoneDiagramForm 
        weeks={weeks} 
        userId={user.id} 
        activities={activities} 
      />
      <WorkdoneDiagramList 
        diagrams={diagrams} 
        activities={activities}
        weeks={weeks}
      />
    </div>
  )
}