import { createClientForServer } from "./utils/supabase/server"
import { NextResponse } from "next/server"

export async function middleware(request) {
  const supabase = createClientForServer()
  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Allow access to auth pages when logged out
  if (!user && !pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  // Redirect logged-in users away from auth pages
  if (user && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}