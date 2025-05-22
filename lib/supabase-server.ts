import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "./database.types"
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
  
export const createServerClient = () => {
  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials not found. Using mock client for preview.")
    // Return a mock client that won't throw errors
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null }),
            order: () => ({
              limit: () => Promise.resolve({ data: [] }),
            }),
          }),
          order: () => ({
            limit: () => Promise.resolve({ data: [] }),
          }),
        }),
      }),
    } as any
  }
const cookieStore = cookies() // ✅ Valid because it's sync in this context
  return createServerComponentClient({ cookies: () => cookieStore })
}

