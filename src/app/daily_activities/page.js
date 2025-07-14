import { redirect } from "next/navigation";
import { createClientForServer } from "../../../utils/supabase/server";
import ActivityTable from "@/components/ActivityTable";
import ActivityForm from "@/components/ActivityForm";

export default async function DailyActivitiesPage(){
    const supabase = createClientForServer();
    //const { data: session } = await supabase.auth.getSession();
    const { data: { user} } = await supabase.auth.getUser();

    if (!user){
        redirect("/auth")
    }

    const { data: activities } = await supabase
        .from("activities")
        .select("*, weeks(week_number, start_date)")
        .eq("user_id", user.id)
        .order("activity_date", { ascending: false });

    const { data: weeks } = await supabase
        .from("weeks")
        .select("*")
        .eq("user_id", user.id)
        .order("start_date", { ascending: false });

    return(
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Daily Activities</h1>
            <ActivityForm weeks={weeks} userId={user.id} />
            <ActivityTable activities={activities} />
        </div>
    );  
}