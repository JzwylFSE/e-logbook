"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../utils/supabase/client"
import WeekForm from "@/components/WeekForm"
import WeekList from "@/components/WeekList"
import { format, startOfWeek, addDays } from "date-fns"

export default function WeeksPage() {
  const [weeks, setWeeks] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        await loadWeeks(user.id)
      }
      setLoading(false)
    }
    getSession()
  }, [])

  const loadWeeks = async (userId) => {
    setLoading(true)
    const { data, error } = await supabase
      .from("weeks")
      .select("*")
      .eq("user_id", userId)
      .order("start_date", { ascending: false })
    
    if (!error) {
      setWeeks(data || [])
    }
    setLoading(false)
  }

  // Function to calculate week range (Monday to Sunday)
  const getWeekRange = (startDate) => {
    const monday = startOfWeek(new Date(startDate), { weekStartsOn: 1 })
    const sunday = addDays(monday, 6)
    return {
      monday: format(monday, "MMM dd, yyyy"),
      sunday: format(sunday, "MMM dd, yyyy")
    }
  }

  if (loading) {
    return <div className="p-4">Loading weeks...</div>
  }

  if (!user) {
    return <div className="p-4">Please sign in to view your logbook</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Weekly Logs</h1>
      <WeekForm userId={user.id} onSuccess={() => loadWeeks(user.id)} />
      <WeekList weeks={weeks} getWeekRange={getWeekRange} />
    </div>
  )
}