"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { SupabaseClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const [supabase] = useState(() => {
    // If environment variables are not available, create a mock client
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase credentials not found. Using mock client for preview.")
      // Return a mock client that won't throw errors
      return {
        auth: {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: () => Promise.resolve({ data: null, error: null }),
          signOut: () => Promise.resolve({ error: null }),
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
              order: () => ({
                limit: () => Promise.resolve({ data: [], error: null }),
              }),
            }),
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: null }),
            }),
          }),
          insert: () => Promise.resolve({ error: null }),
          update: () => ({
            eq: () => Promise.resolve({ error: null }),
          }),
        }),
        channel: () => ({
          on: () => ({
            subscribe: () => ({}),
          }),
        }),
        removeChannel: () => {},
      } as unknown as SupabaseClient<Database>
    }

    // Otherwise create a real client
    return createClientComponentClient<Database>()
  })

  useEffect(() => {
    if (supabaseUrl && supabaseAnonKey) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(() => {
        // Refresh the page on auth state change
      })

      return () => {
        subscription?.unsubscribe()
      }
    }
  }, [supabase])

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}
