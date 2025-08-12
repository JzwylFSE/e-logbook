"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";
import SignaturePad from "./SignaturePad";

export default function ActivityForm({
  initialData = null,
  weeks = [],
  userId,
  isEditMode = false,
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    activity_date: initialData?.activity_date?.split("T")[0] || "",
    nature_of_activity: initialData?.nature_of_activity || "",
    description: initialData?.description || "",
    week_id: initialData?.week_id || weeks[0]?.id || "",
    student_signature: initialData?.student_signature || "",
    supervisor_signature: initialData?.supervisor_signature || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signaturePadKey, setSignaturePadKey] = useState(Date.now());

  useEffect(() => {
    // If weeks change and week_id is not set, set default
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

    try {
      if (isEditMode && initialData?.id) {
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
          .eq("id", initialData.id)
          .select();

        if (error) throw error;
      } else {
        if (!userId) throw new Error("User ID is required");
        const { data, error } = await supabase
          .from("daily_activities")
          .insert([
            {
              activity_date: new Date(formData.activity_date).toISOString(),
              nature_of_activity: formData.nature_of_activity,
              description: formData.description,
              week_id: formData.week_id,
              student_signature: formData.student_signature,
              supervisor_signature: formData.supervisor_signature,
              user_id: userId,
            },
          ])
          .select();

        if (error) throw error;
      }
      // redirect and reset form after add/edit
      setFormData({
        activity_date: "",
        nature_of_activity: "",
        description: "",
        week_id: weeks[0]?.id || "",
        student_signature: "",
        supervisor_signature: "",
      });
      setSignaturePadKey(Date.now());
      router.push("/daily_activities");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.message}`);
      console.log(error.message);
    } finally {
      setIsSubmitting(false);
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
      <h2 className="text-xl font-semibold mb-4">
        {isEditMode ? "Edit Activity" : "Add New Activity"}
      </h2>

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
            key={signaturePadKey + "-student"}
            label="Student Signature"
            onSave={(sig) => handleSignatureSave("student_signature", sig)}
            initialValue={formData.student_signature}
          />
          <SignaturePad
            key={signaturePadKey + "-supervisor"}
            label="Supervisor Signature"
            onSave={(sig) => handleSignatureSave("supervisor_signature", sig)}
            initialValue={formData.supervisor_signature}
          />
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => {
              setFormData({
                activity_date: "",
                nature_of_activity: "",
                description: "",
                week_id: weeks[0]?.id || "",
                student_signature: "",
                supervisor_signature: "",
              });
              router.push("/daily_activities");
            }}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded text-white ${
              isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting
              ? isEditMode
                ? "Saving..."
                : "Adding..."
              : isEditMode
              ? "Save Changes"
              : "Add Activity"}
          </button>
        </div>
      </form>
    </div>
  );
}
