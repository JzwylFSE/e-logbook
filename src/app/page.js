import React from "react";
import { createClientForServer } from "../../utils/supabase/server";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const supabase = createClientForServer();

  // Get the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, render default avatar
  if (!user) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Logbook</h1>
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        </div>
        <p>Please sign in to access your logbook.</p>
      </div>
    );
  }

  // Fetch avatar URL and full name from profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url, full_name")
    .eq("id", user.id)
    .single();

  // Prepare a safe fallback URL
  const avatarUrl =
    profile?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile?.full_name || user.email?.split("@")[0] || "User"
    )}&background=random`;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Logbook</h1>

        <Link href="/settings" className="flex items-center">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={avatarUrl}
              alt="User Avatar"
              width={60}
              height={60}
              className="object-cover"
            />
          </div>
        </Link>
      </div>

      <div className="space-y-2">
        <p>
          <Link href="/weeks" className="text-blue-500 hover:underline">
            Weeks
          </Link>
        </p>
        <p>
          <Link
            href="/daily_activities"
            className="text-blue-500 hover:underline"
          >
            Daily Activity
          </Link>
        </p>
        <p>
          <Link
            href="/workdone_diagram"
            className="text-blue-500 hover:underline"
          >
            Diagram of Workdone
          </Link>
        </p>
      </div>
    </div>
  );
}
