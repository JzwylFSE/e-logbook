"use server"

import React from "react";
import Image from "next/image";
//import { createClientForServer } from "@/utils/supabase/server";
import { createClientForServer } from "../../utils/supabase/server";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const supabase = createClientForServer();
  //const supabase = await createClientForServer();

  const session = await supabase.auth.getUser();
  console.log(session);

  return (
    <div>
      <p>Logbook</p>
      <p><Link href="/daily_activities">Daily Activities</Link> </p>
      <p> <Link href="/weeks">Weeks</Link> </p>
      <p> <Link href="/workdone_diagram">Diagram of Workdone</Link> </p>
    </div>
  );
}
