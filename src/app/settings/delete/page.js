"use client"

import { useState } from "react"
import { supabase } from "../../../../utils/supabase/client"
import { useRouter } from "next/navigation"

export default function DeleteAccountPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (confirmation !== "DELETE MY ACCOUNT") {
      setError("Please type 'DELETE MY ACCOUNT' to confirm")
      return
    }

    setLoading(true)
    setError("")
    
    try {
      // first verify password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: supabase.auth.user()?.email || "",
        password
      })

      if (signInError) throw signInError

      // then delete account
      const { error: deleteError } = await supabase.rpc("delete_user")

      if (deleteError) throw deleteError
      
      // sign out after deletion
      await supabase.auth.signOut()
      router.push("/auth")
    } catch (err) {
      setError(err.message || "Failed to delete account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-2">Delete Account</h1>
      <p className="text-red-500 mb-6">This action cannot be undone!</p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Type <span className="font-mono">DELETE MY ACCOUNT</span> to confirm
          </label>
          <input
            type="text"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"}`}
        >
          {loading ? "Deleting..." : "Permanently Delete Account"}
        </button>
      </form>
    </div>
  )
}