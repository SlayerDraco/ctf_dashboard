// Admin Panel Page
// Administrative interface for managing CTF platform

"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  Users,
  Target,
  Upload,
  Download,
  Crown,
  Settings,
  BarChart3,
} from "lucide-react"

export default function AdminPage() {
  const [ctfRunning, setCTFRunning] = useState(false)
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<any>(null)

  // Mock data
  const challenges = [
    {
      id: "1",
      title: "Welcome to CTF",
      category: "Web",
      points: 50,
      difficulty: 1,
      enabled: true,
      solves: 45,
      flag: "CTF{welcome_to_the_game}",
    },
    {
      id: "2",
      title: "Basic Crypto",
      category: "Crypto",
      points: 100,
      difficulty: 2,
      enabled: true,
      solves: 23,
      flag: "CTF{base64_is_easy}",
    },
    {
      id: "3",
      title: "SQL Injection",
      category: "Web",
      points: 200,
      difficulty: 3,
      enabled: false,
      solves: 12,
      flag: "CTF{sql_injection_master}",
    },
  ]

  const users = [
    {
      id: "1",
      email: "player1@example.com",
      display_name: "CyberNinja",
      role: "player",
      team: "Elite Hackers",
      solves: 12,
    },
    {
      id: "2",
      email: "admin@example.com",
      display_name: "Admin",
      role: "admin",
      team: null,
      solves: 0,
    },
  ]

  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    category: "Web",
    points: 100,
    difficulty: 1,
    flag: "",
    link: "",
    enabled: true,
  })

  const handleToggleCTF = () => {
    setCTFRunning(!ctfRunning)
  }

  const handleCreateChallenge = () => {
    console.log("Creating challenge:", newChallenge)
    setShowChallengeModal(false)
    setNewChallenge({
      title: "",
      description: "",
      category: "Web",
      points: 100,
      difficulty: 1,
      flag: "",
      link: "",
      enabled: true,
    })
  }

  const handlePromoteUser = (userId: string) => {
    console.log("Promoting user:", userId)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Web: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Crypto: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      Reverse: "bg-red-500/20 text-red-400 border-red-500/30",
      Pwn: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      Forensics: "bg-green-500/20 text-green-400 border-green-500/30",
      Misc: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    }
    return colors[category] || colors["Misc"]
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced Navigation */}
      <nav className="bg-black/50 backdrop-blur-sm border-b border-orange-500/20 sticky top-0 z-50">
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
              <Badge variant="outline" className="text-orange-400 border-orange-500">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
              <p className="text-gray-400">Manage CTF platform, challenges, and users</p>
            </div>
          </div>
          <div className="w-full h-0.5 bg-gradient-to-r from-orange-500/50 via-orange-400/30 to-transparent" />
        </div>

        {/* CTF Control Panel */}
        <Card className="mb-8 bg-gray-900/50 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              CTF Control Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Competition Status</h3>
                <p className="text-gray-400">{ctfRunning ? "CTF is currently running" : "CTF is not started"}</p>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`px-4 py-2 rounded-full ${ctfRunning ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {ctfRunning ? (
                    <>
                      <Play className="w-4 h-4 inline mr-2" />
                      Running
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 inline mr-2" />
                      Stopped
                    </>
                  )}
                </div>
                <Button
                  onClick={handleToggleCTF}
                  className={ctfRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {ctfRunning ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Stop CTF
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start CTF
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Tabs */}
        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="bg-gray-900 border border-gray-700">
            <TabsTrigger value="challenges" className="data-[state=active]:bg-cyan-600">
              <Target className="w-4 h-4 mr-2" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-cyan-600">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-cyan-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-600">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-cyan-400">Challenge Management</CardTitle>
                  <Dialog open={showChallengeModal} onOpenChange={setShowChallengeModal}>
                    <DialogTrigger asChild>
                      <Button className="bg-cyan-600 hover:bg-cyan-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Challenge
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-cyan-400">Create New Challenge</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-300">Title</Label>
                            <Input
                              value={newChallenge.title}
                              onChange={(e) => setNewChallenge((prev) => ({ ...prev, title: e.target.value }))}
                              className="bg-gray-800 border-gray-600 text-white"
                              placeholder="Challenge title"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-300">Category</Label>
                            <Select
                              value={newChallenge.category}
                              onValueChange={(value) => setNewChallenge((prev) => ({ ...prev, category: value }))}
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="Web" className="text-white">
                                  Web
                                </SelectItem>
                                <SelectItem value="Crypto" className="text-white">
                                  Crypto
                                </SelectItem>
                                <SelectItem value="Reverse" className="text-white">
                                  Reverse
                                </SelectItem>
                                <SelectItem value="Pwn" className="text-white">
                                  Pwn
                                </SelectItem>
                                <SelectItem value="Forensics" className="text-white">
                                  Forensics
                                </SelectItem>
                                <SelectItem value="Misc" className="text-white">
                                  Misc
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label className="text-gray-300">Description</Label>
                          <Textarea
                            value={newChallenge.description}
                            onChange={(e) => setNewChallenge((prev) => ({ ...prev, description: e.target.value }))}
                            className="bg-gray-800 border-gray-600 text-white"
                            placeholder="Challenge description and instructions"
                            rows={4}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-300">Points</Label>
                            <Input
                              type="number"
                              value={newChallenge.points}
                              onChange={(e) =>
                                setNewChallenge((prev) => ({ ...prev, points: Number.parseInt(e.target.value) }))
                              }
                              className="bg-gray-800 border-gray-600 text-white"
                              min="1"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-300">Difficulty (1-5)</Label>
                            <Select
                              value={newChallenge.difficulty.toString()}
                              onValueChange={(value) =>
                                setNewChallenge((prev) => ({ ...prev, difficulty: Number.parseInt(value) }))
                              }
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="1" className="text-white">
                                  1 Star
                                </SelectItem>
                                <SelectItem value="2" className="text-white">
                                  2 Stars
                                </SelectItem>
                                <SelectItem value="3" className="text-white">
                                  3 Stars
                                </SelectItem>
                                <SelectItem value="4" className="text-white">
                                  4 Stars
                                </SelectItem>
                                <SelectItem value="5" className="text-white">
                                  5 Stars
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label className="text-gray-300">Flag</Label>
                          <Input
                            value={newChallenge.flag}
                            onChange={(e) => setNewChallenge((prev) => ({ ...prev, flag: e.target.value }))}
                            className="bg-gray-800 border-gray-600 text-white"
                            placeholder="CTF{flag_here}"
                          />
                        </div>

                        <div>
                          <Label className="text-gray-300">External Link (Optional)</Label>
                          <Input
                            value={newChallenge.link}
                            onChange={(e) => setNewChallenge((prev) => ({ ...prev, link: e.target.value }))}
                            className="bg-gray-800 border-gray-600 text-white"
                            placeholder="https://challenge-url.com"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={newChallenge.enabled}
                            onCheckedChange={(checked) => setNewChallenge((prev) => ({ ...prev, enabled: checked }))}
                          />
                          <Label className="text-gray-300">Enable challenge immediately</Label>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setShowChallengeModal(false)}
                            className="border-gray-600 text-gray-300"
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleCreateChallenge} className="bg-cyan-600 hover:bg-cyan-700">
                            Create Challenge
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={getCategoryColor(challenge.category)}>
                                {challenge.category}
                              </Badge>
                              <span className="text-cyan-400 font-bold">{challenge.points} pts</span>
                              <span className="text-yellow-400">
                                {"★".repeat(challenge.difficulty)}
                                {"☆".repeat(5 - challenge.difficulty)}
                              </span>
                              <span className="text-gray-400 text-sm">{challenge.solves} solves</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch checked={challenge.enabled} />
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-cyan-400">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-white">{user.display_name}</h3>
                            <Badge
                              variant="outline"
                              className={
                                user.role === "admin"
                                  ? "text-orange-400 border-orange-500"
                                  : "text-blue-400 border-blue-500"
                              }
                            >
                              {user.role === "admin" ? (
                                <>
                                  <Crown className="w-3 h-3 mr-1" />
                                  Admin
                                </>
                              ) : (
                                "Player"
                              )}
                            </Badge>
                          </div>
                          <div className="text-gray-400 text-sm mt-1">
                            <p>{user.email}</p>
                            <p>
                              Team: {user.team || "No team"} • Solves: {user.solves}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {user.role === "player" && (
                            <Button
                              onClick={() => handlePromoteUser(user.id)}
                              variant="outline"
                              size="sm"
                              className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
                            >
                              <Crown className="w-4 h-4 mr-2" />
                              Promote to Admin
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-cyan-400 text-lg">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">156</div>
                  <p className="text-gray-400 text-sm">+12 this week</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-cyan-400 text-lg">Active Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">42</div>
                  <p className="text-gray-400 text-sm">+5 this week</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-cyan-400 text-lg">Total Solves</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">1,247</div>
                  <p className="text-gray-400 text-sm">+89 today</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-cyan-400 text-lg">Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">24</div>
                  <p className="text-gray-400 text-sm">18 enabled</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900/50 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-cyan-400">Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Challenge Difficulty Distribution</h3>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((difficulty) => (
                        <div key={difficulty} className="flex items-center gap-4">
                          <span className="text-yellow-400 w-16">
                            {"★".repeat(difficulty)}
                            {"☆".repeat(5 - difficulty)}
                          </span>
                          <div className="flex-1 bg-gray-800 rounded-full h-2">
                            <div
                              className="bg-cyan-500 h-2 rounded-full"
                              style={{ width: `${Math.random() * 80 + 20}%` }}
                            />
                          </div>
                          <span className="text-gray-400 w-12 text-sm">{Math.floor(Math.random() * 10 + 1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {["Web", "Crypto", "Reverse", "Pwn", "Forensics", "Misc"].map((category) => (
                        <div key={category} className="p-3 bg-gray-800/50 rounded-lg">
                          <div className="text-white font-semibold">{category}</div>
                          <div className="text-gray-400 text-sm">{Math.floor(Math.random() * 8 + 2)} challenges</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-cyan-400">Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Platform Name</Label>
                    <Input defaultValue="CTF Platform" className="bg-gray-800 border-gray-600 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Max Team Size</Label>
                    <Input type="number" defaultValue="5" className="bg-gray-800 border-gray-600 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">CTF Start Time</Label>
                    <Input type="datetime-local" className="bg-gray-800 border-gray-600 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">CTF End Time</Label>
                    <Input type="datetime-local" className="bg-gray-800 border-gray-600 text-white" />
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Platform Features</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Allow Team Creation</Label>
                      <p className="text-gray-500 text-sm">Users can create and join teams</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Public Scoreboard</Label>
                      <p className="text-gray-500 text-sm">Scoreboard visible to all users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Registration Open</Label>
                      <p className="text-gray-500 text-sm">Allow new user registrations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Show Solve Count</Label>
                      <p className="text-gray-500 text-sm">Display number of solves per challenge</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button className="bg-cyan-600 hover:bg-cyan-700">Save Settings</Button>
                </div>
              </CardContent>
            </Card>

            {/* Backup & Export */}
            <Card className="bg-gray-900/50 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-cyan-400">Backup & Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Export User Data</Label>
                    <p className="text-gray-500 text-sm">Download all user data as CSV</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Export Challenge Data</Label>
                    <p className="text-gray-500 text-sm">Download all challenges and solves</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Platform Backup</Label>
                    <p className="text-gray-500 text-sm">Create full platform backup</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
