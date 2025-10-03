// app/auth/callback/page.js
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../../../utils/supabase/client";
import { useRouter } from "next/navigation";

function CallbackPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing authentication...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus("Processing authentication...");

        // This handles ALL types of callbacks: signup, signin, recovery, OAuth
        const { data, error } = await supabase.auth.getSession({
          url: window.location.href,
          options: { storeSession: true }
        });

        if (error) {
          console.error("Auth callback error:", error);
          setStatus("Authentication failed. Redirecting...");
          setTimeout(() => router.push("/auth?error=auth_failed"), 2000);
          return;
        }

        // Success! User is now authenticated
        setStatus("Authentication successful!");

        // Refresh the router to update auth state everywhere
        router.refresh();

        // Redirect to home or dashboard after a brief delay
        setTimeout(() => {
          router.push("/");
        }, 1000);

      } catch (error) {
        console.error("Unexpected error in auth callback:", error);
        setStatus("An unexpected error occurred. Redirecting...");
        setTimeout(() => router.push("/auth?error=unexpected_error"), 2000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Completing Authentication</h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}

// Export with Suspense boundary
export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <CallbackPageContent />
    </Suspense>
  );
}
