"use client"

import { useState } from "react"
import { supabase } from "../../utils/supabase/client"
import { useRouter } from "next/navigation"
import { startOfWeek, addDays, format } from "date-fns"

export default function WeekForm({ userId, onSuccess }) {
  const router = useRouter()
  const [weekNumber, setWeekNumber] = useState("")
  const [startDate, setStartDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Calculate default week (current week Monday to Sunday)
  const calculateDefaultWeek = () => {
    const today = new Date()
    const monday = startOfWeek(today, { weekStartsOn: 1 })
    const sunday = addDays(monday, 6)
    return {
      start: format(monday, "yyyy-MM-dd"),
      end: format(sunday, "yyyy-MM-dd")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (!weekNumber || !startDate) {
      setError("Please fill all fields")
      setIsSubmitting(false)
      return
    }

    try {
      const defaultWeek = calculateDefaultWeek()
      const start = startDate || defaultWeek.start
      const end = format(addDays(new Date(start), 6), "yyyy-MM-dd")

      const { error } = await supabase
        .from("weeks")
        .insert([{
          user_id: userId,
          week_number: weekNumber,
          start_date: start,
          end_date: end
        }])

      if (error) throw error

      setWeekNumber("")
      setStartDate("")
      onSuccess?.()
      router.refresh()
    } catch (err) {
      setError(err.message)
      console.error("Error creating week:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Week</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Week Number</label>
          <input
            type="number"
            value={weekNumber}
            onChange={(e) => setWeekNumber(e.target.value)}
            className="w-full p-2 border rounded"
            required
            min="1"
          />
        </div>
        
        <div>
          <label className="block mb-1">Start Date (Monday)</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Select Monday to automatically calculate the full week (Monday-Sunday)
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white ${isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {isSubmitting ? "Creating..." : "Create Week"}
        </button>
      </form>
    </div>
  )
}