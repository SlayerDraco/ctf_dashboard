// Profile Page
// User profile management with enhanced UI

"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Shield,
  Users,
  Trophy,
  Target,
  Calendar,
  Edit3,
  Save,
  X,
  CheckCircle,
  Crown,
  Star,
} from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState("CyberNinja")
  const [tempDisplayName, setTempDisplayName] = useState(displayName)

  // Mock user data
  const userData: {
    id: string
    email: string
    player_id: string
    role: "player" | "admin"
    team_name: string
    team_id: string
    created_at: string
    stats: {
      total_solves: number
      total_points: number
      rank: number
      highest_difficulty: number
      last_solve: string
    }
  } = {
    id: "user-123",
    email: "cyberninja@example.com",
    player_id: "PLAYER-ABC123",
    role: "player",
    team_name: "Elite Hackers",
    team_id: "team-456",
    created_at: "2024-01-15T10:30:00Z",
    stats: {
      total_solves: 12,
      total_points: 2450,
      rank: 3,
      highest_difficulty: 4,
      last_solve: "2024-01-20T15:45:00Z",
    },
  }

  const handleSave = () => {
    setDisplayName(tempDisplayName)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempDisplayName(displayName)
    setIsEditing(false)
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Trophy className="w-5 h-5 text-orange-400" />
    return <Star className="w-5 h-5 text-cyan-400" />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced Navigation */}
      <nav className="bg-black/50 backdrop-blur-sm border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/dashboard" className="text-xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              CTF Platform
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Challenges
              </Link>
              <Link href="/scoreboard" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Scoreboard
              </Link>
              <Link href="/teams" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Teams
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Profile</h1>
              <p className="text-gray-400">Manage your account and view your progress</p>
            </div>
          </div>
          <div className="w-full h-0.5 bg-gradient-to-r from-cyan-500/50 via-cyan-400/30 to-transparent" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <Card className="bg-gray-900/50 border-gray-700 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Display Name */}
                <div className="space-y-2">
                  <Label className="text-gray-300 font-medium">Display Name</Label>
                  {isEditing ? (
                    <Input
                      value={tempDisplayName}
                      onChange={(e) => setTempDisplayName(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-cyan-500"
                    />
                  ) : (
                    <div className="text-white text-lg font-semibold">{displayName}</div>
                  )}
                </div>

                <Separator className="bg-gray-700" />

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-gray-300 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <div className="text-white">{userData.email}</div>
                  <p className="text-gray-500 text-sm">Email cannot be changed</p>
                </div>

                <Separator className="bg-gray-700" />

                {/* Player ID */}
                <div className="space-y-2">
                  <Label className="text-gray-300 font-medium">Player ID</Label>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-800 px-3 py-2 rounded text-cyan-400 font-mono">{userData.player_id}</code>
                    <Badge variant="outline" className="text-green-400 border-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                {/* Role */}
                <div className="space-y-2">
                  <Label className="text-gray-300 font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Role
                  </Label>
                  <Badge
                    variant="outline"
                    className={
                      userData.role === "admin" ? "text-orange-400 border-orange-500" : "text-blue-400 border-blue-500"
                    }
                  >
                    {userData.role === "admin" ? (
                      <>
                        <Crown className="w-3 h-3 mr-1" />
                        Administrator
                      </>
                    ) : (
                      "Player"
                    )}
                  </Badge>
                </div>

                <Separator className="bg-gray-700" />

                {/* Team Information */}
                <div className="space-y-2">
                  <Label className="text-gray-300 font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Team
                  </Label>
                  {userData.team_name ? (
                    <div className="flex items-center gap-2">
                      <span className="text-white">{userData.team_name}</span>
                      <Link href="/teams">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                        >
                          View Team
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">No team</span>
                      <Link href="/teams">
                        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                          Join Team
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                <Separator className="bg-gray-700" />

                {/* Member Since */}
                <div className="space-y-2">
                  <Label className="text-gray-300 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </Label>
                  <div className="text-white">
                    {new Date(userData.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTF Status Alert */}
            <Alert className="border-cyan-500 bg-cyan-500/10">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <AlertDescription className="text-cyan-400">
                Profile changes are allowed before and after CTF events. Some features may be locked during active
                competitions.
              </AlertDescription>
            </Alert>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card className="bg-gray-900/50 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Performance Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Rank */}
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getRankIcon(userData.stats.rank)}
                    <span className="text-gray-300">Current Rank</span>
                  </div>
                  <span className="text-2xl font-bold text-white">#{userData.stats.rank}</span>
                </div>

                {/* Total Points */}
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <span className="text-gray-300">Total Points</span>
                  </div>
                  <span className="text-2xl font-bold text-cyan-400">
                    {userData.stats.total_points.toLocaleString()}
                  </span>
                </div>

                {/* Total Solves */}
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Challenges Solved</span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">{userData.stats.total_solves}</span>
                </div>

                {/* Highest Difficulty */}
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">Max Difficulty</span>
                  </div>
                  <div className="text-yellow-400 text-lg">
                    {"★".repeat(userData.stats.highest_difficulty)}
                    {"☆".repeat(5 - userData.stats.highest_difficulty)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gray-900/50 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-cyan-400">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-400">
                    Last solve: {new Date(userData.stats.last_solve).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">Keep solving challenges to improve your ranking!</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900/50 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-cyan-400">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700">View Challenges</Button>
                </Link>
                <Link href="/scoreboard">
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    View Scoreboard
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    Account Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
