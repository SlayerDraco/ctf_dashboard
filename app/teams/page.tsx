// Teams Page
// Team management interface for creating, joining, and managing teams

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { supabase, type Team, type User, type CTFConfig } from "@/lib/supabase"
import { isCTFRunning } from "@/lib/utils"
import { Navbar } from "@/components/layout/navbar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, Plus, UserPlus, UserMinus, Crown, Trash2, Lock, AlertTriangle } from "lucide-react"

interface TeamWithMembers extends Team {
  members: User[]
  member_count: number
}

export default function TeamsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // State management
  const [teams, setTeams] = useState<TeamWithMembers[]>([])
  const [userTeam, setUserTeam] = useState<TeamWithMembers | null>(null)
  const [ctfConfig, setCTFConfig] = useState<CTFConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [joinTeamId, setJoinTeamId] = useState("")
  const [message, setMessage] = useState<{
    type: "error" | "success" | null
    text: string
  }>({ type: null, text: "" })

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Fetch teams and CTF config
  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        // Fetch all teams with member count
        const { data: teamsData, error: teamsError } = await supabase
          .from("teams")
          .select(`
            *,
            members:users(*)
          `)
          .order("created_at", { ascending: false })

        if (teamsError) throw teamsError

        // Process teams data to include member count
        const processedTeams = (teamsData || []).map((team) => ({
          ...team,
          member_count: team.members?.length || 0,
        }))

        // Find user's team
        const currentUserTeam = processedTeams.find((team) => team.members?.some((member) => member.id === user.id))

        // Fetch CTF configuration
        const { data: configData, error: configError } = await supabase.from("ctf_config").select("*").single()

        if (configError) throw configError

        setTeams(processedTeams)
        setUserTeam(currentUserTeam || null)
        setCTFConfig(configData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setMessage({
          type: "error",
          text: "Failed to load teams data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Create new team
  const handleCreateTeam = async () => {
    if (!user || !newTeamName.trim()) return

    setIsCreating(true)
    setMessage({ type: null, text: "" })

    try {
      // Create team
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert({
          name: newTeamName.trim(),
          created_by: user.id,
        })
        .select()
        .single()

      if (teamError) throw teamError

      // Update user's team_id
      const { error: userError } = await supabase.from("users").update({ team_id: teamData.id }).eq("id", user.id)

      if (userError) throw userError

      setMessage({
        type: "success",
        text: "Team created successfully!",
      })
      setNewTeamName("")

      // Refresh data
      window.location.reload()
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to create team",
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Join team
  const handleJoinTeam = async (teamId: string) => {
    if (!user) return

    setIsJoining(true)
    setMessage({ type: null, text: "" })

    try {
      // Check if team has space (max 5 members)
      const team = teams.find((t) => t.id === teamId)
      if (!team) throw new Error("Team not found")

      if (team.member_count >= 5) {
        throw new Error("Team is full (maximum 5 members)")
      }

      // Update user's team_id
      const { error } = await supabase.from("users").update({ team_id: teamId }).eq("id", user.id)

      if (error) throw error

      setMessage({
        type: "success",
        text: "Successfully joined team!",
      })

      // Refresh data
      window.location.reload()
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to join team",
      })
    } finally {
      setIsJoining(false)
    }
  }

  // Leave team
  const handleLeaveTeam = async () => {
    if (!user || !userTeam) return

    try {
      // Update user's team_id to null
      const { error } = await supabase.from("users").update({ team_id: null }).eq("id", user.id)

      if (error) throw error

      setMessage({
        type: "success",
        text: "Successfully left team!",
      })

      // Refresh data
      window.location.reload()
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to leave team",
      })
    }
  }

  // Delete team (only team creator)
  const handleDeleteTeam = async () => {
    if (!user || !userTeam || userTeam.created_by !== user.id) return

    try {
      // First, remove all members from the team
      const { error: membersError } = await supabase.from("users").update({ team_id: null }).eq("team_id", userTeam.id)

      if (membersError) throw membersError

      // Then delete the team
      const { error: teamError } = await supabase.from("teams").delete().eq("id", userTeam.id)

      if (teamError) throw teamError

      setMessage({
        type: "success",
        text: "Team deleted successfully!",
      })

      // Refresh data
      window.location.reload()
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to delete team",
      })
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

  const ctfRunning = ctfConfig && isCTFRunning(ctfConfig)
  const canManageTeams = !ctfRunning // Teams can only be managed before CTF starts

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-cyan-400" />
            Teams
          </h1>
          <p className="text-gray-400 mt-1">Create or join a team to compete together (maximum 5 members per team)</p>
        </div>

        {/* CTF Running Warning */}
        {ctfRunning && (
          <Alert className="mb-6 border-yellow-500 bg-yellow-500/10">
            <Lock className="w-4 h-4 text-yellow-400" />
            <AlertDescription className="text-yellow-400">
              Team management is locked while the CTF is running. You cannot create, join, or leave teams during the
              competition.
            </AlertDescription>
          </Alert>
        )}

        {/* Error/Success Messages */}
        {message.type && (
          <Alert
            className={`mb-6 ${
              message.type === "success" ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"
            }`}
          >
            <AlertDescription className={message.type === "success" ? "text-green-400" : "text-red-400"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User's Team Section */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Your Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userTeam ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{userTeam.name}</h3>
                      <p className="text-gray-400 text-sm">{userTeam.member_count}/5 members</p>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-300">Members:</h4>
                      {userTeam.members?.map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <span className="text-gray-300">{member.display_name || member.email}</span>
                          {member.id === userTeam.created_by && (
                            <Badge variant="outline" className="text-yellow-400 border-yellow-500">
                              Leader
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Team Actions */}
                    {canManageTeams && (
                      <div className="space-y-2 pt-4 border-t border-gray-700">
                        <Button
                          onClick={handleLeaveTeam}
                          variant="outline"
                          className="w-full border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                        >
                          <UserMinus className="w-4 h-4 mr-2" />
                          Leave Team
                        </Button>

                        {user.id === userTeam.created_by && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full border-red-600 text-red-500 hover:bg-red-600/10 bg-transparent"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Team
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-900 border-gray-700">
                              <DialogHeader>
                                <DialogTitle className="text-red-400 flex items-center gap-2">
                                  <AlertTriangle className="w-5 h-5" />
                                  Delete Team
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p className="text-gray-300">
                                  Are you sure you want to delete this team? This action cannot be undone and will
                                  remove all members from the team.
                                </p>
                                <div className="flex gap-2">
                                  <Button onClick={handleDeleteTeam} className="bg-red-600 hover:bg-red-700">
                                    Yes, Delete Team
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-gray-400">You're not part of any team yet.</p>

                    {canManageTeams && (
                      <div className="space-y-3">
                        {/* Create Team */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Create Team
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-cyan-400">Create New Team</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="teamName" className="text-gray-300">
                                  Team Name
                                </Label>
                                <Input
                                  id="teamName"
                                  value={newTeamName}
                                  onChange={(e) => setNewTeamName(e.target.value)}
                                  placeholder="Enter team name"
                                  className="bg-gray-800 border-gray-600 text-white"
                                />
                              </div>
                              <Button
                                onClick={handleCreateTeam}
                                disabled={isCreating || !newTeamName.trim()}
                                className="w-full bg-cyan-600 hover:bg-cyan-700"
                              >
                                {isCreating ? <LoadingSpinner size="sm" /> : "Create Team"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <p className="text-gray-500 text-sm">or join an existing team below</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Available Teams Section */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">All Teams</CardTitle>
              </CardHeader>
              <CardContent>
                {teams.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No teams created yet.</p>
                    {canManageTeams && <p className="text-gray-500 text-sm mt-2">Be the first to create a team!</p>}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {teams.map((team) => (
                      <div
                        key={team.id}
                        className={`p-4 rounded-lg border ${
                          userTeam?.id === team.id
                            ? "bg-cyan-500/10 border-cyan-500/30"
                            : "bg-gray-800/50 border-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                              {userTeam?.id === team.id && (
                                <Badge variant="outline" className="text-cyan-400 border-cyan-500">
                                  Your Team
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">{team.member_count}/5 members</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {team.member_count >= 5 && (
                              <Badge variant="outline" className="text-red-400 border-red-500">
                                Full
                              </Badge>
                            )}

                            {canManageTeams && !userTeam && team.member_count < 5 && (
                              <Button
                                onClick={() => handleJoinTeam(team.id)}
                                disabled={isJoining}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {isJoining ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <>
                                    <UserPlus className="w-4 h-4 mr-1" />
                                    Join
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Team Members Preview */}
                        {team.members && team.members.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <div className="flex flex-wrap gap-2">
                              {team.members.map((member) => (
                                <div key={member.id} className="flex items-center gap-1 text-sm text-gray-400">
                                  <span>{member.display_name || member.email}</span>
                                  {member.id === team.created_by && <Crown className="w-3 h-3 text-yellow-400" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
