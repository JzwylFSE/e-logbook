"use server"

import { createClientForServer } from "../../../../utils/supabase/server"
import { redirect } from "next/navigation"

export default async function EmailConfirmPage() {
  const supabase = createClientForServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect("/")
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <p>Please check your email for a verification link.</p>
        <p className="mt-2 text-sm text-gray-600">
          If you didn't receive an email, please check your spam folder.
        </p>
      </div>
    </div>
  )
}