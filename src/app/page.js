import React from "react";
import { createClientForServer } from "../../utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

  // Get signed URL for avatar if it exists
  let avatarUrl = "";
  if (profile?.avatar_url) {
    const { data, error } = await supabase.storage
      .from("avatars")
      .createSignedUrl(profile.avatar_url, 60 * 60); // 1 hour validity
    if (!error && data?.signedUrl) {
      avatarUrl = data.signedUrl;
    }
  }

  return (
    <div className="p-4">
      <SpeedInsights />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Logbook</h1>
        <Link href="/settings" className="flex items-center">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="User Avatar"
                width={100}
                height={100}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded-full" />
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
