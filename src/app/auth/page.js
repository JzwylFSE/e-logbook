"use server"

import { createClientForServer } from "../../../utils/supabase/server"
import { redirect } from "next/navigation"
import AuthForm from "@/components/AuthForm"

export default async function AuthPage() {
  const supabase = createClientForServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/") 
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-2">E-Logbook</h1>
        <p className="text-gray-600 text-center mb-8">Track your IT activities</p>
        
        <AuthForm />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  )
}