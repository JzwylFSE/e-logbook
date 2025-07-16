"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";
import SignaturePad from "./SignaturePad";

export default function ActivityForm({ weeks, userId }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    week_id: "",
    activity_date: new Date().toISOString().split("T")[0],
    nature_of_activity: "",
    description: "",
    student_signature: "",
    supervisor_signature: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (weeks?.length > 0 && !formData.week_id) {
      setFormData((prev) => ({
        ...prev,
        week_id: weeks[0].id,
      }));
    }
  }, [weeks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from("daily_activities").insert([
      {
        ...formData,
        user_id: userId,
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      alert("Error creating activity: " + error.message);
    } else {
      router.refresh();
      setFormData({
        week_id: weeks?.[0]?.id || "",
        activity_date: new Date().toISOString().split("T")[0],
        nature_of_activity: "",
        description: "",
        student_signature: "",
        supervisor_signature: "",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignatureSave = (type, signature) => {
    setFormData((prev) => ({
      ...prev,
      [type]: signature,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Activity</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Week</label>
            {weeks?.length > 0 ? (
              <select
                name="week_id"
                value={formData.week_id}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                {weeks.map((week) => (
                  <option key={week.id} value={week.id}>
                    Week {week.week_number} (
                    {new Date(week.start_date).toLocaleDateString("en-GB")})
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-red-500 text-sm">
                No weeks available. Please create a week first.
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="activity_date"
              value={formData.activity_date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Activity Type
          </label>
          <input
            type="text"
            name="nature_of_activity"
            value={formData.nature_of_activity}
            onChange={handleChange}
            placeholder="e.g., Software Development, Testing"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="Detailed description of the activity"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <SignaturePad
            label="Student Signature"
            onSave={(sig) => handleSignatureSave("student_signature", sig)}
          />
          <SignaturePad
            label="Supervisor Signature"
            onSave={(sig) => handleSignatureSave("supervisor_signature", sig)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white ${
            isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isSubmitting ? "Adding..." : "Add Activity"}
        </button>
      </form>
    </div>
  );
}
