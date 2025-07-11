// Scoreboard Page
// Real-time team leaderboard with live updates

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { formatPoints, formatTimeAgo } from "@/lib/utils"
import { Navbar } from "@/components/layout/navbar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Users, Clock, Target } from "lucide-react"

interface LeaderboardEntry {
  team_id: string
  team_name: string
  total_score: number
  solve_count: number
  last_solve_time: string | null
  max_difficulty: number
}

export default function ScoreboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase.rpc("get_team_leaderboard")

      if (error) throw error

      setLeaderboard(data || [])
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    if (!user) return
    fetchLeaderboard()
  }, [user])

  // Set up real-time subscription for live updates
  useEffect(() => {
    if (!user) return

    // Subscribe to solves table for real-time updates
    const subscription = supabase
      .channel("scoreboard-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "solves",
        },
        () => {
          // Refresh leaderboard when new solve is added
          fetchLeaderboard()
        },
      )
      .subscribe()

    // Set up periodic refresh (every 30 seconds)
    const interval = setInterval(fetchLeaderboard, 30000)

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
    }
  }, [user])

  // Get rank icon based on position
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{rank}</span>
    }
  }

  // Get rank styling
  const getRankStyling = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30"
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30"
      case 3:
        return "bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30"
      default:
        return "bg-gray-900/50 border-gray-700"
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Trophy className="w-8 h-8 text-cyan-400" />
                Scoreboard
              </h1>
              <p className="text-gray-400 mt-1">Live team rankings and competition standings</p>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-400">Last updated: {lastUpdate.toLocaleTimeString()}</div>
              <div className="text-xs text-gray-500">Updates automatically every 30 seconds</div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-cyan-400 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Total Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{leaderboard.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-cyan-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Top Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {leaderboard.length > 0 ? formatPoints(leaderboard[0].total_score) : "0"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-cyan-400 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Latest Solve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg text-white">
                {leaderboard.length > 0 && leaderboard[0].last_solve_time
                  ? formatTimeAgo(leaderboard[0].last_solve_time)
                  : "No solves yet"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        {leaderboard.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Teams Yet</h3>
              <p className="text-gray-500">Teams will appear here once they start solving challenges.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((team, index) => {
              const rank = index + 1
              const isUserTeam = user.team_id === team.team_id

              return (
                <Card
                  key={team.team_id}
                  className={`${getRankStyling(rank)} ${
                    isUserTeam ? "ring-2 ring-cyan-500/50" : ""
                  } transition-all duration-300 hover:shadow-lg`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Rank and Team Info */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/50">
                          {getRankIcon(rank)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white">{team.team_name}</h3>
                            {isUserTeam && (
                              <Badge variant="outline" className="text-cyan-400 border-cyan-500">
                                Your Team
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                            <span>{team.solve_count} solves</span>
                            {team.max_difficulty > 0 && <span>Max difficulty: {"★".repeat(team.max_difficulty)}</span>}
                            {team.last_solve_time && <span>Last solve: {formatTimeAgo(team.last_solve_time)}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="text-3xl font-bold text-cyan-400">{formatPoints(team.total_score)}</div>
                        <div className="text-sm text-gray-400">points</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Scoreboard updates in real-time as teams solve challenges</p>
        </div>
      </main>
    </div>
  )
}
