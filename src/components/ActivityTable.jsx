"use client";

import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import DeleteConfirmation from "./DeleteConfirmation";

export default function ActivityTable({
  activities = [],
  sortColumn = "activity_date",
  sortOrder = "desc",
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Client-side sort link generation
  const generateSortLink = (column) => {
    try {
      const params = new URLSearchParams(searchParams.toString());
      const newOrder =
        sortColumn === column && sortOrder === "desc" ? "asc" : "desc";
      params.set("sort", column);
      params.set("order", newOrder);
      return `/daily_activities/all_activities?${params.toString()}`;
    } catch (error) {
      console.error("Error generating sort link:", error);
      return "#";
    }
  };

  const renderSignature = (signature) => {
    if (!signature) return "-";
    return (
      <img
        src={signature}
        alt="Signature"
        className="h-12 w-auto object-contain"
        onError={(e) => {
          e.target.onError = null;
          e.target.style.display = "none";
          e.target.parentElement.textContent = "-";
        }}
      />
    );
  };

  const handleDeleteClick = (activityId) => {
    setActivityToDelete(activityId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!activityToDelete) return;
    try {
      const { error } = await supabase
        .from("daily_activities")
        .delete()
        .eq("id", activityToDelete);

      if (error) throw error;

      setShowDeleteModal(false);
      setActivityToDelete(null);
      router.refresh(); // Refresh the table after deletion
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Error deleting activity: " + error.message);
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        No activities recorded yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">
              <Link
                href={generateSortLink("activity_date")}
                className="flex items-center gap-1"
              >
                Date{" "}
                {sortColumn === "activity_date" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </Link>
            </th>
            <th className="py-3 px-4 text-left">
              <Link
                href={generateSortLink("nature_of_activity")}
                className="flex items-center gap-1"
              >
                Activity{" "}
                {sortColumn === "nature_of_activity" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </Link>
            </th>
            <th className="py-3 px-4 text-left">
              <Link
                href={generateSortLink("description")}
                className="flex items-center gap-1"
              >
                Description{" "}
                {sortColumn === "description" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </Link>
            </th>
            <th className="py-3 px-4 text-left">
              <Link
                href={generateSortLink("weeks(start_date)")}
                className="flex items-center gap-1"
              >
                Week{" "}
                {sortColumn === "weeks(start_date)" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </Link>
            </th>
            <th className="py-3 px-4 text-left">Student</th>
            <th className="py-3 px-4 text-left">Supervisor</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td className="py-3 px-4">
                {format(new Date(activity.activity_date), "MMM dd, yyyy")}
              </td>
              <td className="py-3 px-4">
                {activity.nature_of_activity || activity.activity_name}
              </td>
              <td
                className="py-3 px-4 max-w-xs truncate"
                title={activity.description}
              >
                {activity.description || "—"}
              </td>
              <td className="py-3 px-4">
                {activity.weeks
                  ? `Week ${activity.weeks.week_number} (${new Date(
                      activity.weeks.start_date
                    ).toLocaleDateString("en-GB")})`
                  : "—"}
              </td>
              <td className="py-3 px-4">
                {renderSignature(activity.student_signature)}
              </td>
              <td className="py-3 px-4">
                {renderSignature(activity.supervisor_signature)}
              </td>
              <td className="py-3 px-4">
                <Link
                  href={`/daily_activities/edit/${activity.id}`}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Edit
                </Link>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteClick(activity.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteConfirmation
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
