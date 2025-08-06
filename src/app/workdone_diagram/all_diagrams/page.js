"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase/client";
import WorkdoneDiagramList from "@/components/WorkdoneDiagramList";
import { redirect } from "next/navigation";

export default function AllDiagramsPage() {
  const [user, setUser] = useState(null);
  const [diagrams, setDiagrams] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        redirect("/auth")
      }
      setUser(user);

      const [{ data: weeks }, { data: activities }, { data: diagrams }] = await Promise.all([
        supabase.from("weeks").select("*").eq("user_id", user.id).order("start_date", { ascending: false }),
        supabase.from("daily_activities").select("*").eq("user_id", user.id).order("activity_date", { ascending: false }),
        supabase.from("drawings").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      ]);

      setWeeks(weeks || []);
      setActivities(activities || []);
      setDiagrams(diagrams || []);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleDiagramDeleted = (id) => {
    setDiagrams((prev) => prev.filter((d) => d.id !== id));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">All Work Diagrams</h1>
      <WorkdoneDiagramList
        diagrams={diagrams}
        activities={activities}
        weeks={weeks}
        onDiagramDeleted={handleDiagramDeleted}
      />
    </div>
  );
}
