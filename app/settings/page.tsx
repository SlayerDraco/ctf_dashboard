// Settings Page
// User preferences and account settings

"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Save,
  User,
  Lock,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Moon,
  Sun,
  Monitor,
} from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    newChallenges: true,
    teamUpdates: true,
    scoreUpdates: false,
  })

  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "en",
    timezone: "UTC",
    difficulty: "all",
  })

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const handleSaveSettings = () => {
    setSaveMessage("Settings saved successfully!")
    setTimeout(() => setSaveMessage(null), 3000)
  }

  const handleDeleteAccount = () => {
    // This would trigger account deletion
    console.log("Account deletion requested")
    setShowDeleteDialog(false)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
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
              <Link href="/profile" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Profile
              </Link>
              <Link href="/teams" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Teams
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-gray-400">Manage your account preferences and security</p>
            </div>
          </div>
          <div className="w-full h-0.5 bg-gradient-to-r from-gray-500/50 via-gray-400/30 to-transparent" />
        </div>

        {/* Save Message */}
        {saveMessage && (
          <Alert className="mb-6 border-green-500 bg-green-500/10">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <AlertDescription className="text-green-400">{saveMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Account Information */}
          <Card className="bg-gray-900/50 border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Player ID</Label>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-800 px-3 py-2 rounded text-cyan-400 font-mono flex-1">PLAYER-ABC123</code>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
                      Copy
                    </Button>
                  </div>
                  <p className="text-gray-500 text-sm">Your unique player identifier</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Account Status</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400">Active</span>
                  </div>
                  <p className="text-gray-500 text-sm">Your account is in good standing</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="bg-gray-900/50 border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Email Notifications</Label>
                    <p className="text-gray-500 text-sm">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Browser Notifications</Label>
                    <p className="text-gray-500 text-sm">Show desktop notifications</p>
                  </div>
                  <Switch
                    checked={notifications.browser}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, browser: checked }))}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">New Challenges</Label>
                    <p className="text-gray-500 text-sm">Notify when new challenges are added</p>
                  </div>
                  <Switch
                    checked={notifications.newChallenges}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, newChallenges: checked }))}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Team Updates</Label>
                    <p className="text-gray-500 text-sm">Notify about team member activities</p>
                  </div>
                  <Switch
                    checked={notifications.teamUpdates}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, teamUpdates: checked }))}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Score Updates</Label>
                    <p className="text-gray-500 text-sm">Notify about leaderboard changes</p>
                  </div>
                  <Switch
                    checked={notifications.scoreUpdates}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, scoreUpdates: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Preferences */}
          <Card className="bg-gray-900/50 border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Display Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Theme</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, theme: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="dark" className="text-white">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="light" className="text-white">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="system" className="text-white">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="en" className="text-white">
                        English
                      </SelectItem>
                      <SelectItem value="es" className="text-white">
                        Español
                      </SelectItem>
                      <SelectItem value="fr" className="text-white">
                        Français
                      </SelectItem>
                      <SelectItem value="de" className="text-white">
                        Deutsch
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Timezone</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="UTC" className="text-white">
                        UTC
                      </SelectItem>
                      <SelectItem value="EST" className="text-white">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="PST" className="text-white">
                        Pacific Time
                      </SelectItem>
                      <SelectItem value="CET" className="text-white">
                        Central European Time
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Default Difficulty Filter</Label>
                  <Select
                    value={preferences.difficulty}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="all" className="text-white">
                        All Difficulties
                      </SelectItem>
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
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-gray-900/50 border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300 mb-2 block">Change Password</Label>
                  <div className="space-y-3">
                    <Input
                      type="password"
                      placeholder="Current password"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    <Button className="bg-cyan-600 hover:bg-cyan-700">
                      <Lock className="w-4 h-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div>
                  <Label className="text-gray-300 mb-2 block">Two-Factor Authentication</Label>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                    >
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-red-900/20 border-red-500/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-red-400">Delete Account</Label>
                  <p className="text-gray-400 text-sm">Permanently delete your account and all associated data</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(true)}
                  className="border-red-500 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>

              {showDeleteDialog && (
                <Alert className="border-red-500 bg-red-500/10">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <AlertDescription className="text-red-400">
                    <div className="space-y-3">
                      <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                      <div className="flex gap-2">
                        <Button onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                          Yes, Delete My Account
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteDialog(false)}
                          className="border-gray-600 text-gray-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="bg-cyan-600 hover:bg-cyan-700 px-8">
              <Save className="w-4 h-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
