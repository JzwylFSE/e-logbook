import React from "react";
import { createClientForServer } from "../../utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default async function Home() {
  const supabase = createClientForServer();

  // Get the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Fetch avatar URL and full name from profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url, full_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="p-4">
      <SpeedInsights />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Logbook</h1>
        <Link href="/settings" className="flex items-center">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="User Avatar"
                width={100}
                height={100}
                className="object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
            )}
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