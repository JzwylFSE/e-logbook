"use client";

import { useEffect, useState } from "react"
import { supabase } from "../../../utils/supabase/client"
import WeekForm from "@/components/WeekForm";
import WeekList from "@/components/WeekList";

export default function WeeksPage() {
  const [weeks, setWeeks] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user){
        loadWeeks(user.id)
      } else{
        <p>Please sign in to view your logbook</p>
      }
    }
    getSession()
  }, [])

  //if (!user) return 

  const loadWeeks = async (userId) => {
    const { data } = await supabase
      .from('weeks')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })
    setWeeks(data || [])
  }



  return (
    <div className="space-y-8">
      <WeekForm onSuccess={() => loadWeeks(user.id)} />
      <WeekList weeks={weeks} />
    </div>
  )
}