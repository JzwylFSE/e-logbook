"use client"

import { format } from "date-fns"

export default function ActivityTable({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        No activities recorded yet
      </div>
    )
  }

  const renderSignature = (signature) => {
    if (!signature) return "—"
    return (
      <img 
        src={signature} 
        alt="Signature"
        className="h-12 w-auto object-contain"
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Date</th>
            <th className="py-3 px-4 text-left">Week</th>
            <th className="py-3 px-4 text-left">Activity</th>
            <th className="py-3 px-4 text-left">Description</th>
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
                Week {activity.weeks?.week_number}
              </td>
              <td className="py-3 px-4">{activity.nature_of_activity}</td>
              <td className="py-3 px-4 max-w-xs truncate" title={activity.description}>
                {activity.description || "—"}
              </td>
              <td className="py-3 px-4">
                {renderSignature(activity.student_signature)}
              </td>
              <td className="py-3 px-4">
                {renderSignature(activity.supervisor_signature)}
              </td>
              <td className="py-3 px-4">
                <button className="text-blue-500 hover:text-blue-700 mr-2">
                  Edit
                </button>
                <button className="text-red-500 hover:text-red-700">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}