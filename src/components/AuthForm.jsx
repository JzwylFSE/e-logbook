"use client";

import { supabase } from "../../utils/supabase/client";
import React from "react";
import { signInWithGoogle } from "../../utils/supabase/actions";

export default function AuthForm() {
  return (
    <div>
      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="btn text-bold bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign In with Google
        </button>
      </form>
    </div>
  );
}
