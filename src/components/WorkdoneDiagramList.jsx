"use client"

import { format } from "date-fns"

export default function WorkdoneDiagramList({ diagrams, activities, weeks }) {
  if (!diagrams || diagrams.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        No diagrams created yet
      </div>
    )
  }

  const getActivityInfo = (activityId) => {
    const activity = activities?.find(a => a.id === activityId)
    if (!activity) return "—"
    return `${activity.nature_of_activity} (${format(new Date(activity.activity_date), "MMM dd")})`
  }

  const getWeekInfo = (weekId) => {
    const week = weeks?.find(w => w.id === weekId)
    if (!week) return "—"
    return `Week ${week.week_number}`
  }

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Week</th>
            <th className="py-3 px-4 text-left">Activity</th>
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-left">Created</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {diagrams.map((diagram) => (
            <tr key={diagram.id}>
              <td className="py-3 px-4">{diagram.title}</td>
              <td className="py-3 px-4">{getWeekInfo(diagram.week_id)}</td>
              <td className="py-3 px-4">{getActivityInfo(diagram.activity_id)}</td>
              <td className="py-3 px-4 max-w-xs truncate" title={diagram.description}>
                {diagram.description || "—"}
              </td>
              <td className="py-3 px-4">
                {format(new Date(diagram.created_at), "MMM dd, yyyy")}
              </td>
              <td className="py-3 px-4">
                <button className="text-blue-500 hover:text-blue-700 mr-2">
                  View
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