"use client"

export default function WeekList({ weeks, getWeekRange }) {
  if (!weeks || weeks.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        No weeks created yet
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Week #</th>
            <th className="py-3 px-4 text-left">Date Range (Monday-Sunday)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {weeks.map((week) => {
            const weekRange = getWeekRange(week.start_date)
            return (
              <tr key={week.id}>
                <td className="py-3 px-4">{week.week_number}</td>
                <td className="py-3 px-4">
                  {weekRange.monday} - {weekRange.sunday}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}