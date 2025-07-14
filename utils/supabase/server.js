import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClientForServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookies().get(name)?.value
        },
        set(name, value, options) {
          try {
            cookies().set({ name, value, ...options })
          } catch (error) {
            console.error('Cookie set error:', error)
          }
        },
        remove(name, options) {
          try {
            cookies().set({
              name,
              value: '',
              expires: new Date(0), // Expire the cookie
              ...options
            })
          } catch (error) {
            console.error('Cookie remove error:', error)
          }
        }
      }
    }
  )
}