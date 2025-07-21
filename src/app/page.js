"use server"

import React from "react"
import { createClient } from "../../utils/supabase/client"
import Link from "next/link"
import AuthButton from "@/components/AuthButton"

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  console.log("User session:", {user})

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Logbook</h1>
        <AuthButton />
      </div>
      
      <div className="space-y-2">
        <p>
          <Link href="/daily_activities" className="text-blue-500 hover:underline">
            Daily Activities
          </Link>
        </p>
        <p>
          <Link href="/weeks" className="text-blue-500 hover:underline">
            Weeks
          </Link>
        </p>
        <p>
          <Link href="/workdone_diagram" className="text-blue-500 hover:underline">
            Diagram of Workdone
          </Link>
        </p>
      </div>
{/* 
      {user && (
        <div className="mt-8 p-4 bg-yellow-100 border border-yellow-300 rounded">
          <p>Please login to access all features</p>
        </div>
      )} */}
    </div>
  )
}