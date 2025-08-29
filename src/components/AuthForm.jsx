"use client";
import { useState } from "react";
import { supabase } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // 'login', 'signup', or 'reset'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // fallback to window.location.origin if env var missing
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.refresh();
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${SITE_URL}/auth/confirm`,
          },
        });
        if (error) throw error;
        setMessage("Check your email for verification!");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${SITE_URL}/auth/update-password`,
        });
        if (error) throw error;
        setMessage("Password reset link sent to your email!");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${SITE_URL}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 py-2 font-medium ${
            mode === "login"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`flex-1 py-2 font-medium ${
            mode === "signup"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
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

        {mode !== "reset" && (
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
        )}

        {mode === "login" && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setMode("reset")}
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading
            ? "Processing..."
            : mode === "login"
            ? "Login"
            : mode === "signup"
            ? "Sign Up"
            : "Send Reset Link"}
        </button>

        {mode === "reset" && (
          <button
            type="button"
            onClick={() => setMode("login")}
            className="w-full py-2 px-4 text-blue-500 hover:underline"
          >
            Back to login
          </button>
        )}
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleOAuthLogin("google")}
          disabled={loading}
          className={`flex items-center justify-center gap-2 py-2 px-4 border rounded ${
            loading ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Google</span>
        </button>

        <button
          onClick={() => handleOAuthLogin("apple")}
          disabled={loading}
          className={`flex items-center justify-center gap-2 py-2 px-4 border rounded ${
            loading ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <span>Apple</span>
        </button>
      </div>
    </div>
  );
}
