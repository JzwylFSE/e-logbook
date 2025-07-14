"use client"

import { useState } from "react"
import { supabase } from "../../utils/supabase/client"
import { useRouter } from "next/navigation"

export default function WeekForm({ userId }) {
  const router = useRouter()
  const [weekNumber, setWeekNumber] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { error } = await supabase
      .from('weeks')
      .insert([{
        user_id: userId,
        week_number: weekNumber,
        start_date: startDate,
        end_date: endDate
      }])

    setIsSubmitting(false)

    if (error) {
      alert('Error creating week: ' + error.message)
    } else {
      router.refresh()
      setWeekNumber('')
      setStartDate('')
      setEndDate('')
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Week</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Week Number</label>
          <input
            type="number"
            value={weekNumber}
            onChange={(e) => setWeekNumber(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isSubmitting ? 'Adding...' : 'Add Week'}
        </button>
      </form>
    </div>
  )
}