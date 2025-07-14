import React from "react";
import AuthForm from "@/components/AuthForm";
//import { createClientForServer } from "../../utils/supabase/server";

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">E-Logbook</h1>
      <h1 className="text-3xl font-bold">Not Authenticated</h1>
      <p className="text-lg">Please sign in to continue</p>
      <AuthForm />
    </div>
  );
}
