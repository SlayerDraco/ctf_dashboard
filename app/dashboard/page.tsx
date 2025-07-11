// Dashboard Page
// Main challenge browsing interface with category filtering and search

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { supabase, type Challenge, type CTFConfig } from "@/lib/supabase"
import { isCTFRunning } from "@/lib/utils"
import { Navbar } from "@/components/layout/navbar"
import { ChallengeCard } from "@/components/challenge/challenge-card"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Filter, Clock } from "lucide-react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // State management
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [solvedChallenges, setSolvedChallenges] = useState<Set<string>>(new Set())
  const [ctfConfig, setCTFConfig] = useState<CTFConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Fetch challenges and user solves
  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        // Fetch challenges
        const { data: challengesData, error: challengesError } = await supabase
          .from("challenges")
          .select("*")
          .eq("enabled", true)
          .order("points", { ascending: true })

        if (challengesError) throw challengesError

        // Fetch user's solved challenges
        const { data: solvesData, error: solvesError } = await supabase
          .from("solves")
          .select("challenge_id")
          .eq("user_id", user.id)

        if (solvesError) throw solvesError

        // Fetch CTF configuration
        const { data: configData, error: configError } = await supabase.from("ctf_config").select("*").single()

        if (configError) throw configError

        setChallenges(challengesData || [])
        setSolvedChallenges(new Set(solvesData?.map((solve) => solve.challenge_id) || []))
        setCTFConfig(configData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Handle challenge solve
  const handleChallengeSolve = () => {
    // Refresh data after solve
    if (user) {
      const fetchSolves = async () => {
        const { data: solvesData } = await supabase.from("solves").select("challenge_id").eq("user_id", user.id)

        if (solvesData) {
          setSolvedChallenges(new Set(solvesData.map((solve) => solve.challenge_id)))
        }
      }
      fetchSolves()
    }
  }

  // Filter challenges based on search and filters
  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || challenge.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || challenge.difficulty.toString() === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  // Get unique categories for filter
  const categories = Array.from(new Set(challenges.map((c) => c.category)))

  // Group challenges by category
  const challengesByCategory = filteredChallenges.reduce(
    (acc, challenge) => {
      if (!acc[challenge.category]) {
        acc[challenge.category] = []
      }
      acc[challenge.category].push(challenge)
      return acc
    },
    {} as Record<string, Challenge[]>,
  )

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

  const ctfRunning = ctfConfig && isCTFRunning(ctfConfig)

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with CTF status */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Challenges</h1>
              <p className="text-gray-400 mt-1">Solve challenges to earn points and climb the leaderboard</p>
            </div>

            {/* CTF Status and Timer */}
            {ctfConfig && (
              <div className="flex items-center gap-4">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    ctfRunning
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {ctfRunning ? "CTF Running" : "CTF Not Started"}
                </div>

                {ctfConfig.ctf_end_time && ctfRunning && (
                  <CountdownTimer targetDate={ctfConfig.ctf_end_time} label="Time Remaining" />
                )}
              </div>
            )}
          </div>

          {/* CTF not started message */}
          {ctfConfig && !ctfRunning && (
            <Alert className="mt-4 border-yellow-500 bg-yellow-500/10">
              <Clock className="w-4 h-4 text-yellow-400" />
              <AlertDescription className="text-yellow-400">
                The CTF has not started yet. You can view challenges but cannot submit flags until the competition
                begins.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span>Total Challenges: {challenges.length}</span>
            <span>Solved: {solvedChallenges.size}</span>
            <span>Remaining: {challenges.length - solvedChallenges.size}</span>
          </div>
        </div>

        {/* Challenges Grid */}
        {Object.keys(challengesByCategory).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No challenges found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(challengesByCategory).map(([category, categoryCharlenges]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                  <Filter className="w-6 h-6" />
                  {category}
                  <span className="text-sm text-gray-400 font-normal">
                    ({categoryCharlenges.length} challenge{categoryCharlenges.length !== 1 ? "s" : ""})
                  </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryCharlenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      isSolved={solvedChallenges.has(challenge.id)}
                      onSolve={handleChallengeSolve}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
