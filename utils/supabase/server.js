import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClientForServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        async get(name) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name, value, options) {
          try {
            const cookieStore = await cookies();
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.error("Cookie set error:", error);
          }
        },
        async remove(name, options) {
          try {
            const cookieStore = await cookies();
            cookieStore.set({
              name,
              value: "",
              expires: new Date(0),
              ...options,
            });
          } catch (error) {
            console.error("Cookie remove error:", error);
          }
        },
      },
    }
  );
}
