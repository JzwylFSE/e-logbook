"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase/client";
import WorkdoneDiagramForm from "@/components/WorkdoneDiagramForm";
import WorkdoneDiagramList from "@/components/WorkdoneDiagramList";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function WorkdoneDiagramPage() {
  const [user, setUser] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user & data
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        redirect("/auth");
      }
      setUser(user);

      const [
        { data: weekData },
        { data: activityData },
        { data: diagramData },
      ] = await Promise.all([
        supabase
          .from("weeks")
          .select("*")
          .eq("user_id", user.id)
          .order("start_date", { ascending: false }),
        supabase
          .from("daily_activities")
          .select("*")
          .eq("user_id", user.id)
          .order("activity_date", { ascending: false }),
        supabase
          .from("drawings")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1),
      ]);

      setWeeks(weekData || []);
      setActivities(activityData || []);
      setDiagrams(diagramData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDiagramSaved = (newDiagram) => {
    setDiagrams((prev) => [newDiagram, ...prev]);
  };

  const handleDiagramDeleted = (id) => {
    setDiagrams((prev) => prev.filter((diagram) => diagram.id !== id));
  };

  if (loading) {
    return <p>Loading diagrams...</p>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Work Done Diagrams</h1>
      <Link
        href="/workdone_diagram/all_diagrams"
        className="text-blue-500 hover:underline"
      >
        View all Diagrams →
      </Link>

      {/* Form for adding diagrams */}
      {user && (
        <WorkdoneDiagramForm
          weeks={weeks}
          userId={user.id}
          activities={activities}
          onDiagramSaved={handleDiagramSaved}
        />
      )}

      {/* List of diagrams */}
      <WorkdoneDiagramList
        diagrams={diagrams}
        activities={activities}
        weeks={weeks}
        onDiagramDeleted={handleDiagramDeleted}
      />
    </div>
  );
}
