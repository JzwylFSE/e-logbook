import React from "react";
import { createClient } from "../../utils/supabase/client";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get user's avatar URL if exists
  const { data: avatarData } = await supabase
    .from('profiles') // or your user profile table
    .select('avatar_url')
    .eq('id', user?.id)
    .single();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Logbook</h1>
        
        <Link href="/settings" className="flex items-center">
          {user ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={
                  avatarData?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.email?.split('@')[0] || 'User'
                  )}&background=random`
                }
                alt="User Avatar"
                width={60}
                height={60}
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.email?.split('@')[0] || 'User'
                  )}&background=random`;
                }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          )}
        </Link>
      </div>
      
      <div className="space-y-2">
        <p>
          <Link href="/daily_activities" className="text-blue-500 hover:underline">
            Daily Activity
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
    </div>
  );
}