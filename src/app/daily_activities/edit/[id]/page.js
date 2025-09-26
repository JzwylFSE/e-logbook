// app/activities/edit/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "../../../../../utils/supabase/client";
import ActivityForm from "@/components/ActivityForm";
import BackButton from "@/components/BackButton";

export default function EditActivityPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const [activityData, setActivityData] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the activity to edit
        const { data: activity, error: activityError } = await supabase
          .from("daily_activities")
          .select("*")
          .eq("id", params.id)
          .single();

        if (activityError) throw activityError;

        // Fetch weeks for dropdown
        const { data: weeksData, error: weeksError } = await supabase
          .from("weeks")
          .select("*")
          .order("start_date", { ascending: false });

        if (weeksError) throw weeksError;

        setActivityData(activity);
        setWeeks(weeksData);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/daily_activities?error=activity_not_found");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (loading) return <div className="p-4">Loading activity details...</div>;
  if (!activityData) return <div className="p-4">Activity not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <BackButton />
      <ActivityForm
        initialData={activityData}
        weeks={weeks}
        isEditMode={true}
      />
    </div>
  );
}
