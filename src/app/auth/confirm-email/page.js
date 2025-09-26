"use server";

import { createClientForServer } from "../../../../utils/supabase/server";
import { redirect } from "next/navigation";

export default async function EmailConfirmPage() {
  const supabase = createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  } else {
    // Redirect authenticated user to the app core
    redirect("/");
  }

  return null;
}
