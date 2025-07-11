// Supabase client configuration
// This file sets up the connection to our Supabase backend

import { createClient } from "@supabase/supabase-js"

// Get environment variables for Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create and export the Supabase client
// This client handles authentication, database queries, and real-time subscriptions
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Type definitions for our database schema
// These help with TypeScript autocomplete and type safety
export interface User {
  id: string
  email: string
  display_name: string | null
  role: "admin" | "player"
  player_id: string | null
  team_id: string | null
  created_at: string
}

export interface Team {
  id: string
  name: string
  created_by: string
  created_at: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  category: string
  points: number
  difficulty: number
  link: string | null
  file_path: string | null
  flag: string
  enabled: boolean
  solve_count: number
  created_at: string
}

export interface Solve {
  id: string
  user_id: string
  team_id: string | null
  challenge_id: string
  submitted_at: string
}

export interface CTFConfig {
  id: string
  ctf_started: boolean
  ctf_start_time: string | null
  ctf_end_time: string | null
  updated_at: string
}

// Helper function to check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.role === "admin"
}

// Helper function to format player ID
export const formatPlayerId = (playerId: string | null): string => {
  return playerId || "Not assigned"
}
