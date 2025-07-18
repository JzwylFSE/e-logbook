"use client"

import { useState } from "react"
import { supabase } from "../../utils/supabase/client"
import { useRouter } from "next/navigation"

export default function AuthForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        if (error) throw error
        alert("Check your email for confirmation!")
      }
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 py-2 font-medium ${mode === "login" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`flex-1 py-2 font-medium ${mode === "signup" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {loading ? "Processing..." : mode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 py-2 px-4 border rounded ${loading ? "bg-gray-100" : "hover:bg-gray-50"}`}
      >
        <img 
          src="https://www.google.com/favicon.ico" 
          alt="Google" 
          className="w-5 h-5"
          width="20"
          height="20"
        />
        <span>Google</span>
      </button>
    </div>
  )
}