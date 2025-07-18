"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("Client-side user:", user);
      setUser(user);
      setLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  };

  if (loading) {
    return (
      <button className="px-4 py-2 bg-gray-300 text-white rounded opacity-50">
        Loading...
      </button>
    );
  }

  return user ? (
    <div className="flex items-cenyter gap-4">
      <span className="text-sm text-gray-600 hidden md:inline">
        {user.email}
      </span>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red hover:bg-red-600 text-white rounded"
      >
        Logout
      </button>
    </div>
  ) : (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-blue-5000 hover:bg-blue-600 text-white rounded"
    >
      Login
    </button>
  );
}
