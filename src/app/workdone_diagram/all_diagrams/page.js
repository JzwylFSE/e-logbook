"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabase/client";
import WorkdoneDiagramList from "@/components/WorkdoneDiagramList";
import { redirect } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function AllDiagramsPage() {
  const [user, setUser] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) redirect("/auth");
      setUser(user);

      const [
        { data: weekData },
        { data: activityData },
        { data: diagramData },
      ] = await Promise.all([
        supabase.from("weeks").select("*").eq("user_id", user.id),
        supabase.from("daily_activities").select("*").eq("user_id", user.id),
        supabase
          .from("drawings")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      setWeeks(weekData || []);
      setActivities(activityData || []);
      setDiagrams(diagramData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDiagramDeleted = (id) => {
    setDiagrams((prev) => prev.filter((diagram) => diagram.id !== id));
  };

  if (loading) return <p>Loading diagrams...</p>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <BackButton />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Diagrams</h1>
      </div>

      <WorkdoneDiagramList
        diagrams={diagrams}
        activities={activities}
        weeks={weeks}
        onDiagramDeleted={handleDiagramDeleted}
      />
    </div>
  );
}
