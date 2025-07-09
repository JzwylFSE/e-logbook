import { createClient } from './server'

export async function getSession() {
  const supabase = createClient()
  return supabase.auth.getSession()
}

export async function getUser() {
  const supabase = createClient()
  return supabase.auth.getUser()
}

export async function signOut() {
  const supabase = createClient()
  return supabase.auth.signOut()
}