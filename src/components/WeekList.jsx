"use client"

import { format } from "date-fns"

export default function WeekList({ weeks }) {
  if (!weeks || weeks.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        No weeks created yet
      </div>
    )
  }

  // exchange navigation arrows

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Week #</th>
            <th className="py-3 px-4 text-left">Start Date</th>
            <th className="py-3 px-4 text-left">End Date</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {weeks.map((week) => (
            <tr key={week.id}>
              <td className="py-3 px-4">{week.week_number}</td>
              <td className="py-3 px-4">
                {format(new Date(week.start_date), "MMM dd, yyyy")}
              </td>
              <td className="py-3 px-4">
                {format(new Date(week.end_date), "MMM dd, yyyy")}
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