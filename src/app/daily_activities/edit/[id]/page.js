// app/activities/edit/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "../../../../../utils/supabase/client";
import Link from "next/link";
import SignaturePad from "@/components/SignaturePad";

export default function EditActivityPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const [activity, setActivity] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    activity_date: "",
    nature_of_activity: "",
    description: "",
    week_id: "",
    student_signature: "",
    supervisor_signature: "",
  });

  // Fetch activity and weeks data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the current activity
        const { data: activityData, error: activityError } = await supabase
          .from("daily_activities")
          .select("*")
          .eq("id", params.id)
          .single();

        if (activityError) throw activityError;

        // Get available weeks for dropdown
        const { data: weeksData, error: weeksError } = await supabase
          .from("weeks")
          .select("*")
          .order("start_date", { ascending: false });

        if (weeksError) throw weeksError;

        setActivity(activityData);
        setWeeks(weeksData);

        // Pre-fill form with existing data
        setFormData({
          activity_date: activityData.activity_date?.split("T")[0] || "",
          nature_of_activity: activityData.nature_of_activity || "",
          description: activityData.description || "",
          week_id: activityData.week_id || "",
          student_signature: activityData.student_signature || "",
          supervisor_signature: activityData.supervisor_signature || "",
        });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignatureSave = (type, signature) => {
    setFormData((prev) => ({
      ...prev,
      [type]: signature,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("daily_activities")
        .update({
          activity_date: new Date(formData.activity_date).toISOString(),
          nature_of_activity: formData.nature_of_activity,
          description: formData.description,
          week_id: formData.week_id,
          student_signature: formData.student_signature,
          supervisor_signature: formData.supervisor_signature,
        })
        .eq("id", params.id)
        .select();

      if (error) throw error;

      router.push("/daily_activities?success=activity_updated");
    } catch (error) {
      console.error("Update error:", error);
      alert(`Update failed: ${error.message || "An error occurred"}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading activity details...</div>;
  if (!activity) return <div className="p-4">Activity not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Activity</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Date</label>
          <input
            type="date"
            name="activity_date"
            value={formData.activity_date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Activity Type</label>
          <input
            type="text"
            name="nature_of_activity"
            value={formData.nature_of_activity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded min-h-[100px]"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Week</label>
          <select
            name="week_id"
            value={formData.week_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Week</option>
            {weeks.map((week) => (
              <option key={week.id} value={week.id}>
                Week {week.week_number} (
                {new Date(week.start_date).toLocaleDateString("en-GB")})
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <SignaturePad
            label="Student Signature"
            onSave={(sig) => handleSignatureSave("student_signature", sig)}
            initialValue={formData.student_signature}
          />
          <SignaturePad
            label="Supervisor Signature"
            onSave={(sig) => handleSignatureSave("supervisor_signature", sig)}
            initialValue={formData.supervisor_signature}
          />
        </div>
        <div className="flex justify-end gap-4 pt-6">
          <Link
            href="/daily_activities"
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
