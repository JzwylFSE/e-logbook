"use server"

import { createClientForServer } from "./server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";


// This file is used to create a supabase client for server-side actions.  

const signInWith = provider => async() => {
    const supabase = createClientForServer();

    const auth_callback_url = `${process.env.SITE_URL}/auth/callback`

    const {data, error} = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: auth_callback_url,
        },
    })

    console.log(data);
    
    if (error){
        console.log(error)
    }

    redirect(data.url);
}

const signInWithGoogle = signInWith("google")
export { signInWithGoogle };