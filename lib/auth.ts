"use client"

// Authentication utilities and hooks
import { useEffect, useState } from "react"
import { supabase, type User } from "./supabase"

// Custom hook to manage authentication state
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        // Check if user profile exists
        const { data: profile, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        // If not found, insert them
        if (!profile && session.user) {
          await supabase.from("users").insert({
            id: session.user.id,
            email: session.user.email,
            display_name: session.user.email?.split("@")[0],
            player_id: `PLAYER-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
            role: "player",
          })

          const { data: newProfile } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()

          setUser(newProfile)
        } else {
          setUser(profile)
        }
      }

      setLoading(false)
    }

    getInitialSession()

    // Auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()
        setUser(profile)
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}

// 🧠 Signup + insert user helper
export async function signUpAndInsertUser(email: string, password: string, displayName: string) {
  // 1. Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  })

  if (authError) return { error: authError.message }

  const user = authData.user
  if (!user) return { error: "No user returned from Supabase Auth" }

  // 2. Check if already in users table
  const { data: exists } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle()

  if (!exists) {
    const { error: insertError } = await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      display_name: displayName || user.email?.split("@")[0],
      player_id: `PLAYER-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      role: "player",
    })

    if (insertError) return { error: insertError.message }
  }

  return { success: true }
}

export async function signInWithProvider(provider: 'google' | 'github') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
  })
  return { data, error }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}/reset-password`,
  });
  return { error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}
